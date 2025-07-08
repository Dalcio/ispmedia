// ==================== SISTEMA DE LOGS ==================== //
const Logger = {
    /**
     * Log geral - apenas exibe se DEV_MODE estiver ativo
     */
    log: function(message, data = null) {
        if (CONFIG.DEV_MODE && CONFIG.DEBUG_LOGS) {
            console.log(`[${CONFIG.APP_NAME}] ${message}`, data || '');
        }
    },
    
    /**
     * Log de erro - sempre exibe
     */
    error: function(message, error = null) {
        console.error(`[${CONFIG.APP_NAME}] ERROR: ${message}`, error || '');
    },
    
    /**
     * Log de aviso - sempre exibe
     */
    warn: function(message, data = null) {
        console.warn(`[${CONFIG.APP_NAME}] WARNING: ${message}`, data || '');
    },
    
    /**
     * Log de informação - apenas exibe se DEV_MODE estiver ativo
     */
    info: function(message, data = null) {
        if (CONFIG.DEV_MODE && CONFIG.DEBUG_LOGS) {
            console.info(`[${CONFIG.APP_NAME}] INFO: ${message}`, data || '');
        }
    },
    
    /**
     * Log de sucesso - apenas exibe se DEV_MODE estiver ativo
     */
    success: function(message, data = null) {
        if (CONFIG.DEV_MODE && CONFIG.DEBUG_LOGS) {
            console.log(`[${CONFIG.APP_NAME}] SUCCESS: ${message}`, data || '');
        }
    },
    
    /**
     * Log de debug - apenas exibe se DEV_MODE estiver ativo
     */
    debug: function(message, data = null) {
        if (CONFIG.DEV_MODE && CONFIG.DEBUG_LOGS) {
            console.debug(`[${CONFIG.APP_NAME}] DEBUG: ${message}`, data || '');
        }
    }
};

// Torna o Logger global
window.Logger = Logger;
