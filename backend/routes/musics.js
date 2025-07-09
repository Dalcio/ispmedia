const express = require("express");
const musicController = require("../controllers/musicController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   GET /api/musics
// @desc    Listar todas as músicas
// @access  Public
router.get("/", authMiddleware.optionalAuth, musicController.getAll);

// @route   GET /api/musics/top
// @desc    Obter músicas mais tocadas
// @access  Public
router.get("/top", authMiddleware.optionalAuth, musicController.getTopPlayed);

// @route   GET /api/musics/:id
// @desc    Obter música por ID
// @access  Public
router.get("/:id", authMiddleware.optionalAuth, musicController.getById);

// @route   POST /api/musics/:id/play
// @desc    Incrementar contador de reproduções
// @access  Public
router.post(
  "/:id/play",
  authMiddleware.optionalAuth,
  musicController.incrementPlayCount
);

// @route   POST /api/musics
// @desc    Criar nova música
// @access  Private (Editor/Admin)
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("editor", "admin"),
  musicController.create
);

// @route   PUT /api/musics/:id
// @desc    Atualizar música
// @access  Private (Editor/Admin)
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("editor", "admin"),
  musicController.update
);

// @route   DELETE /api/musics/:id
// @desc    Eliminar música
// @access  Private (Admin only)
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  musicController.delete
);

module.exports = router;
