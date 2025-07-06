/* ========================================
   ISPMedia - Sistema de Rotas
   ======================================== */

/**
 * Definição das rotas da aplicação
 */
const ROUTES = {
  home: {
    path: "components/home.html",
    access: "public",
    title: "Início",
    description: "Página inicial do ISPMedia",
  },
  login: {
    path: "components/login.html",
    access: "public",
    title: "Login",
    description: "Página de autenticação",
  },
  upload: {
    path: "components/upload.html",
    access: "authenticated",
    title: "Upload",
    description: "Upload de arquivos de mídia",
  },
  playlist: {
    path: "components/playlist.html",
    access: "authenticated",
    title: "Playlists",
    description: "Gerenciamento de playlists",
  },
  detalhes: {
    path: "components/detalhes.html",
    access: "authenticated",
    title: "Detalhes",
    description: "Detalhes do conteúdo",
  },
  admin: {
    path: "components/admin.html",
    access: "admin",
    title: "Administração",
    description: "Painel administrativo",
  },
};

/**
 * Níveis de acesso
 */
const ACCESS_LEVELS = {
  public: 0, // Acesso público
  authenticated: 1, // Usuário autenticado
  admin: 2, // Administrador
};

/**
 * Classe para gerenciar rotas
 */
class RouteManager {
  constructor() {
    this.routes = ROUTES;
    this.currentRoute = null;
    this.history = [];
    this.maxHistorySize = 50;

    // Inicializar roteamento
    this.initialize();
  }

  /**
   * Inicializa o sistema de rotas
   */
  initialize() {
    // Escutar mudanças no histórico do navegador
    window.addEventListener("popstate", (event) => {
      this.handlePopState(event);
    });

    // Escutar mudanças no hash
    window.addEventListener("hashchange", () => {
      this.handleHashChange();
    });

    // Carregar rota inicial
    this.loadInitialRoute();

    logger.info("🛣️ Route manager initialized");
  }

  /**
   * Carrega rota inicial baseada na URL
   */
  loadInitialRoute() {
    const hash = window.location.hash.substr(1);
    const page = hash || "home";

    // Verificar se a rota existe
    if (this.routes[page]) {
      this.navigateToRoute(page, false);
    } else {
      // Rota não encontrada, ir para home
      this.navigateToRoute("home", true);
    }
  }

  /**
   * Manipula mudanças no estado do navegador
   * @param {PopStateEvent} event - Evento de mudança de estado
   */
  handlePopState(event) {
    const page = event.state?.page || "home";
    this.navigateToRoute(page, false);
  }

  /**
   * Manipula mudanças no hash
   */
  handleHashChange() {
    const hash = window.location.hash.substr(1);
    const page = hash || "home";

    if (this.routes[page]) {
      this.navigateToRoute(page, false);
    }
  }

  /**
   * Navega para uma rota específica
   * @param {string} page - Nome da página
   * @param {boolean} updateHistory - Atualizar histórico do navegador
   */
  async navigateToRoute(page, updateHistory = true) {
    try {
      const route = this.routes[page];

      if (!route) {
        throw new Error(`Route not found: ${page}`);
      }

      // Verificar acesso
      if (!this.hasAccess(route.access)) {
        this.handleAccessDenied(page, route);
        return;
      }

      // Atualizar histórico se necessário
      if (updateHistory) {
        this.updateBrowserHistory(page);
      }

      // Salvar rota atual no histórico interno
      this.addToHistory(page);

      // Carregar componente
      await loadComponent(route.path);

      // Atualizar estado atual
      this.currentRoute = page;

      // Atualizar UI
      this.updateUI(page, route);

      logger.info(`Navigated to: ${page}`);
      logger.userEvent("route_change", { page, route: route.path });
    } catch (error) {
      logger.exception(error, { page });
      this.handleRouteError(page, error);
    }
  }

  /**
   * Verifica se o usuário tem acesso à rota
   * @param {string} accessLevel - Nível de acesso necessário
   * @returns {boolean}
   */
  hasAccess(accessLevel) {
    const userRole = Session.getUserRole();
    const requiredLevel = ACCESS_LEVELS[accessLevel] || 0;

    switch (userRole) {
      case "admin":
      case "super_admin":
        return requiredLevel <= ACCESS_LEVELS.admin;
      case "user":
        return requiredLevel <= ACCESS_LEVELS.authenticated;
      default:
        return requiredLevel <= ACCESS_LEVELS.public;
    }
  }

  /**
   * Manipula acesso negado
   * @param {string} page - Página solicitada
   * @param {Object} route - Dados da rota
   */
  handleAccessDenied(page, route) {
    logger.warn(`Access denied to ${page}`, {
      required: route.access,
      userRole: Session.getUserRole(),
    });

    if (Session.isAuthenticated()) {
      renderAlert("Você não tem permissão para acessar esta página", "warning");
      this.navigateToRoute("home");
    } else {
      renderAlert("Faça login para acessar esta página", "info");
      this.navigateToRoute("login");
    }
  }

  /**
   * Manipula erros de rota
   * @param {string} page - Página que causou erro
   * @param {Error} error - Erro ocorrido
   */
  handleRouteError(page, error) {
    logger.error(`Route error for ${page}:`, error);
    renderAlert("Erro ao carregar página. Tente novamente.", "error");

    // Tentar ir para home como fallback
    if (page !== "home") {
      this.navigateToRoute("home");
    }
  }

