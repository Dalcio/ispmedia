/* ========================================
   ISPMedia - Aplicação Principal
   ======================================== */

/**
 * Classe principal da aplicação
 */
class ISPMediaApp {
  constructor() {
    this.initialized = false;
    this.version = VERSION;
    this.startTime = performance.now();

    // Configurações da aplicação
    this.config = {
      autoInit: true,
      loadComponents: true,
      enableAnimations: true,
      enableNotifications: true,
    };

    // Estado da aplicação
    this.state = {
      isLoading: false,
      currentPage: null,
      user: null,
      theme: "light",
      language: "pt-BR",
    };

    // Inicializar aplicação
    if (this.config.autoInit) {
      this.initialize();
    }
  }

  /**
   * Inicializa a aplicação
   */
  async initialize() {
    try {
      logger.info(`🚀 Initializing ${APP_NAME} v${this.version}`);

      // Mostrar loader
      this.showLoader();

      // Carregar sprite de ícones
      await this.loadIconSprite();

      // Configurar aplicação
      await this.setupApplication();

      // Carregar componentes UI
      await this.loadUIComponents();

      // Configurar eventos
      this.setupEventListeners();

      // Inicializar estado
      this.initializeState();

      // Aplicar tema
      this.applyTheme();

      // Finalizar inicialização
      this.finishInitialization();
    } catch (error) {
      logger.exception(error, { context: "app_initialization" });
      this.handleInitializationError(error);
    }
  }

  /**
   * Configura a aplicação
   */
  async setupApplication() {
    // Configurar viewport para mobile
    this.setupViewport();

    // Configurar PWA se disponível
    await this.setupPWA();

    // Configurar service worker
    await this.setupServiceWorker();

    // Configurar analytics
    this.setupAnalytics();

    logger.debug("Application setup completed");
  }

