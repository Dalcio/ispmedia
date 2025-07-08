# Admin - ISPMedia

Esta pasta contém todos os arquivos relacionados ao painel administrativo do ISPMedia.

## 📁 Estrutura

```
app/admin/
├── README.md          # Este arquivo
├── admin.html         # Painel administrativo
└── admin.js           # Lógica administrativa
```

## 🛠️ Painel Administrativo

### **admin.html**
**Interface de Administração**
- Gestão de utilizadores
- Configurações do sistema
- Monitorização de armazenamento
- Logs de atividade

**Seções:**
- **Users**: Gestão de utilizadores
- **Storage**: Monitorização de armazenamento
- **Settings**: Configurações do sistema
- **Logs**: Registos de atividade

### **admin.js**
**Lógica Administrativa**
- CRUD de utilizadores
- Configurações do sistema
- Monitorização em tempo real
- Gestão de permissões

**Funcionalidades:**
- Gestão completa de utilizadores
- Configurações avançadas
- Estatísticas detalhadas
- Auditoria de ações

## 🎨 Design

### **Layout Tabs**
```css
/* Sistema de tabs */
.admin-tabs {
  display: flex;
  border-bottom: 2px solid var(--border);
  margin-bottom: 2rem;
}

.admin-tab {
  padding: 1rem 2rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.admin-tab.active {
  border-bottom-color: var(--primary);
  color: var(--primary);
}
```

### **Data Tables**
```html
<!-- Tabela de utilizadores -->
<table class="admin-table">
  <thead>
    <tr>
      <th>Nome</th>
      <th>Email</th>
      <th>Role</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>João Silva</td>
      <td>joao@email.com</td>
      <td>User</td>
      <td><span class="status active">Ativo</span></td>
      <td>
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </td>
    </tr>
  </tbody>
</table>
```

### **Cards de Estatísticas**
```html
<!-- Cards administrativos -->
<div class="admin-stats">
  <div class="stat-card">
    <div class="stat-icon">👥</div>
    <div class="stat-info">
      <h3>150</h3>
      <p>Utilizadores</p>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">💾</div>
    <div class="stat-info">
      <h3>75%</h3>
      <p>Armazenamento</p>
    </div>
  </div>
</div>
```

## 👥 Gestão de Utilizadores

### **Funcionalidades**
- Listar todos os utilizadores
- Criar novos utilizadores
- Editar informações
- Alterar permissões
- Suspender/ativar contas
- Eliminar utilizadores

### **Estrutura de Dados**
```javascript
// Estrutura de utilizador
const user = {
  id: 'user123',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'user', // admin, user, guest
  status: 'active', // active, inactive, suspended
  created: '2024-01-01T00:00:00Z',
  lastLogin: '2024-01-15T10:30:00Z',
  storage: {
    used: 5.2, // GB
    limit: 10 // GB
  },
  permissions: {
    upload: true,
    download: true,
    share: true,
    delete: true
  }
};
```

### **CRUD Operations**
```javascript
// Gestão de utilizadores
class UserManager {
  static async getUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users;
  }
  
  static async createUser(userData) {
    const users = await this.getUsers();
    const newUser = {
      id: 'user' + Date.now(),
      ...userData,
      created: new Date().toISOString(),
      status: 'active'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }
  
  static async updateUser(id, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      return users[index];
    }
    
    throw new Error('Utilizador não encontrado');
  }
  
  static async deleteUser(id) {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(filtered));
  }
}
```

## 💾 Monitorização de Armazenamento

### **Métricas**
```javascript
// Dados de armazenamento
const storageMetrics = {
  total: 1000, // GB
  used: 750,   // GB
  free: 250,   // GB
  users: {
    admin: 50,   // GB
    regular: 600, // GB
    guests: 100  // GB
  },
  types: {
    documents: 300, // GB
    images: 200,    // GB
    videos: 200,    // GB
    others: 50      // GB
  }
};
```

