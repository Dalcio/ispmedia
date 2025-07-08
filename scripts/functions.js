// ==================== FUNÇÕES UTILITÁRIAS ==================== //
const Functions = {
    /**
     * Carrega um componente HTML e insere no elemento especificado
     */
    loadComponent: async function(path, targetElement = '#main-content') {
        try {
            Logger.info(`Carregando componente: ${path}`);
            this.showLoading();
            
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const html = await response.text();
            const target = document.querySelector(targetElement);
            
            if (target) {
                target.innerHTML = html;
                Logger.success(`Componente carregado: ${path}`);
                
                // Executa scripts se existirem
                this.executeScripts(target);
            } else {
                Logger.error(`Elemento alvo não encontrado: ${targetElement}`);
            }
            
            this.hideLoading();
        } catch (error) {
            Logger.error(`Erro ao carregar componente ${path}:`, error);
            this.hideLoading();
            this.renderAlert('error', 'Erro ao carregar página. Tente novamente.');
        }
    },
    
    /**
     * Carrega e exibe um modal
     */
    loadModal: async function(path, modalId = 'modal-generic') {
        try {
            Logger.info(`Carregando modal: ${path}`);
            
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const html = await response.text();
            const container = document.getElementById('modal-container');
            
            if (container) {
                // Cria wrapper do modal
                const modalWrapper = document.createElement('div');
                modalWrapper.className = 'modal-overlay';
                modalWrapper.id = modalId;
                modalWrapper.innerHTML = html;
                
                container.appendChild(modalWrapper);
                
                // Executa scripts do modal
                this.executeScripts(modalWrapper);
                
                // Mostra o modal
                setTimeout(() => {
                    modalWrapper.classList.add('active');
                }, 10);
                
                Logger.success(`Modal carregado: ${path}`);
            }
        } catch (error) {
            Logger.error(`Erro ao carregar modal ${path}:`, error);
            this.renderAlert('error', 'Erro ao abrir modal. Tente novamente.');
        }
    },
    
    /**
     * Fecha um modal específico
     */
    closeModal: function(modalId = 'modal-generic') {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            
            setTimeout(() => {
                modal.remove();
                Logger.success(`Modal fechado: ${modalId}`);
            }, CONFIG.ANIMATION.DURATION_MEDIUM);
        }
    },
    
    /**
     * Fecha todos os modais
     */
    closeAllModals: function() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, CONFIG.ANIMATION.DURATION_MEDIUM);
        });
        Logger.success('Todos os modais fechados');
    },
    
    /**
     * Executa scripts presentes em um elemento
     */
    executeScripts: function(element) {
        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => {
            try {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
                document.head.removeChild(newScript);
            } catch (error) {
                Logger.error('Erro ao executar script:', error);
            }
        });
    },
    
    /**
     * Mostra o loading overlay
     */
    showLoading: function() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.classList.add('active');
        }
    },
    
    /**
     * Esconde o loading overlay
     */
    hideLoading: function() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.classList.remove('active');
        }
    },
    
    /**
     * Renderiza um alerta/notificação
     */
    renderAlert: function(type, message, duration = 5000) {
        const alertContainer = document.getElementById('alert-container') || this.createAlertContainer();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Remove automaticamente após a duração especificada
        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, duration);
        }
        
        Logger.info(`Alerta renderizado: ${type} - ${message}`);
    },
    
    /**
     * Cria container para alertas se não existir
     */
    createAlertContainer: function() {
        let container = document.getElementById('alert-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'alert-container';
            container.style.cssText = `
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 1500;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    },
    
    /**
     * Formata bytes para tamanho legível
     */
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    /**
     * Formata data para formato português
     */
    formatDate: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Gera ID único
     */
    generateId: function(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Debounce para limitar execução de funções
     */
    debounce: function(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    /**
     * Valida email
     */
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Valida arquivo
     */
    validateFile: function(file) {
        const errors = [];
        
        if (!file) {
            errors.push('Nenhum arquivo selecionado');
            return errors;
        }
        
        // Verifica tamanho
        if (file.size > CONFIG.UPLOAD.MAX_FILE_SIZE) {
            errors.push(`Arquivo muito grande. Máximo: ${this.formatFileSize(CONFIG.UPLOAD.MAX_FILE_SIZE)}`);
        }
        
        // Verifica tipo
        if (!CONFIG.UPLOAD.ALLOWED_TYPES.includes(file.type)) {
            errors.push('Tipo de arquivo não permitido');
        }
        
        return errors;
    },
    
    /**
     * Copia texto para clipboard
     */
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.renderAlert('success', 'Texto copiado para a área de transferência');
            return true;
        } catch (error) {
            Logger.error('Erro ao copiar texto:', error);
            this.renderAlert('error', 'Erro ao copiar texto');
            return false;
        }
    },
    
    /**
     * Simula delay (útil para desenvolvimento)
     */
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Torna as Functions globais
window.Functions = Functions;
