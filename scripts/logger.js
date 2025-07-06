/* ========================================
   ISPMedia - Sistema de Logging
   ======================================== */

/**
 * Sistema de logging controlado por ambiente
 * Permite diferentes níveis de log e controle de output
 */
class Logger {
  constructor() {
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
    };

    this.colors = {
      DEBUG: "#6b7280",
      INFO: "#3b82f6",
      WARN: "#f59e0b",
      ERROR: "#ef4444",
    };

    this.icons = {
      DEBUG: "🔍",
      INFO: "ℹ️",
      WARN: "⚠️",
      ERROR: "❌",
    };

    this.currentLevel = this.getLevelFromConfig();
    this.enabled = this.isLoggingEnabled();
  }

  /**
   * Obtém o nível de log da configuração
   */
  getLevelFromConfig() {
    const configLevel = getConfig("dev.debugLevel") || "info";
    return this.levels[configLevel.toUpperCase()] || this.levels.INFO;
  }

  /**
   * Verifica se o logging está habilitado
   */
  isLoggingEnabled() {
    return getConfig("dev.showConsole") !== false;
  }

  /**
   * Formata a mensagem de log
   */
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const icon = this.icons[level];
    const prefix = `[${timestamp}] ${icon} ${level}:`;

    return {
      prefix,
      message,
      data,
      timestamp,
    };
  }

  /**
   * Aplica estilo colorido ao log
   */
  applyStyle(level, prefix, message) {
    const color = this.colors[level];
    const style = `color: ${color}; font-weight: bold;`;

    return [`%c${prefix}`, style, message];
  }

  /**
   * Executa o log se o nível for apropriado
   */
  log(level, message, data = null) {
    if (!this.enabled || this.levels[level] < this.currentLevel) {
      return;
    }

    const formatted = this.formatMessage(level, message, data);
    const styled = this.applyStyle(level, formatted.prefix, formatted.message);

    // Escolher método de console baseado no nível
    let consoleMethod = console.log;
    switch (level) {
      case "WARN":
        consoleMethod = console.warn;
        break;
      case "ERROR":
        consoleMethod = console.error;
        break;
      case "INFO":
        consoleMethod = console.info;
        break;
    }

    // Executar log
    if (data) {
      consoleMethod(...styled, data);
    } else {
      consoleMethod(...styled);
    }

    // Salvar no histórico se em desenvolvimento
    if (DEV_MODE) {
      this.saveToHistory(level, message, data);
    }
  }

  /**
   * Salva log no histórico para debugging
   */
  saveToHistory(level, message, data) {
    try {
      const logEntry = {
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      // Salvar no sessionStorage (máximo 100 entradas)
      const history = JSON.parse(
        sessionStorage.getItem("ispmedia_log_history") || "[]"
      );
      history.push(logEntry);

      // Manter apenas as últimas 100 entradas
      if (history.length > 100) {
        history.shift();
      }

      sessionStorage.setItem("ispmedia_log_history", JSON.stringify(history));
    } catch (error) {
      // Falha silenciosa ao salvar histórico
    }
  }

  /**
   * Métodos de conveniência para diferentes níveis
   */
  debug(message, data = null) {
    this.log("DEBUG", message, data);
  }

  info(message, data = null) {
    this.log("INFO", message, data);
  }

  warn(message, data = null) {
    this.log("WARN", message, data);
  }

  error(message, data = null) {
    this.log("ERROR", message, data);
  }

  /**
   * Log de performance
   */
  performance(label, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Log de requisições HTTP
   */
  http(method, url, status, duration = null) {
    const statusColor =
      status >= 400 ? "ERROR" : status >= 300 ? "WARN" : "INFO";
    const message = `${method} ${url} - ${status}`;

    if (duration) {
      this.log(statusColor, `${message} (${duration}ms)`);
    } else {
      this.log(statusColor, message);
    }
  }

  /**
   * Log de eventos de usuário
   */
  userEvent(event, details = null) {
    this.info(`👤 User Event: ${event}`, details);
  }

  /**
   * Log de erros com stack trace
   */
  exception(error, context = null) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
    };

    this.error(`💥 Exception: ${error.message}`, errorInfo);
  }

  /**
   * Obtém histórico de logs
   */
  getHistory() {
    try {
      return JSON.parse(sessionStorage.getItem("ispmedia_log_history") || "[]");
    } catch (error) {
      return [];
    }
  }

  /**
   * Limpa histórico de logs
   */
  clearHistory() {
    sessionStorage.removeItem("ispmedia_log_history");
    this.info("📝 Log history cleared");
  }

  /**
   * Exporta logs para arquivo
   */
  exportLogs() {
    const history = this.getHistory();
    const logData = {
      exported: new Date().toISOString(),
      app: APP_NAME,
      version: VERSION,
      logs: history,
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ispmedia-logs-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.info("📄 Logs exported successfully");
  }

  /**
   * Configura nível de log dinamicamente
   */
  setLevel(level) {
    if (this.levels[level.toUpperCase()] !== undefined) {
      this.currentLevel = this.levels[level.toUpperCase()];
      this.info(`📊 Log level changed to: ${level.toUpperCase()}`);
    } else {
      this.warn(`❓ Invalid log level: ${level}`);
    }
  }

  /**
   * Habilita/desabilita logging
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) {
      this.info("✅ Logging enabled");
    }
  }
}

// Criar instância global do logger
const logger = new Logger();

// Função de conveniência para compatibilidade
function log(message, data = null) {
  logger.info(message, data);
}

// Interceptar erros globais
window.addEventListener("error", (event) => {
  logger.exception(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Interceptar promises rejeitadas
window.addEventListener("unhandledrejection", (event) => {
  logger.error("🚫 Unhandled Promise Rejection", {
    reason: event.reason,
    stack: event.reason?.stack,
  });
});

// Exportar para uso global
window.logger = logger;
window.log = log;

// Log inicial
logger.info(`🚀 ${APP_NAME} v${VERSION} Logger initialized`);
logger.debug("Logger configuration:", {
  level: logger.currentLevel,
  enabled: logger.enabled,
  devMode: DEV_MODE,
});
