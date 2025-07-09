const express = require("express");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// @route   GET /api/reviews
// @desc    Listar críticas com filtros
// @access  Private
router.get("/", reviewController.getAll);

// @route   GET /api/reviews/stats
// @desc    Obter estatísticas de ratings para um item
// @access  Private
router.get("/stats", reviewController.getItemStats);

// @route   GET /api/reviews/:id
// @desc    Obter crítica por ID
// @access  Private
router.get("/:id", reviewController.getById);

// @route   POST /api/reviews
// @desc    Criar nova crítica
// @access  Private
router.post("/", reviewController.create);

// @route   PUT /api/reviews/:id
// @desc    Atualizar crítica
// @access  Private
router.put("/:id", reviewController.update);

// @route   DELETE /api/reviews/:id
// @desc    Eliminar crítica
// @access  Private
router.delete("/:id", reviewController.delete);

module.exports = router;
