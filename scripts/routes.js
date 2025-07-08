// ==================== SISTEMA DE ROTAS ==================== //
const Routes = {
    /**
     * Definições das rotas principais
     */
    routes: {
        '/': {
            path: 'app/home/home.html',
            title: 'Início',
            requiresAuth: false
        },
        '/home': {
            path: 'app/home/home.html',
            title: 'Início',
            requiresAuth: false
        },
        '/dashboard': {
            path: 'app/dashboard/dashboard.html',
            title: 'Dashboard',
            requiresAuth: true
        },
        '/files': {
            path: 'app/files/file-manager.html',
            title: 'Ficheiros',
            requiresAuth: true
        },
        '/admin': {
            path: 'app/admin/admin.html',
            title: 'Administração',
            requiresAuth: true,
            requiredRole: 'admin'
        }
    },
    
    /**
     * Rota atual
     */
    currentRoute: '/',
    
    /**
     * Navega para uma rota específica
     */
    navigate: function(route) {
        Logger.info(`Navegando para: ${route}`);
        
        // Verifica se a rota existe
        if (!this.routes[route]) {
            Logger.warn(`Rota não encontrada: ${route}`);
            this.navigate('/');
            return;
        }
        
        const routeConfig = this.routes[route];
        
        // Verifica autenticação
        if (routeConfig.requiresAuth && !Session.isAuthenticated()) {
            Logger.warn('Acesso negado - autenticação necessária');
            Functions.loadModal('app/home/modal-auth.html', 'modal-auth');
            return;
        }
        
        // Verifica role necessária
        if (routeConfig.requiredRole) {
            const user = Session.getUser();
            if (!user || user.role !== routeConfig.requiredRole) {
                Logger.warn(`Acesso negado - role necessária: ${routeConfig.requiredRole}`);
                Functions.renderAlert('error', 'Acesso negado. Permissões insuficientes.');
                return;
            }
        }
        
        // Carrega a página
        this.currentRoute = route;
        Functions.loadComponent(routeConfig.path);
        
        // Atualiza título da página
        document.title = `${routeConfig.title} - ${CONFIG.APP_NAME}`;
        
        // Atualiza URL (sem recarregar a página)
        history.pushState({ route }, routeConfig.title, route);
        
        // Atualiza navbar ativa
        this.updateActiveNavItem(route);
    },
    
    /**
     * Atualiza item ativo da navbar
     */
    updateActiveNavItem: function(route) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-route') === route) {
                item.classList.add('active');
            }
        });
    },
    
    /**
     * Obtém rota atual
     */
    getCurrentRoute: function() {
        return this.currentRoute;
    },
    
    /**
     * Verifica se uma rota requer autenticação
     */
    requiresAuth: function(route) {
        return this.routes[route] && this.routes[route].requiresAuth;
    },
    
    /**
     * Inicializa o sistema de rotas
     */
    init: function() {
        // Escuta mudanças no histórico
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || '/';
            this.navigate(route);
        });
        
        // Intercepta cliques em links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('[data-route]');
            if (link) {
                event.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route);
            }
        });
        
        // Navega para rota inicial
        const initialRoute = location.pathname || '/';
        this.navigate(initialRoute);
        
        Logger.success('Sistema de rotas inicializado');
    }
};

// Torna o Routes global
window.Routes = Routes;
