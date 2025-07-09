const express = require("express");
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   POST /api/upload/music
// @desc    Upload de ficheiro de música
// @access  Private (Editor/Admin)
router.post(
  "/music",
  authMiddleware.authorize("editor", "admin"),
  uploadController.uploadMusic
);

// @route   POST /api/upload/image
// @desc    Upload de imagem
// @access  Private
router.post("/image", uploadController.uploadImage);

// @route   POST /api/upload/multiple
// @desc    Upload de múltiplos ficheiros
// @access  Private (Editor/Admin)
router.post(
  "/multiple",
  authMiddleware.authorize("editor", "admin"),
  uploadController.uploadMultiple
);

// @route   GET /api/upload/files
// @desc    Listar ficheiros
// @access  Private
router.get("/files", uploadController.listFiles);

// @route   GET /api/upload/files/:filename
// @desc    Obter informações de um ficheiro
// @access  Private
router.get("/files/:filename", uploadController.getFileInfo);

// @route   DELETE /api/upload/files/:filename
// @desc    Eliminar ficheiro
// @access  Private (Editor/Admin)
router.delete(
  "/files/:filename",
  authMiddleware.authorize("editor", "admin"),
  uploadController.deleteFile
);

module.exports = router;
