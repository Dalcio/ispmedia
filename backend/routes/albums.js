const express = require("express");
const albumController = require("../controllers/albumController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   GET /api/albums
// @desc    Listar todos os álbuns
// @access  Public
router.get("/", authMiddleware.optionalAuth, albumController.getAll);

// @route   GET /api/albums/:id
// @desc    Obter álbum por ID
// @access  Public
router.get("/:id", authMiddleware.optionalAuth, albumController.getById);

// @route   GET /api/albums/:id/musics
// @desc    Obter músicas do álbum
// @access  Public
router.get(
  "/:id/musics",
  authMiddleware.optionalAuth,
  albumController.getMusics
);

// @route   POST /api/albums
// @desc    Criar novo álbum
// @access  Private (Editor/Admin)
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("editor", "admin"),
  albumController.create
);

// @route   PUT /api/albums/:id
// @desc    Atualizar álbum
// @access  Private (Editor/Admin)
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("editor", "admin"),
  albumController.update
);

// @route   DELETE /api/albums/:id
// @desc    Eliminar álbum
// @access  Private (Admin only)
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  albumController.delete
);

module.exports = router;
