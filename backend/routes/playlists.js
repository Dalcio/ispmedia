const express = require("express");
const playlistController = require("../controllers/playlistController");

const router = express.Router();

// @route   GET /api/playlists/my
// @desc    Listar playlists do utilizador logado
// @access  Private
router.get("/my", playlistController.getMyPlaylists);

// @route   GET /api/playlists/public
// @desc    Listar playlists públicas
// @access  Private
router.get("/public", playlistController.getPublicPlaylists);

// @route   GET /api/playlists/:id
// @desc    Obter playlist por ID
// @access  Private
router.get("/:id", playlistController.getById);

// @route   POST /api/playlists
// @desc    Criar nova playlist
// @access  Private
router.post("/", playlistController.create);

// @route   PUT /api/playlists/:id
// @desc    Atualizar playlist
// @access  Private
router.put("/:id", playlistController.update);

// @route   DELETE /api/playlists/:id
// @desc    Eliminar playlist
// @access  Private
router.delete("/:id", playlistController.delete);

// @route   POST /api/playlists/:id/musics
// @desc    Adicionar música à playlist
// @access  Private
router.post("/:id/musics", playlistController.addMusic);

// @route   DELETE /api/playlists/:id/musics/:musicId
// @desc    Remover música da playlist
// @access  Private
router.delete("/:id/musics/:musicId", playlistController.removeMusic);

// @route   PUT /api/playlists/:id/reorder
// @desc    Reordenar músicas na playlist
// @access  Private
router.put("/:id/reorder", playlistController.reorderMusics);

module.exports = router;
