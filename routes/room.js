const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const authMiddleware = require('../middleware/authMiddleware');
const { io } = require('../server'); // Certifique-se de que o Socket.io está acessível

/**
 * @swagger
 * /api/rooms/join:
 *   post:
 *     tags: [Rooms]
 *     summary: Juntar-se a uma sala de reunião
 *     description: Permite que um usuário entre em uma sala de reunião existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "60d5f484f10f4a29e0f5f5a6" # Exemplo de ID de sala
 *     responses:
 *       200:
 *         description: Usuário entrou na sala com sucesso.
 *       400:
 *         description: O roomId é necessário.
 *       404:
 *         description: Sala não encontrada.
 *       500:
 *         description: Erro ao entrar na sala.
 */
router.post('/join', authMiddleware, async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ message: 'O roomId é necessário.' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala não encontrada.' });
        }

        const userId = req.user.id;

        if (!room.participants.includes(userId)) {
            room.participants.push(userId);
            await room.save();

            // Emitir o evento 'join-room'
            if (io) {
                io.to(roomId).emit('join-room', { userId, roomId });
            } else {
                console.error('Socket.io não está definido.');
            }

            return res.status(200).json({ message: 'Você entrou na sala com sucesso.', room });
        } else {
            return res.status(400).json({ message: 'Você já está participando desta sala.' });
        }
    } catch (error) {
        console.error('Erro ao entrar na sala:', error);
        res.status(500).json({ message: 'Erro ao entrar na sala.' });
    }
});

/**
 * @swagger
 * /api/rooms/leave:
 *   post:
 *     tags: [Rooms]
 *     summary: Sair de uma sala de reunião
 *     description: Permite que um usuário saia de uma sala de reunião.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "60d5f484f10f4a29e0f5f5a6" # Exemplo de ID de sala
 *     responses:
 *       200:
 *         description: Usuário saiu da sala com sucesso.
 *       400:
 *         description: O roomId é necessário.
 *       404:
 *         description: Sala não encontrada.
 *       500:
 *         description: Erro ao sair da sala.
 */
router.post('/leave', authMiddleware, async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ message: 'O roomId é necessário.' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala não encontrada.' });
        }

        const userId = req.user.id;

        if (room.participants.includes(userId)) {
            room.participants = room.participants.filter(id => id !== userId);
            await room.save();

            // Emitir o evento 'leave-room'
            if (io) {
                io.to(roomId).emit('leave-room', { userId, roomId });
            } else {
                console.error('Socket.io não está definido.');
            }

            return res.status(200).json({ message: 'Você saiu da sala com sucesso.', room });
        } else {
            return res.status(400).json({ message: 'Você não está participando desta sala.' });
        }
    } catch (error) {
        console.error('Erro ao sair da sala:', error);
        res.status(500).json({ message: 'Erro ao sair da sala.' });
    }
});

module.exports = router;
