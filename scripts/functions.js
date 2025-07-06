/* ========================================
   ISPMedia - Funções Utilitárias
   ======================================== */

/**
 * Carrega um componente HTML e insere no elemento especificado
 * @param {string} componentPath - Caminho do componente
 * @param {string} targetSelector - Seletor do elemento destino
 * @returns {Promise<void>}
 */
async function loadComponent(componentPath, targetSelector = "#conteudo") {
  const startTime = performance.now();

  try {
    showLoader();
    logger.debug(`Loading component: ${componentPath}`);

    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load component: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const targetElement = document.querySelector(targetSelector);

    if (!targetElement) {
      throw new Error(`Target element not found: ${targetSelector}`);
    }

    // Aplicar animação de saída
    targetElement.style.opacity = "0";
    targetElement.style.transform = "translateY(20px)";

    // Aguardar animação
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Inserir novo conteúdo
    targetElement.innerHTML = html;

    // Aplicar animação de entrada
    requestAnimationFrame(() => {
      targetElement.style.opacity = "1";
      targetElement.style.transform = "translateY(0)";
    });

    // Executar scripts inline se houver
    executeInlineScripts(targetElement);

    logger.performance(`Component loaded: ${componentPath}`, startTime);
    logger.userEvent("component_loaded", { path: componentPath });
  } catch (error) {
    logger.exception(error, { componentPath, targetSelector });
    renderAlert("Erro ao carregar componente", "error");
  } finally {
    hideLoader();
  }
}

/**
 * Carrega um componente de UI (navbar, footer, etc.)
 * @param {string} componentPath - Caminho do componente
 * @param {string} targetSelector - Seletor do elemento destino
 * @returns {Promise<void>}
 */
async function loadUIComponent(componentPath, targetSelector) {
  try {
    logger.debug(`Loading UI component: ${componentPath}`);

    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(`Failed to load UI component: ${response.status}`);
    }

    const html = await response.text();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      targetElement.innerHTML = html;
      executeInlineScripts(targetElement);

      // Aplicar eventos específicos do componente
      if (componentPath.includes("navbar")) {
        initializeNavbar();
      }

      logger.debug(`UI component loaded: ${componentPath}`);
    }
  } catch (error) {
    logger.exception(error, { componentPath, targetSelector });
  }
}

/**
 * Executa scripts inline de um elemento
 * @param {HTMLElement} element - Elemento contendo scripts
 */
function executeInlineScripts(element) {
  const scripts = element.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.innerHTML.trim()) {
      try {
        eval(script.innerHTML);
      } catch (error) {
        logger.error("Error executing inline script:", error);
      }
    }
  });
}

/**
 * Inicializa eventos da navbar
 */
function initializeNavbar() {
  // Adicionar eventos aos links de navegação
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // Atualizar menu baseado no papel do usuário
  const user = Session.getUser();
  if (user) {
    renderMenuByUserRole(user.role);
  }
}

/**
 * Manipula navegação SPA
 * @param {Event} event - Evento de clique
 */
function handleNavigation(event) {
  event.preventDefault();

  const page = event.target.getAttribute("data-page");
  if (page) {
    navigateToPage(page);
  }
}

/**
 * Navega para uma página específica
 * @param {string} page - Nome da página
 */
async function navigateToPage(page) {
  try {
    const route = getRoute(page);

    if (!route) {
      throw new Error(`Route not found: ${page}`);
    }

    // Verificar acesso
    if (!hasAccess(route.access)) {
      if (Session.isAuthenticated()) {
        renderAlert(
          "Você não tem permissão para acessar esta página",
          "warning"
        );
        return;
      } else {
        renderAlert("Faça login para acessar esta página", "info");
        navigateToPage("login");
        return;
      }
    }

    // Atualizar URL sem reload
    window.history.pushState({ page }, "", `#${page}`);

    // Carregar componente
    await loadComponent(route.path);

    // Atualizar navbar ativa
    updateActiveNavLink(page);

    // Atualizar título da página
    updatePageTitle(page);

    logger.userEvent("navigation", { page, route: route.path });
  } catch (error) {
    logger.exception(error, { page });
    renderAlert("Erro ao navegar para a página", "error");
  }
}

/**
 * Atualiza o link ativo na navbar
 * @param {string} page - Página atual
 */
