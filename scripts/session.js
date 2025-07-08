// ==================== GESTÃO DE SESSÃO ==================== //
const Session = {
    /**
     * Obtém o utilizador atual da sessão
     */
    getUser: function() {
        try {
            const userData = sessionStorage.getItem(CONFIG.STORAGE.SESSION_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            Logger.error('Erro ao obter utilizador da sessão:', error);
            return null;
        }
    },
    
    /**
     * Autentica o utilizador e armazena na sessão
     */
    login: function(userObj) {
        try {
            const user = {
                id: userObj.id || Date.now(),
                name: userObj.name || 'Utilizador',
                email: userObj.email || 'user@example.com',
                avatar: userObj.avatar || null,
                role: userObj.role || 'user',
                loginTime: new Date().toISOString(),
                settings: userObj.settings || {}
            };
            
            sessionStorage.setItem(CONFIG.STORAGE.SESSION_KEY, JSON.stringify(user));
            Logger.success('Login realizado com sucesso:', user);
            return user;
        } catch (error) {
            Logger.error('Erro ao fazer login:', error);
            return null;
        }
    },
    
    /**
     * Remove o utilizador da sessão
     */
    logout: function() {
        try {
            sessionStorage.removeItem(CONFIG.STORAGE.SESSION_KEY);
            Logger.success('Logout realizado com sucesso');
            return true;
        } catch (error) {
            Logger.error('Erro ao fazer logout:', error);
            return false;
        }
    },
    
    /**
     * Verifica se o utilizador está autenticado
     */
    isAuthenticated: function() {
        const user = this.getUser();
        return user !== null && user.id !== undefined;
    },
    
    /**
     * Atualiza dados do utilizador na sessão
     */
    updateUser: function(updates) {
        try {
            const currentUser = this.getUser();
            if (!currentUser) {
                Logger.warn('Nenhum utilizador encontrado para atualizar');
                return null;
            }
            
            const updatedUser = { ...currentUser, ...updates };
            sessionStorage.setItem(CONFIG.STORAGE.SESSION_KEY, JSON.stringify(updatedUser));
            Logger.success('Utilizador atualizado:', updatedUser);
            return updatedUser;
        } catch (error) {
            Logger.error('Erro ao atualizar utilizador:', error);
            return null;
        }
    },
    
    /**
     * Obtém configurações do utilizador
     */
    getSettings: function() {
        try {
            const settings = localStorage.getItem(CONFIG.STORAGE.SETTINGS_KEY);
            return settings ? JSON.parse(settings) : {
                theme: 'light',
                language: 'pt-BR',
                notifications: true,
                autoUpload: false
            };
        } catch (error) {
            Logger.error('Erro ao obter configurações:', error);
            return {};
        }
    },
    
    /**
     * Salva configurações do utilizador
     */
    saveSettings: function(settings) {
        try {
            localStorage.setItem(CONFIG.STORAGE.SETTINGS_KEY, JSON.stringify(settings));
            Logger.success('Configurações salvas:', settings);
            return true;
        } catch (error) {
            Logger.error('Erro ao salvar configurações:', error);
            return false;
        }
    },
    
    /**
     * Simula utilizadores para demonstração
     */
    getDemoUsers: function() {
        return [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@example.com',
                password: 'demo123',
                role: 'admin',
                avatar: null
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@example.com',
                password: 'demo123',
                role: 'user',
                avatar: null
            },
            {
                id: 3,
                name: 'Pedro Costa',
                email: 'pedro@example.com',
                password: 'demo123',
                role: 'user',
                avatar: null
            }
        ];
    },
    
    /**
     * Autentica utilizador com email e password (simulado)
     */
    authenticate: function(email, password) {
        const demoUsers = this.getDemoUsers();
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            return this.login(user);
        }
        
        Logger.warn('Credenciais inválidas:', { email });
        return null;
    }
};

// Torna o Session global
window.Session = Session;
