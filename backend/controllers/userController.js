const bcrypt = require("bcrypt");
const { users, getNextId } = require("../data/mockData");

const userController = {
  // Listar todos os utilizadores (apenas admin)
  getAll: (req, res) => {
    try {
      const usersResponse = users.map(({ password, ...user }) => user);
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter utilizador por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const user = users.find((u) => u.id === parseInt(id));

      if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      // Remover password da resposta
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter perfil do utilizador logado
  getProfile: (req, res) => {
    try {
      const { password, ...userResponse } = req.user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar perfil do utilizador logado
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, email, currentPassword, newPassword } =
        req.body;

      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      const user = users[userIndex];

      // Se está a mudar a password, verificar a atual
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            error: "Password atual é obrigatória para alterar a password",
          });
        }

        const validPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!validPassword) {
          return res.status(400).json({ error: "Password atual incorreta" });
        }

        // Hash da nova password
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
      }

      // Verificar se email já existe (se está a mudar)
      if (email && email !== user.email) {
        const emailExists = users.find(
          (u) => u.email === email && u.id !== userId
        );
        if (emailExists) {
          return res.status(409).json({ error: "Email já está em uso" });
        }
        user.email = email;
      }

      // Atualizar outros campos
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      user.updatedAt = new Date();

      // Remover password da resposta
      const { password, ...userResponse } = user;
      res.json({
        message: "Perfil atualizado com sucesso",
        user: userResponse,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar utilizador (apenas admin)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, firstName, lastName, role, password } = req.body;

      const userIndex = users.findIndex((u) => u.id === parseInt(id));
      if (userIndex === -1) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      const user = users[userIndex];

      // Verificar se username já existe (se está a mudar)
      if (username && username !== user.username) {
        const usernameExists = users.find(
          (u) => u.username === username && u.id !== parseInt(id)
        );
        if (usernameExists) {
          return res.status(409).json({ error: "Username já está em uso" });
        }
        user.username = username;
      }

      // Verificar se email já existe (se está a mudar)
      if (email && email !== user.email) {
        const emailExists = users.find(
          (u) => u.email === email && u.id !== parseInt(id)
        );
        if (emailExists) {
          return res.status(409).json({ error: "Email já está em uso" });
        }
        user.email = email;
      }

      // Atualizar password se fornecida
      if (password) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);
      }

      // Validar role
      if (role) {
        const validRoles = ["visitante", "editor", "admin"];
        if (!validRoles.includes(role)) {
          return res.status(400).json({
            error: "Role inválido. Use: visitante, editor ou admin",
          });
        }
        user.role = role;
      }

      // Atualizar outros campos
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      user.updatedAt = new Date();

      // Remover password da resposta
      const { password: _, ...userResponse } = user;
      res.json({
        message: "Utilizador atualizado com sucesso",
        user: userResponse,
      });
    } catch (error) {
      console.error("Erro ao atualizar utilizador:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Eliminar utilizador (apenas admin)
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const userIndex = users.findIndex((u) => u.id === parseInt(id));

      if (userIndex === -1) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      // Não permitir eliminar o próprio utilizador
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          error: "Não é possível eliminar o próprio utilizador",
        });
      }

      users.splice(userIndex, 1);
      res.json({ message: "Utilizador eliminado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = userController;
