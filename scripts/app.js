// ==================== APLICAÇÃO PRINCIPAL ==================== //
const App = {
    /**
     * Inicializa a aplicação
     */
    init: function() {
        Logger.info('Inicializando aplicação ISPMedia...');
        
        // Verifica se todos os módulos foram carregados
        if (!this.checkDependencies()) {
            Logger.error('Dependências não encontradas. Verifique se todos os scripts foram carregados.');
            return;
        }
        
        // Carrega componentes globais
        this.loadGlobalComponents();
        
        // Inicializa sistema de rotas
        Routes.init();
        
        // Verifica autenticação inicial
        this.checkInitialAuth();
        
        // Configura eventos globais
        this.setupGlobalEvents();
        
        // Configura atalhos de teclado
        this.setupKeyboardShortcuts();
        
        Logger.success('Aplicação ISPMedia inicializada com sucesso!');
    },
    
    /**
     * Verifica se todas as dependências foram carregadas
     */
    checkDependencies: function() {
        const required = ['CONFIG', 'Logger', 'Session', 'Functions', 'Charts', 'Routes'];
        return required.every(dep => window[dep] !== undefined);
    },
    
    /**
     * Carrega componentes globais (navbar, footer)
     */
    loadGlobalComponents: async function() {
        try {
            // Carrega navbar
            await Functions.loadComponent('components/navbar.html', '#navbar');
            
            // Carrega footer
            await Functions.loadComponent('components/footer.html', '#footer');
            
            Logger.success('Componentes globais carregados');
        } catch (error) {
            Logger.error('Erro ao carregar componentes globais:', error);
        }
    },
    
    /**
     * Verifica autenticação inicial
     */
    checkInitialAuth: function() {
        if (!Session.isAuthenticated()) {
            Logger.info('Utilizador não autenticado');
            
            // Se estiver tentando acesso a área restrita, mostra modal de login
            const currentRoute = Routes.getCurrentRoute();
            if (Routes.requiresAuth(currentRoute)) {
                Functions.loadModal('app/home/modal-auth.html', 'modal-auth');
            }
        } else {
            const user = Session.getUser();
            Logger.success(`Utilizador autenticado: ${user.name}`);
            this.updateUserInterface(user);
        }
    },
    
    /**
     * Atualiza interface com dados do utilizador
     */
    updateUserInterface: function(user) {
        // Atualiza nome do utilizador na navbar
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = user.name;
        });
        
        // Atualiza email do utilizador
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(element => {
            element.textContent = user.email;
        });
        
        // Atualiza avatar se existir
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(element => {
            if (user.avatar) {
                element.src = user.avatar;
            }
        });
        
        // Mostra/esconde elementos baseado no role
        if (user.role === 'admin') {
            document.querySelectorAll('.admin-only').forEach(element => {
                element.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.admin-only').forEach(element => {
                element.style.display = 'none';
            });
        }
    },
    
    /**
     * Configura eventos globais
     */
    setupGlobalEvents: function() {
        // Evento de logout
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-action="logout"]')) {
                this.handleLogout();
            }
        });
        
        // Evento de fechar modal com ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                Functions.closeAllModals();
            }
        });
        
        // Evento de fechar modal clicando fora
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-overlay')) {
                Functions.closeAllModals();
            }
        });
        
        // Evento de upload via drag and drop
        document.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        
        document.addEventListener('drop', (event) => {
            event.preventDefault();
            if (Session.isAuthenticated()) {
                this.handleFileDrop(event);
            }
        });
        
        Logger.success('Eventos globais configurados');
    },
    
    /**
     * Configura atalhos de teclado
     */
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + tecla
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'h':
                        event.preventDefault();
                        Routes.navigate('/');
                        break;
                    case 'd':
                        event.preventDefault();
                        if (Session.isAuthenticated()) {
                            Routes.navigate('/dashboard');
                        }
                        break;
                    case 'f':
                        event.preventDefault();
                        if (Session.isAuthenticated()) {
                            Routes.navigate('/files');
                        }
                        break;
                    case 'u':
                        event.preventDefault();
                        if (Session.isAuthenticated()) {
                            Functions.loadModal('app/files/modal-upload.html', 'modal-upload');
                        }
                        break;
                }
            }
        });
        
        Logger.success('Atalhos de teclado configurados');
    },
    
    /**
     * Manipula logout
     */
    handleLogout: function() {
        if (confirm(CONFIG.MESSAGES.CONFIRM_LOGOUT)) {
            Session.logout();
            Functions.renderAlert('success', CONFIG.MESSAGES.SUCCESS_LOGOUT);
            Routes.navigate('/');
        }
    },
    
    /**
     * Manipula drop de ficheiros
     */
    handleFileDrop: function(event) {
        const files = Array.from(event.dataTransfer.files);
        
        if (files.length > 0) {
            Logger.info(`${files.length} ficheiro(s) enviado(s) via drag and drop`);
            
            // Simula upload
            Functions.renderAlert('info', `Enviando ${files.length} ficheiro(s)...`);
            
            setTimeout(() => {
                Functions.renderAlert('success', `${files.length} ficheiro(s) enviado(s) com sucesso!`);
            }, 2000);
        }
    },
    
    /**
     * Manipula erros globais
     */
    handleError: function(error) {
        Logger.error('Erro global:', error);
        Functions.renderAlert('error', CONFIG.MESSAGES.ERROR_GENERIC);
    }
};

// Configura manipulador de erros globais
window.addEventListener('error', (event) => {
    App.handleError(event.error);
});

// Configura manipulador de promessas rejeitadas
window.addEventListener('unhandledrejection', (event) => {
    App.handleError(event.reason);
});

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Torna o App global
window.App = App;
