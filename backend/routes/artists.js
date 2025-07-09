const express = require("express");
const artistController = require("../controllers/artistController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   GET /api/artists
// @desc    Listar todos os artistas
// @access  Public
router.get("/", authMiddleware.optionalAuth, artistController.getAll);

// @route   GET /api/artists/:id
// @desc    Obter artista por ID
// @access  Public
router.get("/:id", authMiddleware.optionalAuth, artistController.getById);

// @route   GET /api/artists/:id/albums
// @desc    Obter álbuns do artista
// @access  Public
router.get(
  "/:id/albums",
  authMiddleware.optionalAuth,
  artistController.getAlbums
);

// @route   GET /api/artists/:id/musics
// @desc    Obter músicas do artista
// @access  Public
router.get(
  "/:id/musics",
  authMiddleware.optionalAuth,
  artistController.getMusics
);

// @route   POST /api/artists
// @desc    Criar novo artista
// @access  Private (Editor/Admin)
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("editor", "admin"),
  artistController.create
);

// @route   PUT /api/artists/:id
// @desc    Atualizar artista
// @access  Private (Editor/Admin)
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("editor", "admin"),
  artistController.update
);

// @route   DELETE /api/artists/:id
// @desc    Eliminar artista
// @access  Private (Admin only)
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  artistController.delete
);

module.exports = router;
