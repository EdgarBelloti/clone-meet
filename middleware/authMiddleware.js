// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.user.id }; // Certifique-se de que req.user tem o ID do usuário
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
