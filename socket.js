// socket.js
const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id);

    // Evento de sinalização
    socket.on('signal', (data) => {
      const { to, signal } = data; // Acesse o destinatário e o sinal
      console.log(`Sinal enviado para ${to}:`, signal);

      // Envie o sinal para o usuário específico
      if (to) {
        socket.to(to).emit('signal', {
          signal,
          from: socket.id, // Inclua o ID do remetente
        });
      }
    });

    // Desconectar o usuário
    socket.on('disconnect', () => {
      console.log('Usuário desconectado:', socket.id);
      // Emitir um evento para notificar outros usuários sobre a desconexão
      socket.broadcast.emit('user-disconnected', socket.id);
    });
  });

  return io; // Retorne o objeto io para uso externo
};
