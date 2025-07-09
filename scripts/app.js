// ISP Media - Application JavaScript

// Global Modal Management
class ModalManager {
    static open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }

    static close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore background scroll
        }
    }

    static closeOnOverlay(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    ModalManager.close(modalId);
                }
            });
        }
    }
}

// Authentication System
class AuthManager {
    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
    }

    static handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

        // Simulate API call
        this.showLoading(e.target);
        
        setTimeout(() => {
            console.log('Login attempt:', { email });
            this.hideLoading(e.target);
            ModalManager.close('authModal');
            this.showToast('Welcome back! Login successful.', 'success');
            
            // Update UI to show logged in state
            this.updateUIForLoggedInUser({ email, name: email.split('@')[0] });
        }, 1500);
    }

    static handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const inputs = e.target.querySelectorAll('input');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match!', 'error');
            return;
        }

        // Simulate API call
        this.showLoading(e.target);
        
        setTimeout(() => {
            console.log('Register attempt:', { name, email });
            this.hideLoading(e.target);
            ModalManager.close('authModal');
            this.showToast('Account created successfully!', 'success');
            
            // Update UI to show logged in state
            this.updateUIForLoggedInUser({ email, name });
        }, 2000);
    }

    static showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Loading...</span>';
        }
    }

    static hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            const isLogin = form.id === 'loginForm';
            submitBtn.innerHTML = isLogin ? 'Sign In' : 'Create Account';
        }
    }

    static updateUIForLoggedInUser(user) {
        // Update navbar to show user info instead of login button
        const navbar = document.querySelector('.navbar-content');
        if (navbar) {
            const actionsDiv = navbar.querySelector('.flex.items-center.gap-3');
            if (actionsDiv) {
                actionsDiv.innerHTML = `
                    <span class="text-sm text-muted">Welcome, ${user.name}</span>
                    <button class="btn btn-ghost btn-sm" onclick="AuthManager.logout()">Logout</button>
                `;
            }
        }
    }

    static logout() {
        // Reset UI to logged out state
        location.reload(); // Simple refresh for demo
    }

    static showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// File Upload System
class UploadManager {
    constructor() {
        this.queue = [];
        this.isUploading = false;
        this.maxFileSize = 100 * 1024 * 1024; // 100MB
        this.supportedTypes = {
            'image': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            'video': ['mp4', 'avi', 'mov', 'wmv', 'flv'],
            'document': ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
            'audio': ['mp3', 'wav', 'flac', 'aac'],
            'archive': ['zip', 'rar', '7z', 'tar', 'gz']
        };
    }

    addFiles(files) {
        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                this.queue.push({
                    id: Date.now() + Math.random(),
                    file: file,
                    status: 'pending',
                    progress: 0
                });
            }
        });
        this.updateQueueDisplay();
    }

    validateFile(file) {
        if (file.size > this.maxFileSize) {
            AuthManager.showToast(`File "${file.name}" is too large. Maximum size is 100MB.`, 'error');
            return false;
        }

        const extension = file.name.split('.').pop().toLowerCase();
        const isSupported = Object.values(this.supportedTypes).some(types => types.includes(extension));
        
        if (!isSupported) {
            AuthManager.showToast(`File type "${extension}" is not supported.`, 'error');
            return false;
        }

        return true;
    }

    getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        for (const [type, extensions] of Object.entries(this.supportedTypes)) {
            if (extensions.includes(ext)) {
                return type;
            }
        }
        return 'document';
    }

    getFileIcon(filename) {
        const type = this.getFileType(filename);
        const icons = {
            'image': '🖼️',
            'video': '🎥',
            'document': '📄',
            'audio': '🎵',
            'archive': '🗜️'
        };
        return icons[type] || '📄';
    }

    getFileColor(filename) {
        const type = this.getFileType(filename);
        const colors = {
            'image': '#4CAF50',
            'video': '#2196F3',
            'document': '#FF5252',
            'audio': '#9C27B0',
            'archive': '#795548'
        };
        return colors[type] || '#9E9E9E';
    }

    async startUpload() {
        if (this.queue.length === 0 || this.isUploading) return;

        this.isUploading = true;
        
        for (const item of this.queue) {
            await this.uploadFile(item);
        }

        this.isUploading = false;
        AuthManager.showToast(`Successfully uploaded ${this.queue.length} files!`, 'success');
        
        // Clear queue after successful upload
        setTimeout(() => {
            this.queue = [];
            ModalManager.close('uploadModal');
        }, 1500);
    }

    async uploadFile(item) {
        return new Promise((resolve) => {
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    item.status = 'completed';
                    item.progress = 100;
                    clearInterval(interval);
                    resolve();
                } else {
                    item.progress = progress;
                }
                this.updateProgressDisplay(item);
            }, 200);
        });
    }

    updateProgressDisplay(item) {
        const progressBar = document.getElementById(`progress-${item.id}`);
        const statusDiv = document.getElementById(`status-${item.id}`);
        
        if (progressBar) {
            progressBar.style.width = item.progress + '%';
        }
        
        if (statusDiv) {
            if (item.status === 'completed') {
                statusDiv.textContent = 'Complete ✓';
                statusDiv.style.color = 'var(--success)';
            } else {
                statusDiv.textContent = `${Math.round(item.progress)}%`;
            }
        }
    }

    updateQueueDisplay() {
        const queueDiv = document.getElementById('uploadQueue');
        const queueList = document.getElementById('queueList');
        const queueCount = document.getElementById('queueCount');
        
        if (!queueDiv || !queueList) return;

        if (this.queue.length > 0) {
            queueDiv.classList.remove('hidden');
            
            queueList.innerHTML = this.queue.map(item => `
                <div class="queue-item">
                    <div class="file-icon" style="background: ${this.getFileColor(item.file.name)};">
                        ${this.getFileIcon(item.file.name)}
                    </div>
                    <div class="file-info" style="flex: 1;">
                        <p class="file-name">${item.file.name}</p>
                        <p class="file-meta">${this.formatFileSize(item.file.size)}</p>
                    </div>
                    <button class="btn btn-ghost btn-sm" onclick="uploadManager.removeFromQueue('${item.id}')">✕</button>
                </div>
            `).join('');
            
            if (queueCount) {
                queueCount.textContent = this.queue.length;
            }
        } else {
            queueDiv.classList.add('hidden');
        }
    }

    removeFromQueue(id) {
        this.queue = this.queue.filter(item => item.id !== id);
        this.updateQueueDisplay();
    }

    clearQueue() {
        this.queue = [];
        this.updateQueueDisplay();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Global instances
let uploadManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize systems
    AuthManager.init();
    uploadManager = new UploadManager();
    
    // Setup modal overlay clicks
    ModalManager.closeOnOverlay('authModal');
    ModalManager.closeOnOverlay('uploadModal');
});

// Global functions for modal management
function openAuthModal() {
    ModalManager.open('authModal');
}

function closeAuthModal() {
    ModalManager.close('authModal');
}

function openUploadModal() {
    ModalManager.open('uploadModal');
}

function closeUploadModal() {
    ModalManager.close('uploadModal');
}

// Auth tab switching
function switchTab(tab) {
    document.getElementById('loginTab').classList.toggle('active', tab === 'login');
    document.getElementById('registerTab').classList.toggle('active', tab === 'register');
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
}

// Upload functions
function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('drag-over');
    uploadManager.addFiles(e.dataTransfer.files);
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('drag-over');
}

function handleFileSelect(e) {
    uploadManager.addFiles(e.target.files);
}

function startUpload() {
    uploadManager.startUpload();
}

function clearQueue() {
    uploadManager.clearQueue();
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
