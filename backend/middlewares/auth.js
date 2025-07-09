const jwt = require("jsonwebtoken");
const { users } = require("../data/mockData");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acesso não fornecido" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Utilizador não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Acesso negado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Privilégios insuficientes" });
    }

    next();
  };
};

// Middleware opcional para rotas públicas que podem ter utilizador logado
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find((u) => u.id === decoded.userId);
    req.user = user || null;
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
