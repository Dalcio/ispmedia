const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users, getNextId } = require("../data/mockData");

const authController = {
  // Registo de novo utilizador
  register: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        role = "visitante",
      } = req.body;

      // Validações básicas
      if (!username || !email || !password) {
        return res.status(400).json({
          error: "Username, email e password são obrigatórios",
        });
      }

      // Verificar se utilizador já existe
      const existingUser = users.find(
        (u) => u.username === username || u.email === email
      );

      if (existingUser) {
        return res.status(409).json({
          error: "Username ou email já existem",
        });
      }

      // Validar role
      const validRoles = ["visitante", "editor", "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: "Role inválido. Use: visitante, editor ou admin",
        });
      }

      // Hash da password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Criar novo utilizador
      const newUser = {
        id: getNextId("users"),
        username,
        email,
        password: hashedPassword,
        role,
        firstName: firstName || "",
        lastName: lastName || "",
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);

      // Gerar token JWT
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remover password da resposta
      const { password: _, ...userResponse } = newUser;

      res.status(201).json({
        message: "Utilizador registado com sucesso",
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error("Erro no registo:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username e password são obrigatórios",
        });
      }

      // Encontrar utilizador
      const user = users.find(
        (u) => u.username === username || u.email === username
      );

      if (!user) {
        return res.status(401).json({
          error: "Credenciais inválidas",
        });
      }

      // Verificar password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          error: "Credenciais inválidas",
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remover password da resposta
      const { password: _, ...userResponse } = user;

      res.json({
        message: "Login realizado com sucesso",
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Verificar token
  verify: (req, res) => {
    try {
      // Remover password da resposta
      const { password: _, ...userResponse } = req.user;

      res.json({
        valid: true,
        user: userResponse,
      });
    } catch (error) {
      res.status(401).json({
        valid: false,
        error: "Token inválido",
      });
    }
  },

  // Renovar token
  refresh: (req, res) => {
    try {
      const user = req.user;

      // Gerar novo token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: "Token renovado com sucesso",
        token,
      });
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = authController;