  /**
   * Configura viewport para dispositivos móveis
   */
  setupViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content =
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    }
  }

  /**
   * Configura PWA (Progressive Web App)
   */
  async setupPWA() {
    if ("serviceWorker" in navigator) {
      try {
        // Registrar service worker quando disponível
        logger.debug("PWA setup ready");
      } catch (error) {
        logger.warn("PWA setup failed:", error);
      }
    }
  }

  /**
   * Configura service worker
   */
  async setupServiceWorker() {
    if ("serviceWorker" in navigator && !DEV_MODE) {
      try {
        // Configurar service worker em produção
        logger.debug("Service Worker ready for production");
      } catch (error) {
        logger.warn("Service Worker setup failed:", error);
      }
    }
  }

  /**
   * Configura analytics
   */
  setupAnalytics() {
    // Configurar analytics apenas em produção
    if (!DEV_MODE) {
      // Implementar Google Analytics ou outra solução
      logger.debug("Analytics configured");
    }
  }

  /**
   * Carrega o sprite de ícones SVG
   */
  async loadIconSprite() {
    try {
      logger.debug("Loading icon sprite...");

      const response = await fetch("images/icons/sprite.svg");
      if (!response.ok) {
        throw new Error(`Failed to load sprite: ${response.status}`);
      }

      const svgContent = await response.text();
      const iconContainer = document.getElementById("svg-icons");

      if (iconContainer) {
        iconContainer.innerHTML = svgContent;
        logger.debug("✓ Icon sprite loaded successfully");
      } else {
        logger.warn("Icon container not found");
      }
    } catch (error) {
      logger.error("Failed to load icon sprite:", error);
      // Aplicação pode continuar sem ícones
    }
  }

  /**
   * Carrega componentes de UI
   */
  async loadUIComponents() {
    const components = [
      { path: "components/navbar.html", target: "#navbar-container" },
      { path: "components/footer.html", target: "#footer-container" },
      { path: "components/modal-alert.html", target: "#modal-container" },
    ];

    const loadPromises = components.map((component) =>
      loadUIComponent(component.path, component.target)
    );

    await Promise.all(loadPromises);

    logger.debug("UI components loaded");
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Eventos de navegação
    document.addEventListener("click", this.handleGlobalClick.bind(this));

    // Eventos de teclado
    document.addEventListener("keydown", this.handleGlobalKeydown.bind(this));

    // Eventos de formulário
    document.addEventListener("submit", this.handleGlobalSubmit.bind(this));

    // Eventos de janela
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener("beforeunload", this.handleBeforeUnload.bind(this));

    // Eventos de rede
    window.addEventListener("online", this.handleOnline.bind(this));
    window.addEventListener("offline", this.handleOffline.bind(this));

    logger.debug("Event listeners configured");
  }

  /**
   * Inicializa estado da aplicação
   */
  initializeState() {
    // Atualizar estado do usuário
    this.state.user = Session.getUser();

    // Atualizar página atual
    this.state.currentPage = Router.getCurrentRoute();

    // Carregar configurações salvas
    this.loadUserPreferences();

    logger.debug("Application state initialized", this.state);
  }

  /**
   * Carrega preferências do usuário
   */
  loadUserPreferences() {
    try {
      const preferences = localStorage.getItem("ispmedia_preferences");
      if (preferences) {
        const prefs = JSON.parse(preferences);
        this.state.theme = prefs.theme || "light";
        this.state.language = prefs.language || "pt-BR";
      }
    } catch (error) {
      logger.warn("Failed to load user preferences:", error);
    }
  }

  /**
   * Aplica tema
   */
  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.state.theme);

    // Aplicar classe no body
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${this.state.theme}`);

    logger.debug(`Theme applied: ${this.state.theme}`);
  }

  /**
   * Finaliza inicialização
   */
  finishInitialization() {
    this.initialized = true;

    // Esconder loader
    this.hideLoader();

    // Calcular tempo de inicialização
    const initTime = performance.now() - this.startTime;

    // Mostrar mensagem de boas-vindas
    this.showWelcomeMessage();

    // Log final
    logger.info(
      `✅ ${APP_NAME} initialized successfully in ${initTime.toFixed(2)}ms`
    );
    logger.userEvent("app_initialized", {
      version: this.version,
      initTime: initTime,
      deviceInfo: getDeviceInfo(),
    });
  }

  /**
   * Manipula erro de inicialização
   */
  handleInitializationError(error) {
    logger.error("❌ Application initialization failed:", error);

    // Esconder loader
    this.hideLoader();

    // Mostrar erro ao usuário
    document.body.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Erro de Inicialização</h4>
                    <p>Ocorreu um erro ao inicializar a aplicação.</p>
                    <hr>
                    <p class="mb-0">
                        <button class="btn btn-danger" onclick="location.reload()">
                            Tentar Novamente
                        </button>
                    </p>
                </div>
            </div>
        `;
  }

  /**
   * Mostra mensagem de boas-vindas
   */
  showWelcomeMessage() {
    const user = Session.getUser();
    if (user) {
      const message = `Bem-vindo de volta, ${user.name}!`;
      setTimeout(() => renderAlert(message, "success"), 500);
    }
  }

  /**
   * Manipula cliques globais
   */
  handleGlobalClick(event) {
    const target = event.target;

    // Navegação
    if (target.hasAttribute("data-page")) {
      event.preventDefault();
      const page = target.getAttribute("data-page");
      Router.navigateToRoute(page);
    }

    // Ações globais
    if (target.hasAttribute("data-action")) {
      event.preventDefault();
      const action = target.getAttribute("data-action");
      this.handleAction(action, target);
    }
  }

  /**
   * Manipula teclas globais
   */
  handleGlobalKeydown(event) {
    // Atalhos de teclado
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "k":
          event.preventDefault();
          this.openSearch();
          break;
        case "h":
          event.preventDefault();
          Router.navigateToRoute("home");
          break;
      }
    }

    // Tecla ESC
    if (event.key === "Escape") {
      this.handleEscapeKey();
    }
  }

  /**
   * Manipula submissão de formulários
   */
  handleGlobalSubmit(event) {
    const form = event.target;

    // Validar formulário
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    // Processar formulário específico
    if (form.hasAttribute("data-form-type")) {
      const formType = form.getAttribute("data-form-type");
      this.handleFormSubmission(formType, form, event);
    }
  }

  /**
   * Manipula redimensionamento da janela
   */
  handleWindowResize() {
    // Debounce para evitar execução excessiva
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.updateLayoutForViewport();
    }, 250);
  }

  /**
   * Manipula antes de sair da página
   */
  handleBeforeUnload(event) {
    // Verificar se há alterações não salvas
    if (this.hasUnsavedChanges()) {
      const message =
        "Você tem alterações não salvas. Deseja sair mesmo assim?";
      event.returnValue = message;
      return message;
    }
  }

  /**
   * Manipula quando fica online
   */
  handleOnline() {
    renderAlert("Conexão restabelecida!", "success");
    logger.info("Application is back online");
  }

  /**
   * Manipula quando fica offline
   */
  handleOffline() {
    renderAlert(
      "Você está offline. Algumas funcionalidades podem não estar disponíveis.",
      "warning"
    );
    logger.warn("Application is offline");
  }

  /**
   * Manipula ações gerais
   */
  handleAction(action, element) {
    switch (action) {
      case "login":
        Router.navigateToRoute("login");
        break;
      case "logout":
        Session.logout();
        break;
      case "toggle-theme":
        this.toggleTheme();
        break;
      case "search":
        this.openSearch();
        break;
      case "back":
        Router.goBack();
        break;
      default:
        logger.warn(`Unknown action: ${action}`);
    }
  }

  /**
   * Manipula submissão de formulários
   */
  handleFormSubmission(formType, form, event) {
    switch (formType) {
      case "login":
        this.handleLoginForm(form, event);
        break;
      case "upload":
        this.handleUploadForm(form, event);
        break;
      default:
        logger.warn(`Unknown form type: ${formType}`);
    }
  }

  /**
   * Manipula formulário de login
   */
  async handleLoginForm(form, event) {
    event.preventDefault();

    const formData = new FormData(form);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const rememberMe = formData.get("remember") === "on";

    try {
      showLoader();
      const result = await Session.login(credentials, rememberMe);

      if (result.success) {
        renderAlert(result.message, "success");
        Router.navigateToRoute("home");
      } else {
        renderAlert(result.message, "error");
      }
    } catch (error) {
      logger.exception(error, { context: "login_form" });
      renderAlert("Erro no login. Tente novamente.", "error");
    } finally {
      hideLoader();
    }
  }

  /**
   * Manipula formulário de upload
   */
  async handleUploadForm(form, event) {
    event.preventDefault();

    const formData = new FormData(form);
    const files = formData.getAll("files");

    if (files.length === 0) {
      renderAlert("Selecione pelo menos um arquivo.", "warning");
      return;
    }

    try {
      showLoader();
      // Implementar lógica de upload
      await this.uploadFiles(files);
      renderAlert("Upload realizado com sucesso!", "success");
    } catch (error) {
      logger.exception(error, { context: "upload_form" });
      renderAlert("Erro no upload. Tente novamente.", "error");
    } finally {
      hideLoader();
    }
  }

  /**
   * Alterna tema
   */
  toggleTheme() {
    this.state.theme = this.state.theme === "light" ? "dark" : "light";
    this.applyTheme();
    this.saveUserPreferences();

    logger.userEvent("theme_changed", { theme: this.state.theme });
  }

  /**
   * Abre busca
   */
  openSearch() {
    // Implementar modal de busca
    logger.userEvent("search_opened");
  }

  /**
   * Manipula tecla ESC
   */
  handleEscapeKey() {
    // Fechar modais abertos
    const modals = document.querySelectorAll(".modal.show");
    modals.forEach((modal) => {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    });
  }

  /**
   * Atualiza layout para viewport
   */
  updateLayoutForViewport() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
    };

    document.body.classList.toggle("mobile-view", viewport.isMobile);
    document.body.classList.toggle("tablet-view", viewport.isTablet);
    document.body.classList.toggle("desktop-view", viewport.isDesktop);

    logger.debug("Layout updated for viewport:", viewport);
  }

  /**
   * Verifica se há alterações não salvas
   */
  hasUnsavedChanges() {
    // Implementar lógica para verificar alterações
    return false;
  }

  /**
   * Salva preferências do usuário
   */
  saveUserPreferences() {
    try {
      const preferences = {
        theme: this.state.theme,
        language: this.state.language,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("ispmedia_preferences", JSON.stringify(preferences));
    } catch (error) {
      logger.warn("Failed to save user preferences:", error);
    }
  }

  /**
   * Upload de arquivos
   */
  async uploadFiles(files) {
    // Implementar lógica de upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    logger.info(`Uploaded ${files.length} files`);
  }

  /**
   * Mostra loader
   */
  showLoader() {
    this.state.isLoading = true;
    showLoader();
  }

  /**
   * Esconde loader
   */
  hideLoader() {
    this.state.isLoading = false;
    hideLoader();
  }

  /**
   * Obtém estado da aplicação
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Verifica se está inicializada
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Reinicia aplicação
   */
  restart() {
    logger.info("Restarting application...");
    window.location.reload();
  }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  window.ISPMedia = new ISPMediaApp();
});

// Exportar para uso global
window.ISPMediaApp = ISPMediaApp;

// Log inicial
logger.info(`📱 ${APP_NAME} v${VERSION} - Application script loaded`);
