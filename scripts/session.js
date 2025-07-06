/* ========================================
   ISPMedia - Gerenciamento de Sessão
   ======================================== */

/**
 * Classe para gerenciar sessão de usuário
 */
class SessionManager {
  constructor() {
    this.storageKey = getConfig("auth.userKey") || "ispmedia_user";
    this.tokenKey = getConfig("auth.tokenKey") || "ispmedia_token";
    this.expirationTime =
      getConfig("auth.expirationTime") || 24 * 60 * 60 * 1000; // 24 horas
    this.roles = getConfig("auth.roles") || {
      GUEST: "guest",
      USER: "user",
      ADMIN: "admin",
      SUPER_ADMIN: "super_admin",
    };

    this.currentUser = null;
    this.sessionTimeout = null;

    // Inicializar sessão
    this.initialize();
  }

  /**
   * Inicializa a sessão verificando dados existentes
   */
  initialize() {
    try {
      const userData = sessionStorage.getItem(this.storageKey);
      if (userData) {
        const user = JSON.parse(userData);
        if (this.isValidSession(user)) {
          this.currentUser = user;
          this.startSessionTimer();
          logger.info("Session restored for user:", user.email);
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      logger.error("Error initializing session:", error);
      this.clearSession();
    }
  }

  /**
   * Verifica se a sessão é válida
   * @param {Object} user - Dados do usuário
   * @returns {boolean}
   */
  isValidSession(user) {
    if (!user || !user.sessionExpiry) {
      return false;
    }

    const now = Date.now();
    const expiry = new Date(user.sessionExpiry).getTime();

    return now < expiry;
  }

  /**
   * Realiza login do usuário
   * @param {Object} credentials - Credenciais do usuário
   * @param {boolean} rememberMe - Lembrar usuário
   * @returns {Promise<Object>}
   */
  async login(credentials, rememberMe = false) {
    try {
      logger.info("Attempting login for:", credentials.email);

      // Validar credenciais
      if (!credentials.email || !credentials.password) {
        throw new Error("Email e senha são obrigatórios");
      }

      if (!isValidEmail(credentials.email)) {
        throw new Error("Email inválido");
      }

      // Simular autenticação (substituir por chamada real à API)
      const loginResponse = await this.authenticateUser(credentials);

      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Credenciais inválidas");
      }

      // Criar sessão
      const user = this.createUserSession(loginResponse.user, rememberMe);

      // Salvar na storage
      this.saveSession(user);

      // Definir usuário atual
      this.currentUser = user;

      // Iniciar timer de sessão
      this.startSessionTimer();

      logger.info("Login successful for:", user.email);
      logger.userEvent("login", { email: user.email, role: user.role });

      return {
        success: true,
        user: user,
        message: getMessage("success", "login"),
      };
    } catch (error) {
      logger.error("Login failed:", error);
      return {
        success: false,
        message: error.message || getMessage("errors", "generic"),
      };
    }
  }

  /**
   * Simula autenticação do usuário (substituir por API real)
   * @param {Object} credentials - Credenciais
   * @returns {Promise<Object>}
   */
  async authenticateUser(credentials) {
    // Simular delay da API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Usuários de teste (remover em produção)
    const testUsers = [
      {
        id: 1,
        email: "admin@ispmedia.com",
        password: "admin123",
        name: "Administrador",
        role: this.roles.ADMIN,
        avatar: null,
      },
      {
        id: 2,
        email: "user@ispmedia.com",
        password: "user123",
        name: "Usuário Teste",
        role: this.roles.USER,
        avatar: null,
      },
    ];

    const user = testUsers.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
      };
    } else {
      return {
        success: false,
        message: "Email ou senha incorretos",
      };
    }
  }

  /**
   * Cria sessão do usuário
   * @param {Object} userData - Dados do usuário
   * @param {boolean} rememberMe - Lembrar usuário
   * @returns {Object}
   */
  createUserSession(userData, rememberMe = false) {
    const now = Date.now();
    const expirationTime = rememberMe
      ? getConfig("auth.rememberMeTime") || 7 * 24 * 60 * 60 * 1000
      : this.expirationTime;

    return {
      ...userData,
      sessionId: this.generateSessionId(),
      loginTime: new Date(now).toISOString(),
      sessionExpiry: new Date(now + expirationTime).toISOString(),
      rememberMe: rememberMe,
      lastActivity: new Date(now).toISOString(),
    };
  }

  /**
   * Gera ID único para sessão
   * @returns {string}
   */
  generateSessionId() {
    return "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Salva sessão na storage
   * @param {Object} user - Dados do usuário
   */
  saveSession(user) {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(user));

      // Salvar token se existir
      if (user.token) {
        sessionStorage.setItem(this.tokenKey, user.token);
      }
    } catch (error) {
      logger.error("Error saving session:", error);
    }
  }

  /**
   * Inicia timer de sessão
   */
  startSessionTimer() {
    this.clearSessionTimer();

    if (this.currentUser) {
      const now = Date.now();
      const expiry = new Date(this.currentUser.sessionExpiry).getTime();
      const timeLeft = expiry - now;

      if (timeLeft > 0) {
        this.sessionTimeout = setTimeout(() => {
          this.handleSessionExpiry();
        }, timeLeft);

        logger.debug(
          `Session timer started: ${Math.round(timeLeft / 1000)}s remaining`
        );
      }
    }
  }

  /**
   * Limpa timer de sessão
   */
  clearSessionTimer() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  /**
   * Manipula expiração da sessão
   */
  handleSessionExpiry() {
    logger.info("Session expired");
    renderAlert("Sua sessão expirou. Faça login novamente.", "warning");
    this.logout();
  }

  /**
   * Realiza logout do usuário
   */
  logout() {
    try {
      const userEmail = this.currentUser?.email;

      // Limpar timer
      this.clearSessionTimer();

      // Limpar storage
      this.clearSession();

      // Limpar usuário atual
      this.currentUser = null;

      logger.info("Logout successful for:", userEmail);
      logger.userEvent("logout", { email: userEmail });

      // Redirecionar para login
      navigateToPage("login");

      // Mostrar mensagem
      renderAlert(getMessage("success", "logout"), "success");
    } catch (error) {
      logger.error("Error during logout:", error);
    }
  }

  /**
   * Limpa dados da sessão
   */
  clearSession() {
    try {
      sessionStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.tokenKey);
    } catch (error) {
      logger.error("Error clearing session:", error);
    }
  }

  /**
   * Obtém usuário atual
   * @returns {Object|null}
   */
  getUser() {
    return this.currentUser;
  }

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.currentUser !== null && this.isValidSession(this.currentUser);
  }

  /**
   * Obtém papel do usuário
   * @returns {string}
   */
  getUserRole() {
    return this.currentUser?.role || this.roles.GUEST;
  }

  /**
   * Verifica se usuário tem papel específico
   * @param {string} role - Papel a verificar
   * @returns {boolean}
   */
  hasRole(role) {
    return this.getUserRole() === role;
  }

  /**
   * Verifica se usuário é administrador
   * @returns {boolean}
   */
  isAdmin() {
    return (
      this.hasRole(this.roles.ADMIN) || this.hasRole(this.roles.SUPER_ADMIN)
    );
  }

  /**
   * Atualiza dados do usuário
   * @param {Object} userData - Novos dados
   */
  updateUser(userData) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...userData };
      this.currentUser.lastActivity = new Date().toISOString();
      this.saveSession(this.currentUser);

      logger.info("User data updated:", userData);
    }
  }

  /**
   * Atualiza atividade do usuário
   */
  updateActivity() {
    if (this.currentUser) {
      this.currentUser.lastActivity = new Date().toISOString();
      this.saveSession(this.currentUser);
    }
  }

  /**
   * Obtém token de autenticação
   * @returns {string|null}
   */
  getToken() {
    try {
      return sessionStorage.getItem(this.tokenKey);
    } catch (error) {
      logger.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Obtém informações da sessão
   * @returns {Object}
   */
  getSessionInfo() {
    if (!this.currentUser) {
      return null;
    }

    const now = Date.now();
    const expiry = new Date(this.currentUser.sessionExpiry).getTime();

    return {
      sessionId: this.currentUser.sessionId,
      loginTime: this.currentUser.loginTime,
      sessionExpiry: this.currentUser.sessionExpiry,
      timeRemaining: Math.max(0, expiry - now),
      isActive: this.isValidSession(this.currentUser),
      rememberMe: this.currentUser.rememberMe,
      lastActivity: this.currentUser.lastActivity,
    };
  }

  /**
   * Estende sessão
   * @param {number} additionalTime - Tempo adicional em ms
   */
  extendSession(additionalTime) {
    if (this.currentUser) {
      const currentExpiry = new Date(this.currentUser.sessionExpiry).getTime();
      const newExpiry = new Date(currentExpiry + additionalTime).toISOString();

      this.currentUser.sessionExpiry = newExpiry;
      this.saveSession(this.currentUser);
      this.startSessionTimer();

      logger.info(`Session extended by ${additionalTime}ms`);
    }
  }
}

// Criar instância global
const Session = new SessionManager();

// Atualizar atividade em interações do usuário
document.addEventListener("click", () => Session.updateActivity());
document.addEventListener("keypress", () => Session.updateActivity());

// Lidar com mudanças de foco da janela
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    Session.updateActivity();
  }
});

// Verificar sessão periodicamente
setInterval(() => {
  if (Session.isAuthenticated()) {
    Session.updateActivity();
  }
}, 60000); // A cada minuto

// Exportar para uso global
window.Session = Session;

// Log inicial
logger.info("🔐 Session manager initialized");
logger.debug("Session info:", Session.getSessionInfo());