  /**
   * Atualiza histórico do navegador
   * @param {string} page - Página atual
   */
  updateBrowserHistory(page) {
    const state = { page };
    const url = page === "home" ? "" : `#${page}`;

    window.history.pushState(state, "", url);
  }

  /**
   * Adiciona página ao histórico interno
   * @param {string} page - Página a adicionar
   */
  addToHistory(page) {
    const entry = {
      page,
      timestamp: Date.now(),
      url: window.location.href,
    };

    this.history.push(entry);

    // Limitar tamanho do histórico
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Atualiza elementos da UI
   * @param {string} page - Página atual
   * @param {Object} route - Dados da rota
   */
  updateUI(page, route) {
    // Atualizar título da página
    document.title = `${route.title} - ${APP_NAME}`;

    // Atualizar meta description
    this.updateMetaDescription(route.description);

    // Atualizar navbar ativa
    this.updateActiveNavLink(page);

    // Atualizar breadcrumb se existir
    this.updateBreadcrumb(page, route);
  }

  /**
   * Atualiza meta description
   * @param {string} description - Nova descrição
   */
  updateMetaDescription(description) {
    let metaDesc = document.querySelector('meta[name="description"]');

    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }

    metaDesc.content = description;
  }

  /**
   * Atualiza link ativo na navbar
   * @param {string} page - Página atual
   */
  updateActiveNavLink(page) {
    // Remover classe ativa de todos os links
    document.querySelectorAll("[data-page]").forEach((link) => {
      link.classList.remove("active");
    });

    // Adicionar classe ativa ao link atual
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  /**
   * Atualiza breadcrumb
   * @param {string} page - Página atual
   * @param {Object} route - Dados da rota
   */
  updateBreadcrumb(page, route) {
    const breadcrumbContainer = document.querySelector(".breadcrumb-container");

    if (breadcrumbContainer) {
      const breadcrumbHtml = this.generateBreadcrumb(page, route);
      breadcrumbContainer.innerHTML = breadcrumbHtml;
    }
  }

  /**
   * Gera HTML do breadcrumb
   * @param {string} page - Página atual
   * @param {Object} route - Dados da rota
   * @returns {string}
   */
  generateBreadcrumb(page, route) {
    const breadcrumbItems = [{ name: "Início", page: "home" }];

    if (page !== "home") {
      breadcrumbItems.push({ name: route.title, page: page });
    }

    return `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    ${breadcrumbItems
                      .map((item, index) => {
                        const isActive = index === breadcrumbItems.length - 1;
                        return `
                            <li class="breadcrumb-item ${
                              isActive ? "active" : ""
                            }">
                                ${
                                  isActive
                                    ? item.name
                                    : `<a href="#${item.page}" data-page="${item.page}">${item.name}</a>`
                                }
                            </li>
                        `;
                      })
                      .join("")}
                </ol>
            </nav>
        `;
  }

  /**
   * Obtém rota atual
   * @returns {string|null}
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Obtém dados da rota
   * @param {string} page - Nome da página
   * @returns {Object|null}
   */
  getRoute(page) {
    return this.routes[page] || null;
  }

  /**
   * Verifica se rota existe
   * @param {string} page - Nome da página
   * @returns {boolean}
   */
  routeExists(page) {
    return this.routes.hasOwnProperty(page);
  }

  /**
   * Obtém todas as rotas
   * @returns {Object}
   */
  getAllRoutes() {
    return this.routes;
  }

  /**
   * Obtém rotas públicas
   * @returns {Array}
   */
  getPublicRoutes() {
    return Object.keys(this.routes).filter(
      (page) => this.routes[page].access === "public"
    );
  }

  /**
   * Obtém rotas autenticadas
   * @returns {Array}
   */
  getAuthenticatedRoutes() {
    return Object.keys(this.routes).filter(
      (page) => this.routes[page].access === "authenticated"
    );
  }

  /**
   * Obtém rotas administrativas
   * @returns {Array}
   */
  getAdminRoutes() {
    return Object.keys(this.routes).filter(
      (page) => this.routes[page].access === "admin"
    );
  }

  /**
   * Obtém histórico de navegação
   * @returns {Array}
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Limpa histórico
   */
  clearHistory() {
    this.history = [];
    logger.info("Navigation history cleared");
  }

  /**
   * Volta para página anterior
   */
  goBack() {
    if (this.history.length > 1) {
      // Remover página atual
      this.history.pop();
      // Obter página anterior
      const previousPage = this.history[this.history.length - 1];

      if (previousPage) {
        this.navigateToRoute(previousPage.page, false);
        window.history.back();
      }
    } else {
      // Sem histórico, ir para home
      this.navigateToRoute("home");
    }
  }
}

// Criar instância global do gerenciador de rotas
const Router = new RouteManager();

// Funções de conveniência para compatibilidade
function getRoute(page) {
  return Router.getRoute(page);
}

function hasAccess(accessLevel) {
  return Router.hasAccess(accessLevel);
}

function getCurrentRoute() {
  return Router.getCurrentRoute();
}

// Exportar para uso global
window.Router = Router;
window.getRoute = getRoute;
window.hasAccess = hasAccess;
window.getCurrentRoute = getCurrentRoute;
window.ROUTES = ROUTES;
window.ACCESS_LEVELS = ACCESS_LEVELS;

// Log inicial
logger.info("🛣️ Routes system initialized");
logger.debug("Available routes:", Object.keys(ROUTES));
