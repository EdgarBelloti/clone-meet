const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); // Certifique-se de que o modelo Room está corretamente importado
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para autenticação

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Criar uma nova sala de reunião
 *     description: Permite que um usuário crie uma nova sala de reunião.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Reunião de Projetos" # Exemplo de nome da sala
 *               capacity:
 *                 type: number
 *                 example: 10 # Exemplo de capacidade da sala
 *     responses:
 *       201:
 *         description: Sala criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro ao criar a sala.
 */
router.post('/', authMiddleware, async (req, res) => {
    const { name, capacity } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'O nome da sala é necessário.' });
    }

    try {
        const room = new Room({ name, capacity, participants: [] });
        await room.save();
        res.status(201).json({ message: 'Sala criada com sucesso.', room });
    } catch (error) {
        console.error('Erro ao criar a sala:', error);
        res.status(500).json({ message: 'Erro ao criar a sala.' });
    }
});

/**
 * @swagger
 * /api/rooms/join:
 *   post:
 *     tags: [Rooms]
 *     summary: Entrar em uma sala de reunião
 *     description: Permite que um usuário entre em uma sala de reunião.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "ID_DA_SALA" # Exemplo de ID da sala
 *     responses:
 *       200:
 *         description: Usuário entrou na sala com sucesso.
 *       404:
 *         description: Sala não encontrada.
 *       500:
 *         description: Erro ao entrar na sala.
 */
router.post('/join', authMiddleware, async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ message: 'O ID da sala é necessário.' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala não encontrada.' });
        }

        room.participants.push(req.user.id); // Adicione o ID do usuário aos participantes
        await room.save();

        res.status(200).json({ message: 'Você entrou na sala com sucesso.', room });
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
 *                 example: "ID_DA_SALA" # Exemplo de ID da sala
 *     responses:
 *       200:
 *         description: Usuário saiu da sala com sucesso.
 *       404:
 *         description: Sala não encontrada.
 *       500:
 *         description: Erro ao sair da sala.
 */
router.post('/leave', authMiddleware, async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ message: 'O ID da sala é necessário.' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala não encontrada.' });
        }

        room.participants = room.participants.filter(participant => participant !== req.user.id);
        await room.save();

        res.status(200).json({ message: 'Você saiu da sala com sucesso.', room });
    } catch (error) {
        console.error('Erro ao sair da sala:', error);
        res.status(500).json({ message: 'Erro ao sair da sala.' });
    }
});

// Exporte as rotas
module.exports = router;
