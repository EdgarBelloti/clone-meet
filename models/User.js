const mongoose = require('mongoose');

// Definir o esquema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Isso adiciona createdAt e updatedAt automaticamente

// Exportar o modelo User
module.exports = mongoose.model('User', UserSchema);