### **Gráficos de Utilização**
```javascript
// Renderização de gráficos admin
function renderStorageChart() {
  const chart = Charts.donut({
    data: storageMetrics.types,
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    size: 300,
    showLabels: true
  });
  
  document.getElementById('storage-chart').innerHTML = chart;
}

function renderUsageChart() {
  const chart = Charts.bar({
    data: storageMetrics.users,
    labels: ['Admin', 'Regular', 'Guests'],
    colors: ['#3B82F6', '#10B981', '#F59E0B']
  });
  
  document.getElementById('usage-chart').innerHTML = chart;
}
```

### **Alertas de Quota**
```javascript
// Sistema de alertas
function checkQuotaAlerts() {
  const alerts = [];
  
  // Verificar quota geral
  const usagePercent = (storageMetrics.used / storageMetrics.total) * 100;
  if (usagePercent > 90) {
    alerts.push({
      type: 'error',
      message: 'Armazenamento quase esgotado (>90%)'
    });
  } else if (usagePercent > 80) {
    alerts.push({
      type: 'warning',
      message: 'Armazenamento em alerta (>80%)'
    });
  }
  
  // Verificar quotas individuais
  users.forEach(user => {
    const userPercent = (user.storage.used / user.storage.limit) * 100;
    if (userPercent > 95) {
      alerts.push({
        type: 'warning',
        message: `${user.name} excedeu 95% da quota`
      });
    }
  });
  
  return alerts;
}
```

## ⚙️ Configurações do Sistema

### **Configurações Disponíveis**
```javascript
// Configurações do sistema
const systemSettings = {
  general: {
    siteName: 'ISPMedia',
    siteUrl: 'https://ispmedia.com',
    adminEmail: 'admin@ispmedia.com',
    timezone: 'Europe/Lisbon',
    language: 'pt-PT'
  },
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4'],
    maxFiles: 100,
    virusScanning: true
  },
  security: {
    sessionTimeout: 30, // minutos
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    webhookUrl: ''
  }
};
```

### **Interface de Configuração**
```html
<!-- Formulário de configurações -->
<form class="settings-form">
  <fieldset>
    <legend>Configurações Gerais</legend>
    
    <div class="form-group">
      <label>Nome do Site</label>
      <input type="text" name="siteName" value="ISPMedia">
    </div>
    
    <div class="form-group">
      <label>Email do Administrador</label>
      <input type="email" name="adminEmail" value="admin@ispmedia.com">
    </div>
  </fieldset>
  
  <fieldset>
    <legend>Uploads</legend>
    
    <div class="form-group">
      <label>Tamanho Máximo (MB)</label>
      <input type="number" name="maxFileSize" value="10">
    </div>
  </fieldset>
  
  <button type="submit" class="btn-save">Guardar Configurações</button>
</form>
```

## 📝 Logs de Atividade

### **Tipos de Logs**
```javascript
// Estrutura de logs
const logEntry = {
  id: 'log123',
  timestamp: '2024-01-15T10:30:00Z',
  level: 'info', // debug, info, warning, error
  category: 'auth', // auth, file, admin, system
  user: 'user123',
  action: 'login',
  details: {
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    success: true
  },
  message: 'Utilizador fez login com sucesso'
};
```

### **Visualização de Logs**
```javascript
// Renderização de logs
function renderLogs(logs) {
  const tbody = document.querySelector('.logs-table tbody');
  tbody.innerHTML = '';
  
  logs.forEach(log => {
    const row = document.createElement('tr');
    row.className = `log-${log.level}`;
    
    row.innerHTML = `
      <td>${formatDate(log.timestamp)}</td>
      <td><span class="log-level ${log.level}">${log.level}</span></td>
      <td>${log.category}</td>
      <td>${log.user || 'Sistema'}</td>
      <td>${log.action}</td>
      <td>${log.message}</td>
      <td>
        <button onclick="showLogDetails('${log.id}')">👁️</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}
```

### **Filtros de Logs**
```javascript
// Sistema de filtros para logs
class LogFilter {
  constructor() {
    this.filters = {
      level: null,
      category: null,
      user: null,
      dateFrom: null,
      dateTo: null
    };
  }
  
