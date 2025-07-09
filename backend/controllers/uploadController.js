const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuração do multer para upload de ficheiros
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "uploads");

    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Criar subdiretórios por tipo
    let subDir = "";
    if (file.fieldname === "music") {
      subDir = "musics";
    } else if (file.fieldname === "cover" || file.fieldname === "image") {
      subDir = "images";
    } else if (file.fieldname === "avatar") {
      subDir = "avatars";
    } else {
      subDir = "others";
    }

    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o ficheiro
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 50);

    cb(null, baseName + "-" + uniqueSuffix + extension);
  },
});

// Filtro de ficheiros
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "music") {
    // Ficheiros de áudio
    const allowedMimeTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/aac",
      "audio/flac",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de ficheiro de áudio não suportado"), false);
    }
  } else if (
    file.fieldname === "cover" ||
    file.fieldname === "image" ||
    file.fieldname === "avatar"
  ) {
    // Ficheiros de imagem
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de ficheiro de imagem não suportado"), false);
    }
  } else {
    cb(new Error("Campo de ficheiro não reconhecido"), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5, // Máximo 5 ficheiros por vez
  },
});

const uploadController = {
  // Upload de ficheiro de música
  uploadMusic: (req, res) => {
    upload.single("music")(req, res, (err) => {
      if (err) {
        console.error("Erro no upload:", err);
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ error: "Ficheiro muito grande. Máximo 50MB." });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res
              .status(400)
              .json({ error: "Campo de ficheiro inesperado." });
          }
        }
        return res.status(400).json({ error: err.message || "Erro no upload" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum ficheiro enviado" });
      }

      const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/musics/${req.file.filename}`,
      };

      res.json({
        message: "Ficheiro de música carregado com sucesso",
        file: fileInfo,
      });
    });
  },

  // Upload de imagem (capa, avatar, etc.)
  uploadImage: (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Erro no upload:", err);
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ error: "Ficheiro muito grande. Máximo 50MB." });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res
              .status(400)
              .json({ error: "Campo de ficheiro inesperado." });
          }
        }
        return res.status(400).json({ error: err.message || "Erro no upload" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum ficheiro enviado" });
      }

      const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/images/${req.file.filename}`,
      };

      res.json({
        message: "Imagem carregada com sucesso",
        file: fileInfo,
      });
    });
  },

  // Upload de múltiplos ficheiros
  uploadMultiple: (req, res) => {
    upload.fields([
      { name: "music", maxCount: 1 },
      { name: "cover", maxCount: 1 },
      { name: "image", maxCount: 3 },
    ])(req, res, (err) => {
      if (err) {
        console.error("Erro no upload:", err);
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ error: "Ficheiro muito grande. Máximo 50MB." });
          } else if (err.code === "LIMIT_FILE_COUNT") {
            return res
              .status(400)
              .json({ error: "Muitos ficheiros enviados." });
          }
        }
        return res.status(400).json({ error: err.message || "Erro no upload" });
      }

      const uploadedFiles = {};

      Object.keys(req.files || {}).forEach((fieldName) => {
        uploadedFiles[fieldName] = req.files[fieldName].map((file) => ({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          url: `/uploads/${fieldName === "music" ? "musics" : "images"}/${
            file.filename
          }`,
        }));
      });

      res.json({
        message: "Ficheiros carregados com sucesso",
        files: uploadedFiles,
      });
    });
  },

  // Eliminar ficheiro
  deleteFile: (req, res) => {
    try {
      const { filename } = req.params;
      const { type } = req.query; // 'music', 'image', 'avatar'

      if (!filename || !type) {
        return res.status(400).json({
          error: "Nome do ficheiro e tipo são obrigatórios",
        });
      }

      let subDir = "";
      switch (type) {
        case "music":
          subDir = "musics";
          break;
        case "image":
        case "cover":
          subDir = "images";
          break;
        case "avatar":
          subDir = "avatars";
          break;
        default:
          subDir = "others";
      }

      const filePath = path.join(__dirname, "..", "uploads", subDir, filename);

      // Verificar se ficheiro existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Ficheiro não encontrado" });
      }

      // Eliminar ficheiro
      fs.unlinkSync(filePath);

      res.json({ message: "Ficheiro eliminado com sucesso" });
    } catch (error) {
      console.error("Erro ao eliminar ficheiro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Listar ficheiros
  listFiles: (req, res) => {
    try {
      const { type } = req.query;
      const uploadsDir = path.join(__dirname, "..", "uploads");

      if (!fs.existsSync(uploadsDir)) {
        return res.json({ files: [] });
      }

      let directories = [];
      if (type) {
        const subDir =
          type === "music"
            ? "musics"
            : type === "avatar"
            ? "avatars"
            : "images";
        directories = [subDir];
      } else {
        directories = ["musics", "images", "avatars", "others"];
      }

      const allFiles = [];

      directories.forEach((dir) => {
        const dirPath = path.join(uploadsDir, dir);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);

            allFiles.push({
              filename: file,
              type: dir,
              size: stats.size,
              createdAt: stats.birthtime,
              url: `/uploads/${dir}/${file}`,
            });
          });
        }
      });

      // Ordenar por data de criação (mais recentes primeiro)
      allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({ files: allFiles });
    } catch (error) {
      console.error("Erro ao listar ficheiros:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter informações de um ficheiro
  getFileInfo: (req, res) => {
    try {
      const { filename } = req.params;
      const { type } = req.query;

      if (!filename || !type) {
        return res.status(400).json({
          error: "Nome do ficheiro e tipo são obrigatórios",
        });
      }

      let subDir = "";
      switch (type) {
        case "music":
          subDir = "musics";
          break;
        case "image":
        case "cover":
          subDir = "images";
          break;
        case "avatar":
          subDir = "avatars";
          break;
        default:
          subDir = "others";
      }

      const filePath = path.join(__dirname, "..", "uploads", subDir, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Ficheiro não encontrado" });
      }

      const stats = fs.statSync(filePath);

      const fileInfo = {
        filename,
        type: subDir,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        url: `/uploads/${subDir}/${filename}`,
      };

      res.json(fileInfo);
    } catch (error) {
      console.error("Erro ao obter informações do ficheiro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = uploadController;
