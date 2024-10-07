const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Pegar o token do header
  const token = req.header('x-auth-token');

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({ message: 'Autorização negada' });
  }

  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar o usuário ao request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
