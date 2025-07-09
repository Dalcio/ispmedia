const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   GET /api/users
// @desc    Listar todos os utilizadores
// @access  Private (Admin only)
router.get("/", authMiddleware.authorize("admin"), userController.getAll);

// @route   GET /api/users/profile
// @desc    Obter perfil do utilizador logado
// @access  Private
router.get("/profile", userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Atualizar perfil do utilizador logado
// @access  Private
router.put("/profile", userController.updateProfile);

// @route   GET /api/users/:id
// @desc    Obter utilizador por ID
// @access  Private
router.get("/:id", userController.getById);

// @route   PUT /api/users/:id
// @desc    Atualizar utilizador
// @access  Private (Admin only)
router.put("/:id", authMiddleware.authorize("admin"), userController.update);

// @route   DELETE /api/users/:id
// @desc    Eliminar utilizador
// @access  Private (Admin only)
router.delete("/:id", authMiddleware.authorize("admin"), userController.delete);

module.exports = router;
