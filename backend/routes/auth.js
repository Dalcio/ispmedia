const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registar novo utilizador
// @access  Public
router.post("/register", authController.register);

// @route   POST /api/auth/login
// @desc    Login de utilizador
// @access  Public
router.post("/login", authController.login);

// @route   GET /api/auth/verify
// @desc    Verificar token JWT
// @access  Private
router.get("/verify", authMiddleware.authenticate, authController.verify);

// @route   POST /api/auth/refresh
// @desc    Renovar token JWT
// @access  Private
router.post("/refresh", authMiddleware.authenticate, authController.refresh);

module.exports = router;
