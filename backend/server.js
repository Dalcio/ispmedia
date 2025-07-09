const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Importar rotas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const musicRoutes = require("./routes/musics");
const albumRoutes = require("./routes/albums");
const artistRoutes = require("./routes/artists");
const playlistRoutes = require("./routes/playlists");
const reviewRoutes = require("./routes/reviews");
const uploadRoutes = require("./routes/upload");

// Middleware de autenticação
const authMiddleware = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir arquivos estáticos (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota de saúde
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ISPMedia API is running",
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware.authenticate, userRoutes);
app.use("/api/musics", musicRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/playlists", authMiddleware.authenticate, playlistRoutes);
app.use("/api/reviews", authMiddleware.authenticate, reviewRoutes);
app.use("/api/upload", authMiddleware.authenticate, uploadRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro:", err.stack);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ISPMedia rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
