/* ========================================
   ISPMedia - Configurações Globais
   ======================================== */

// Configurações do aplicativo
const APP_CONFIG = {
  name: "ISPMedia",
  version: "1.0.0",
  description: "Plataforma de Mídia Premium",
  author: "ISPMedia Team",

  // Configurações de desenvolvimento
  dev: {
    mode: true,
    debugLevel: "info", // 'debug', 'info', 'warn', 'error'
    showConsole: true,
    mockData: true,
  },

  // URLs e endpoints
  api: {
    baseUrl: "https://api.ispmedia.com",
    version: "v1",
    timeout: 10000,
    endpoints: {
      auth: "/auth",
      users: "/users",
      media: "/media",
      playlists: "/playlists",
      upload: "/upload",
    },
  },

  // Configurações de autenticação
  auth: {
    tokenKey: "ispmedia_token",
    userKey: "ispmedia_user",
    expirationTime: 24 * 60 * 60 * 1000, // 24 horas
    rememberMeTime: 7 * 24 * 60 * 60 * 1000, // 7 dias
    roles: {
      GUEST: "guest",
      USER: "user",
      ADMIN: "admin",
      SUPER_ADMIN: "super_admin",
    },
  },

  // Configurações de UI
  ui: {
    theme: "light",
    language: "pt-BR",
    animations: true,
    notifications: true,
    autoSave: true,
    pageSize: 20,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFileTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
    ],
  },

  // Configurações de performance
  performance: {
    cacheEnabled: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    lazyLoading: true,
    optimizeImages: true,
    compressionLevel: 0.8,
  },

  // Mensagens padrão
  messages: {
    errors: {
      generic: "Ocorreu um erro inesperado. Tente novamente.",
      network: "Erro de conexão. Verifique sua internet.",
      unauthorized: "Você não tem permissão para acessar este recurso.",
      notFound: "Recurso não encontrado.",
      validation: "Dados inválidos fornecidos.",
      fileSize: "Arquivo muito grande. Limite: 100MB.",
      fileType: "Tipo de arquivo não permitido.",
      required: "Este campo é obrigatório.",
    },
    success: {
      login: "Login realizado com sucesso!",
      logout: "Logout realizado com sucesso!",
      upload: "Upload realizado com sucesso!",
      save: "Salvo com sucesso!",
      delete: "Excluído com sucesso!",
      update: "Atualizado com sucesso!",
    },
    info: {
      loading: "Carregando...",
      processing: "Processando...",
      uploading: "Enviando arquivo...",
      saving: "Salvando...",
      welcome: "Bem-vindo ao ISPMedia!",
    },
  },

  // URLs de componentes
  components: {
    navbar: "components/navbar.html",
    footer: "components/footer.html",
    home: "components/home.html",
    login: "components/login.html",
    upload: "components/upload.html",
    playlist: "components/playlist.html",
    detalhes: "components/detalhes.html",
    admin: "components/admin.html",
  },

  // Configurações de SEO
  seo: {
    defaultTitle: "ISPMedia - Plataforma de Mídia Premium",
    defaultDescription:
      "A melhor plataforma para gerenciar e compartilhar sua mídia com design premium e funcionalidades avançadas.",
    defaultKeywords: "mídia, plataforma, premium, upload, playlist, streaming",
    ogImage: "images/og-image.png",
    twitterCard: "summary_large_image",
  },
};

// Configurações específicas do ambiente
const ENV_CONFIG = {
  development: {
    ...APP_CONFIG,
    dev: {
      ...APP_CONFIG.dev,
      mode: true,
      debugLevel: "debug",
      showConsole: true,
      mockData: true,
    },
    api: {
      ...APP_CONFIG.api,
      baseUrl: "http://localhost:3000",
    },
  },

  production: {
    ...APP_CONFIG,
    dev: {
      ...APP_CONFIG.dev,
      mode: false,
      debugLevel: "error",
      showConsole: false,
      mockData: false,
    },
  },
};

// Detectar ambiente
const IS_DEVELOPMENT =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "";

// Exportar configuração baseada no ambiente
const CONFIG = IS_DEVELOPMENT ? ENV_CONFIG.development : ENV_CONFIG.production;

// Constantes globais para compatibilidade
const APP_NAME = CONFIG.name;
const VERSION = CONFIG.version;
const DEV_MODE = CONFIG.dev.mode;
const API_BASE_URL = CONFIG.api.baseUrl;

// Função para obter configuração específica
function getConfig(path) {
  const keys = path.split(".");
  let value = CONFIG;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

// Função para definir configuração
function setConfig(path, newValue) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let obj = CONFIG;

  for (const key of keys) {
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }

  obj[lastKey] = newValue;
}

// Função para obter mensagem
function getMessage(type, key) {
  return getConfig(`messages.${type}.${key}`) || "Mensagem não encontrada";
}

// Função para validar tipo de arquivo
function isAllowedFileType(fileType) {
  return CONFIG.ui.allowedFileTypes.includes(fileType);
}

// Função para validar tamanho do arquivo
function isValidFileSize(fileSize) {
  return fileSize <= CONFIG.ui.maxFileSize;
}

// Exportar para uso global
window.CONFIG = CONFIG;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.getMessage = getMessage;
window.isAllowedFileType = isAllowedFileType;
window.isValidFileSize = isValidFileSize;

// Log da configuração inicial
if (DEV_MODE) {
  console.log("🚀 ISPMedia Config Loaded:", {
    name: APP_NAME,
    version: VERSION,
    mode: DEV_MODE ? "Development" : "Production",
    api: API_BASE_URL,
  });
}
