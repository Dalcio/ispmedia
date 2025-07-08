// ==================== CONFIGURAÇÃO GLOBAL ==================== //
const CONFIG = {
    APP_NAME: 'ISPMedia',
    VERSION: '1.0.0',
    API_URL: '', // Para futuras implementações
    
    // Configurações de desenvolvimento
    DEV_MODE: true,
    DEBUG_LOGS: true,
    
    // Configurações de UI
    THEME: {
        PRIMARY_COLOR: '#1F7AE0',
        SECONDARY_COLOR: '#B0C4DE',
        BACKGROUND_COLOR: '#D4E6F1',
        TEXT_COLOR: '#2C3E50',
        BORDER_COLOR: '#E9ECEF'
    },
    
    // Configurações de armazenamento
    STORAGE: {
        SESSION_KEY: 'ispmedia_session',
        SETTINGS_KEY: 'ispmedia_settings',
        FILES_KEY: 'ispmedia_files'
    },
    
    // Configurações de upload
    UPLOAD: {
        MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
        ALLOWED_TYPES: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'video/ogg',
            'audio/mp3',
            'audio/wav',
            'audio/ogg',
            'application/pdf',
            'text/plain',
            'application/json'
        ]
    },
    
    // Configurações de animação
    ANIMATION: {
        DURATION_FAST: 150,
        DURATION_MEDIUM: 300,
        DURATION_SLOW: 500
    },
    
    // Mensagens padrão
    MESSAGES: {
        LOADING: 'Carregando...',
        ERROR_GENERIC: 'Ocorreu um erro inesperado.',
        ERROR_NETWORK: 'Erro de conexão. Verifique sua internet.',
        ERROR_UPLOAD: 'Erro ao enviar arquivo.',
        SUCCESS_UPLOAD: 'Arquivo enviado com sucesso!',
        SUCCESS_LOGIN: 'Login realizado com sucesso!',
        SUCCESS_LOGOUT: 'Logout realizado com sucesso!',
        CONFIRM_DELETE: 'Tem certeza que deseja excluir este item?',
        CONFIRM_LOGOUT: 'Tem certeza que deseja sair?'
    }
};

// Torna o CONFIG global
window.CONFIG = CONFIG;
