# Scripts - ISPMedia

Esta pasta contém todos os scripts JavaScript que compõem o sistema ISPMedia.

## 📁 Estrutura

```
scripts/
├── README.md          # Este arquivo
├── app.js            # Inicialização da SPA
├── config.js         # Configurações globais
├── session.js        # Gestão de sessão
├── routes.js         # Sistema de rotas
├── functions.js      # Utilitários globais
├── charts.js         # Renderização de gráficos
└── logger.js         # Sistema de logs
```

## 🚀 Módulos Principais

### **app.js**
- Inicialização da SPA
- Carregamento de componentes globais
- Eventos globais e atalhos
- Integração de todos os módulos

### **config.js**
- Configurações da aplicação
- Limites de ficheiros
- Mensagens padrão
- Cores e constantes

### **session.js**
- Gestão de sessão de utilizador
- Autenticação simulada
- Contas demo (admin, user, guest)
- Controle de permissões

### **routes.js**
- Sistema de rotas SPA
- Controle de autenticação
- Navegação dinâmica
- Gestão de roles

### **functions.js**
- Utilitários globais
- Carregamento de componentes
- Validações
- Alertas e modals

### **charts.js**
- Renderização de gráficos SVG
- Gráficos donut, barras, linhas
- Dados de exemplo
- Utilitários de visualização

### **logger.js**
- Sistema de logs controlado
- Logs de desenvolvimento
- Controle via DEV_MODE
- Debugging simplificado

## 🔧 Dependências

Os scripts seguem uma ordem de carregamento específica:

1. **config.js** - Configurações primeiro
2. **logger.js** - Sistema de logs
3. **session.js** - Gestão de sessão
4. **functions.js** - Utilitários globais
5. **charts.js** - Gráficos
6. **routes.js** - Sistema de rotas
7. **app.js** - Inicialização final

## 📖 Utilização

Todos os scripts são carregados automaticamente no `index.html` na ordem correta. Não é necessário carregar manualmente.

## 🎯 Funcionalidades

- **SPA Completa**: Navegação sem recarregamento
- **Autenticação**: Sistema de login simulado
- **Gráficos**: Visualizações SVG responsivas
- **Logs**: Debug controlado por ambiente
- **Modular**: Cada script tem responsabilidade única
- **Documentado**: Código limpo e comentado

## 🔍 Debug

Para ativar logs de desenvolvimento:
```javascript
// No config.js
DEV_MODE: true
```

## 🌐 Compatibilidade

- ES6+ Features
- Fetch API
- Local Storage
- SVG Manipulation
- CSS Custom Properties
