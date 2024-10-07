const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room'); 
const http = require('http');
const setupSwagger = require('./swagger'); // Importando o setupSwagger
const socketIo = require('socket.io'); // Importando o Socket.io

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB:', err));

// Criando o servidor HTTP
const server = http.createServer(app); 

// Inicializando o Socket.io
const io = socketIo(server);

// Configurando eventos do Socket.io
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

    // Evento de chat
    socket.on('chat-message', (message) => {
        console.log('Mensagem recebida:', message);
        // Emitir a mensagem para todos os sockets conectados
        io.emit('chat-message', message); // Enviar mensagem a todos os usuários conectados
    });

    // Desconectar o usuário
    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
        // Aqui você pode emitir um evento para notificar outros usuários sobre a desconexão
        socket.broadcast.emit('user-disconnected', socket.id);
    });
});

// Configurando o Express para servir arquivos estáticos
app.use(express.static(__dirname)); // Serve arquivos estáticos da raiz do projeto

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de salas de reunião
app.use('/api/rooms', roomRoutes); 

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

// Configurando o Swagger
setupSwagger(app); // Chama a função para configurar o Swagger

// Inicie o servidor
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
