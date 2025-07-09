// ISPMedia - Session Management
// Handles user authentication and session state

class SessionManager {
  constructor() {
    this.api = window.ISPMediaAPI;
    this.currentUser = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Verificar se existe token válido
      const isValid = await this.api.verifyToken();
      
      if (isValid) {
        this.currentUser = this.api.user;
        this.onAuthStateChange(true);
      } else {
        this.currentUser = null;
        this.onAuthStateChange(false);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      this.currentUser = null;
      this.onAuthStateChange(false);
    }
    
    this.isInitialized = true;
  }

  async login(credentials) {
    try {
      const response = await this.api.login(credentials);
      this.currentUser = response.user;
      this.onAuthStateChange(true);
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  }

  async register(userData) {
    try {
      const response = await this.api.register(userData);
      this.currentUser = response.user;
      this.onAuthStateChange(true);
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Erro no registo:', error);
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.currentUser = null;
    this.api.logout();
    this.onAuthStateChange(false);
  }

  isAuthenticated() {
    return !!this.currentUser && this.api.isAuthenticated();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasRole(...roles) {
    return this.api.hasRole(...roles);
  }

  canEdit() {
    return this.hasRole('editor', 'admin');
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  onAuthStateChange(isAuthenticated) {
    // Emitir evento personalizado para outros componentes
    const event = new CustomEvent('authStateChanged', {
      detail: { 
        isAuthenticated, 
        user: this.currentUser 
      }
    });
    document.dispatchEvent(event);

    // Atualizar UI
    this.updateUI(isAuthenticated);
  }

  updateUI(isAuthenticated) {
    // Atualizar navbar
    this.updateNavbar(isAuthenticated);
    
    // Atualizar botões de ação baseados em roles
    this.updateActionButtons();

    // Redirecionar se necessário
    this.handlePageAccess();
  }

  updateNavbar(isAuthenticated) {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isAuthenticated && this.currentUser) {
      // Mostrar menu do utilizador
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (userName) {
        userName.textContent = this.currentUser.firstName || this.currentUser.username;
      }

      // Configurar logout
      if (logoutBtn) {
        logoutBtn.onclick = () => this.logout();
      }
    } else {
      // Mostrar botão de login
      if (loginBtn) loginBtn.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  updateActionButtons() {
    // Botões de criar/editar (apenas para editor/admin)
    const editorButtons = document.querySelectorAll('[data-role="editor"]');
    const adminButtons = document.querySelectorAll('[data-role="admin"]');

    editorButtons.forEach(btn => {
      btn.style.display = this.canEdit() ? 'block' : 'none';
    });

    adminButtons.forEach(btn => {
      btn.style.display = this.isAdmin() ? 'block' : 'none';
    });

    // Botões que requerem autenticação
    const authButtons = document.querySelectorAll('[data-auth="required"]');
    authButtons.forEach(btn => {
      btn.style.display = this.isAuthenticated() ? 'block' : 'none';
    });
  }

  handlePageAccess() {
    const currentPage = window.location.pathname;
    
    // Páginas que requerem autenticação
    const protectedPages = [
      '/web/app/admin/',
      '/web/app/files/',
      '/web/app/playlists/'
    ];

    // Páginas apenas para admin
    const adminPages = [
      '/web/app/admin/'
    ];

    if (protectedPages.some(page => currentPage.includes(page))) {
      if (!this.isAuthenticated()) {
        this.redirectToLogin();
        return;
      }
    }

    if (adminPages.some(page => currentPage.includes(page))) {
      if (!this.isAdmin()) {
        this.redirectToHome();
        return;
      }
    }
  }

  redirectToLogin() {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `/web/index.html?return=${returnUrl}`;
  }

  redirectToHome() {
    window.location.href = '/web/app/home/home.html';
  }

  // Método para verificar periodicamente a validade da sessão
  startSessionCheck() {
    setInterval(async () => {
      if (this.isAuthenticated()) {
        try {
          await this.api.verifyToken();
        } catch (error) {
          console.log('Sessão expirada, fazendo logout...');
          this.logout();
        }
      }
    }, 5 * 60 * 1000); // Verificar a cada 5 minutos
  }

  // Métodos de conveniência para formulários
  setupLoginForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
      };

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Entrando...';

      const result = await this.login(credentials);

      if (result.success) {
        // Redirecionar para a página de retorno ou home
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return');
        window.location.href = returnUrl || '/web/app/home/home.html';
      } else {
        // Mostrar erro
        this.showError(result.error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  setupRegisterForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
      };

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registando...';

      const result = await this.register(userData);

      if (result.success) {
        window.location.href = '/web/app/home/home.html';
      } else {
        this.showError(result.error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  showError(message) {
    // Procurar elemento de erro na página
    let errorElement = document.getElementById('auth-error');
    
    if (!errorElement) {
      // Criar elemento de erro se não existir
      errorElement = document.createElement('div');
      errorElement.id = 'auth-error';
      errorElement.className = 'alert alert-danger';
      errorElement.style.cssText = `
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
      `;
      
      // Inserir antes do formulário
      const form = document.querySelector('form');
      if (form) {
        form.parentNode.insertBefore(errorElement, form);
      }
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Esconder após 5 segundos
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

// Global session manager instance
window.SessionManager = new SessionManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.SessionManager.init();
  window.SessionManager.startSessionCheck();
});