  apply(logs) {
    return logs.filter(log => {
      if (this.filters.level && log.level !== this.filters.level) {
        return false;
      }
      
      if (this.filters.category && log.category !== this.filters.category) {
        return false;
      }
      
      if (this.filters.user && log.user !== this.filters.user) {
        return false;
      }
      
      if (this.filters.dateFrom) {
        const logDate = new Date(log.timestamp);
        if (logDate < this.filters.dateFrom) {
          return false;
        }
      }
      
      if (this.filters.dateTo) {
        const logDate = new Date(log.timestamp);
        if (logDate > this.filters.dateTo) {
          return false;
        }
      }
      
      return true;
    });
  }
}
```

## 🔐 Segurança

### **Controle de Acesso**
```javascript
// Verificação de permissões admin
function requireAdmin() {
  const user = Session.getCurrentUser();
  if (!user || user.role !== 'admin') {
    Routes.navigate('/');
    renderAlert('error', 'Acesso negado. Permissões de administrador necessárias.');
    return false;
  }
  return true;
}

// Auditoria de ações
function logAdminAction(action, details) {
  const user = Session.getCurrentUser();
  const logEntry = {
    id: 'log' + Date.now(),
    timestamp: new Date().toISOString(),
    level: 'info',
    category: 'admin',
    user: user.id,
    action: action,
    details: details,
    message: `Admin ${user.name} executou: ${action}`
  };
  
  Logger.log(logEntry);
}
```

### **Validação de Dados**
```javascript
// Validação de dados administrativos
function validateUserData(userData) {
  const errors = [];
  
  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Email inválido');
  }
  
  if (!['admin', 'user', 'guest'].includes(userData.role)) {
    errors.push('Role inválido');
  }
  
  return errors;
}
```

## 📊 Relatórios

### **Relatórios Disponíveis**
- Utilizadores ativos
- Uso de armazenamento
- Atividade por período
- Ficheiros mais acedidos
- Estatísticas de upload

### **Exportação**
```javascript
// Exportação de relatórios
function exportReport(type, format) {
  const data = generateReportData(type);
  
  switch (format) {
    case 'csv':
      return exportCSV(data);
    case 'pdf':
      return exportPDF(data);
    case 'excel':
      return exportExcel(data);
    default:
      return JSON.stringify(data, null, 2);
  }
}

function generateReportData(type) {
  switch (type) {
    case 'users':
      return {
        title: 'Relatório de Utilizadores',
        data: users.map(u => ({
          nome: u.name,
          email: u.email,
          role: u.role,
          ultimo_login: u.lastLogin,
          armazenamento: u.storage.used + ' GB'
        }))
      };
    case 'storage':
      return {
        title: 'Relatório de Armazenamento',
        data: storageMetrics
      };
  }
}
```

## 📱 Responsividade

### **Adaptações Mobile**
```css
/* Admin mobile */
@media (max-width: 768px) {
  .admin-tabs {
    flex-direction: column;
  }
  
  .admin-table {
    font-size: 0.875rem;
  }
  
  .admin-table td,
  .admin-table th {
    padding: 0.5rem 0.25rem;
  }
  
  /* Tabela scrollable */
  .table-container {
    overflow-x: auto;
  }
}
```

### **Interface Touch**
```javascript
// Otimizações para touch
function initTouchOptimizations() {
  // Botões maiores em mobile
  if (window.innerWidth < 768) {
    document.querySelectorAll('.btn-edit, .btn-delete').forEach(btn => {
      btn.style.minWidth = '44px';
      btn.style.minHeight = '44px';
    });
  }
  
  // Swipe em tabelas
  const tables = document.querySelectorAll('.admin-table');
  tables.forEach(table => {
    let startX = 0;
    table.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    table.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;
      table.scrollLeft += diffX;
      startX = currentX;
    });
  });
}
```

## 🚀 Próximos Passos

- [ ] Implementar autenticação 2FA
- [ ] Adicionar sistema de backup
- [ ] Criar dashboard de métricas avançadas
- [ ] Implementar alertas por email
- [ ] Adicionar auditoria completa
- [ ] Criar sistema de roles customizáveis
- [ ] Implementar logs em tempo real
- [ ] Adicionar monitorização de performance