function updateActiveNavLink(page) {
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
 * Atualiza o título da página
 * @param {string} page - Página atual
 */
function updatePageTitle(page) {
  const titles = {
    home: "Início",
    login: "Login",
    upload: "Upload",
    playlist: "Playlists",
    detalhes: "Detalhes",
    admin: "Administração",
  };

  const title = titles[page] || "ISPMedia";
  document.title = `${title} - ISPMedia`;
}

/**
 * Renderiza um alerta Bootstrap
 * @param {string} message - Mensagem do alerta
 * @param {string} type - Tipo do alerta (success, error, warning, info)
 * @param {number} duration - Duração em ms (0 = permanente)
 */
function renderAlert(message, type = "info", duration = 5000) {
  const alertContainer = document.getElementById("alert-container");
  if (!alertContainer) {
    logger.warn("Alert container not found");
    return;
  }

  const alertTypes = {
    success: "alert-success",
    error: "alert-danger",
    warning: "alert-warning",
    info: "alert-info",
  };

  const alertIcons = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill",
  };

  const alertClass = alertTypes[type] || alertTypes.info;
  const alertIcon = alertIcons[type] || alertIcons.info;
  const alertId = `alert-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const alertElement = document.createElement("div");
  alertElement.id = alertId;
  alertElement.className = `alert ${alertClass} alert-dismissible fade show shadow-sm`;
  alertElement.style.maxWidth = "400px";
  alertElement.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${alertIcon} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

  // Adicionar ao container
  alertContainer.appendChild(alertElement);

  // Remover automaticamente após duração especificada
  if (duration > 0) {
    setTimeout(() => {
      const alert = document.getElementById(alertId);
      if (alert) {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
        bsAlert.close();
      }
    }, duration);
  }

  logger.userEvent("alert_shown", { message, type, duration });
}

/**
 * Mostra o loader
 */
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.remove("d-none");
  }
}

/**
 * Esconde o loader
 */
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("d-none");
  }
}

/**
 * Renderiza menu baseado no papel do usuário
 * @param {string} role - Papel do usuário
 */
function renderMenuByUserRole(role) {
  const navItems = document.querySelectorAll("[data-role]");

  navItems.forEach((item) => {
    const requiredRoles = item.getAttribute("data-role").split(",");
    const hasRole =
      requiredRoles.includes(role) || requiredRoles.includes("any");

    if (hasRole) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });

  // Mostrar/esconder botões de login/logout
  const loginBtn = document.querySelector('[data-action="login"]');
  const logoutBtn = document.querySelector('[data-action="logout"]');

  if (Session.isAuthenticated()) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "";
  } else {
    if (loginBtn) loginBtn.style.display = "";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

/**
 * Formata bytes para string legível
 * @param {number} bytes - Número de bytes
 * @param {number} decimals - Casas decimais
 * @returns {string}
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Formata data para string legível
 * @param {Date|string} date - Data a ser formatada
 * @param {string} format - Formato de saída
 * @returns {string}
 */
function formatDate(date, format = "dd/MM/yyyy") {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "Data inválida";
  }

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return format
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", year)
    .replace("HH", hours)
    .replace("mm", minutes);
}

/**
 * Debounce para funções
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle para funções
 * @param {Function} func - Função a ser throttled
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha
 * @param {string} password - Senha a ser validada
 * @returns {Object}
 */
function validatePassword(password) {
  const result = {
    isValid: false,
    errors: [],
  };

  if (password.length < 8) {
    result.errors.push("Senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    result.errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    result.errors.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    result.errors.push("Senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.errors.push("Senha deve conter pelo menos um caractere especial");
  }

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Copia texto para clipboard
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para browsers mais antigos
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      return successful;
    }
  } catch (error) {
    logger.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Detecta se é dispositivo móvel
 * @returns {boolean}
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detecta se é tablet
 * @returns {boolean}
 */
function isTablet() {
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

/**
 * Detecta se é desktop
 * @returns {boolean}
 */
function isDesktop() {
  return !isMobile() && !isTablet();
}

/**
 * Obtém informações do dispositivo
 * @returns {Object}
 */
function getDeviceInfo() {
  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

// Exportar funções para uso global
window.loadComponent = loadComponent;
window.loadUIComponent = loadUIComponent;
window.navigateToPage = navigateToPage;
window.renderAlert = renderAlert;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.renderMenuByUserRole = renderMenuByUserRole;
window.formatBytes = formatBytes;
window.formatDate = formatDate;
window.debounce = debounce;
window.throttle = throttle;
window.isValidEmail = isValidEmail;
window.validatePassword = validatePassword;
window.copyToClipboard = copyToClipboard;
window.isMobile = isMobile;
window.isTablet = isTablet;
window.isDesktop = isDesktop;
window.getDeviceInfo = getDeviceInfo;

// Log inicial
logger.info("🔧 Functions utilities initialized");
logger.debug("Device info:", getDeviceInfo());
