# Dashboard - ISPMedia

Esta pasta contém todos os arquivos relacionados ao painel de controlo do ISPMedia.

## 📁 Estrutura

```
app/dashboard/
├── README.md          # Este arquivo
├── dashboard.html     # Página principal
├── dashboard.js       # Lógica da página
└── chart-storage.html # Componente de gráfico
```

## 📊 Página Dashboard

### **dashboard.html**
**Painel de Controlo**
- Visão geral do sistema
- Estatísticas em tempo real
- Gráficos interativos
- Ações rápidas

**Seções:**
- **Stats Cards**: Métricas principais
- **Charts**: Gráficos de armazenamento
- **Activity**: Atividade recente
- **Quick Actions**: Ações rápidas

### **dashboard.js**
**Lógica do Dashboard**
- Carregamento de dados
- Atualização de gráficos
- Eventos de interação
- Refresh automático

**Funcionalidades:**
- Dados em tempo real
- Animações suaves
- Interatividade
- Responsividade

### **chart-storage.html**
**Componente de Gráfico**
- Gráfico de armazenamento
- Visualização de quotas
- Dados interativos
- Exportação SVG

## 🎨 Design

### **Layout Grid**
```css
/* Grid responsivo */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

### **Cards System**
```html
<!-- Card de estatística -->
<div class="stat-card">
  <div class="stat-icon">📊</div>
  <div class="stat-content">
    <h3>1,234</h3>
    <p>Ficheiros</p>
  </div>
</div>
```

### **Glassmorphism Cards**
```css
/* Efeito glassmorphism */
.dashboard-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}
```

## 📈 Gráficos

### **Tipos Disponíveis**
- **Donut Chart**: Distribuição de ficheiros
- **Bar Chart**: Uso ao longo do tempo
- **Line Chart**: Tendências
- **Progress**: Quotas e limites

### **Dados Visualizados**
```javascript
// Exemplo de dados
const storageData = {
  used: 75,
  total: 100,
  categories: {
    documents: 45,
    images: 30,
    videos: 20,
    others: 5
  }
};
```

### **Gráfico de Armazenamento**
```javascript
// Renderização do gráfico donut
function renderStorageChart(data) {
  const chart = Charts.donut({
    data: data.categories,
    colors: ['#3B82F6', '#93C5FD', '#DBEAFE', '#F1F5F9'],
    size: 200
  });
  
  document.getElementById('storage-chart').innerHTML = chart;
}
```

## 🔧 Funcionalidades

### **Estatísticas em Tempo Real**
- **Auto-refresh**: Atualização automática
- **WebSocket**: Dados em tempo real (simulado)
- **Caching**: Cache inteligente
- **Fallback**: Dados offline

### **Interatividade**
- **Hover Effects**: Tooltips informativos
- **Click Actions**: Navegação contextual
- **Drag & Drop**: Reorganização de cards
- **Keyboard**: Navegação por teclado

### **Responsividade**
```css
/* Breakpoints dashboard */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    min-height: 120px;
  }
}
```

## 📊 Dados e Métricas

### **Métricas Principais**
```javascript
// Estrutura de dados
const dashboardData = {
  storage: {
    used: 7.5, // GB
    total: 10, // GB
    percentage: 75
  },
  files: {
    total: 1234,
    recent: 12,
    shared: 45
  },
  users: {
    active: 89,
    total: 150,
    online: 23
  },
  activity: [
    {
      user: 'João Silva',
      action: 'Upload',
      file: 'document.pdf',
      time: '2 min ago'
    }
  ]
};
```

### **Cálculos Automáticos**
```javascript
// Cálculo de percentagens
function calculatePercentage(used, total) {
  return Math.round((used / total) * 100);
}

// Formatação de tamanhos
function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
```

## 🚀 Integração

### **Com Charts.js**
```javascript
// Carregamento de gráficos
Charts.renderDonut('storage-chart', storageData);
Charts.renderBar('usage-chart', usageData);
Charts.renderLine('trend-chart', trendData);
```

### **Com Session.js**
```javascript
// Dados baseados no utilizador
const userData = Session.getCurrentUser();
const userStats = await fetchUserStats(userData.id);
```

### **Com Functions.js**
```javascript
// Utilitários do dashboard
await loadModal('quick-upload', 'app/files/modal-upload.html');
renderAlert('success', 'Dashboard atualizado');
```

## 🎯 Ações Rápidas

### **Botões de Ação**
```html
<!-- Ações rápidas -->
<div class="quick-actions">
  <button class="action-btn" data-action="upload">
    📁 Upload Ficheiro
  </button>
  <button class="action-btn" data-action="share">
    🔗 Partilhar
  </button>
  <button class="action-btn" data-action="backup">
    💾 Backup
  </button>
</div>
```

### **Eventos de Ação**
```javascript
// Manipulação de eventos
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    handleQuickAction(action);
  });
});
```

## 📱 Mobile Dashboard

### **Adaptações Mobile**
- **Swipe Cards**: Navegação por swipe
- **Collapsible**: Seções recolhíveis
- **Touch Targets**: Botões maiores
- **Simplified**: Interface simplificada

### **Gestos**
```javascript
// Suporte a gestos
let startX = 0;
let currentX = 0;

element.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

element.addEventListener('touchmove', (e) => {
  currentX = e.touches[0].clientX;
});

element.addEventListener('touchend', () => {
  const diffX = startX - currentX;
  if (Math.abs(diffX) > 50) {
    // Swipe detectado
    handleSwipe(diffX > 0 ? 'left' : 'right');
  }
});
```

## 🔍 Pesquisa e Filtros

### **Filtros Disponíveis**
- **Período**: Última semana, mês, ano
- **Tipo**: Documentos, imagens, vídeos
- **Utilizador**: Filtrar por utilizador
- **Status**: Ativos, arquivados, partilhados

### **Implementação**
```javascript
// Sistema de filtros
function applyFilters(filters) {
  const filtered = dashboardData.activity.filter(item => {
    if (filters.period) {
      const itemDate = new Date(item.timestamp);
      if (!isWithinPeriod(itemDate, filters.period)) {
        return false;
      }
    }
    
    if (filters.type && item.type !== filters.type) {
      return false;
    }
    
    return true;
  });
  
  updateDashboard(filtered);
}
```

## 🔧 Performance

### **Otimizações**
- **Lazy Loading**: Gráficos sob demanda
- **Virtualization**: Listas virtuais
- **Debouncing**: Pesquisa otimizada
- **Caching**: Cache de dados

### **Loading States**
```html
<!-- Estados de carregamento -->
<div class="loading-skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
  <div class="skeleton-circle"></div>
</div>
```

## 📊 Exportação

### **Formatos Suportados**
- **PDF**: Relatórios completos
- **CSV**: Dados tabulares
- **PNG**: Gráficos
- **JSON**: Dados estruturados

### **Implementação**
```javascript
// Exportação de dados
function exportDashboard(format) {
  const data = getCurrentDashboardData();
  
  switch (format) {
    case 'pdf':
      return generatePDF(data);
    case 'csv':
      return generateCSV(data);
    case 'png':
      return generatePNG(data);
    default:
      return JSON.stringify(data, null, 2);
  }
}
```

## 🚀 Próximos Passos

- [ ] Implementar WebSocket real
- [ ] Adicionar mais tipos de gráficos
- [ ] Criar dashboard customizável
- [ ] Implementar notificações push
- [ ] Adicionar export avançado
- [ ] Criar testes de integração
