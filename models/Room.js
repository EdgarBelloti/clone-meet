// models/Room.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const roomSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, // Gera automaticamente um UUID para a sala
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  capacity: {
    type: Number,
    required: true,
    default:10,
  },
  isActive: {
    type: Boolean,
    default: true, // Salas serão ativas por padrão
  },
  createdAt: {
    type: Date,
    default: Date.now, // Data de criação automática
  },
  participants: [{ 
    type: String // Array de IDs de usuários
  }],
});

module.exports = mongoose.model('Room', roomSchema);
