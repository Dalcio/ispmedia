# Scripts - ISPMedia

Esta pasta contém todos os scripts JavaScript modulares da aplicação ISPMedia.

## Estrutura dos Scripts

### 📁 Arquivos Principais

| Arquivo        | Descrição                      | Responsabilidade                                          |
| -------------- | ------------------------------ | --------------------------------------------------------- |
| `app.js`       | **Ponto de entrada principal** | Inicialização da SPA, carregamento de UI, eventos globais |
| `session.js`   | **Gerenciamento de sessão**    | Login, logout, autenticação, controle de usuários         |
| `routes.js`    | **Sistema de rotas**           | Definição de rotas, controle de acesso, navegação SPA     |
| `config.js`    | **Configurações globais**      | Constantes, configurações de ambiente, utilitários        |
| `functions.js` | **Funções utilitárias**        | Helpers, componentes, alertas, loader                     |
| `logger.js`    | **Sistema de logging**         | Logs estruturados, controle por ambiente                  |

## Arquitetura

### 🏗️ Padrão de Módulos

Todos os scripts seguem o padrão modular:

```javascript
// Exemplo de estrutura de módulo
(function () {
  "use strict";

  // Variáveis privadas
  const MODULE_NAME = "ExampleModule";

  // Funções privadas
  function privateFunction() {
    // Lógica interna
  }

  // API pública
  window.ExampleModule = {
    init: function () {
      // Inicialização
    },
    publicMethod: function () {
      // Método público
    },
  };

  // Auto-inicialização se necessário
  document.addEventListener("DOMContentLoaded", function () {
    window.ExampleModule.init();
  });
})();
```

### 🔄 Fluxo de Inicialização

1. **config.js** - Carrega configurações globais
2. **logger.js** - Inicializa sistema de logging
3. **functions.js** - Registra funções utilitárias
4. **session.js** - Verifica sessão existente
5. **routes.js** - Configura sistema de rotas
6. **app.js** - Inicializa a aplicação principal

## Dependências

### 📦 Scripts Externos (CDN)

- **Bootstrap 5.3.2** - Framework CSS e componentes JS
- **Font Awesome 6.4.0** - Ícones

### 🔗 Interdependências

```
app.js
├── session.js
├── routes.js
├── functions.js
├── config.js
└── logger.js

routes.js
├── session.js
├── functions.js
└── config.js

functions.js
├── config.js
└── logger.js
```

## Funcionalidades Principais

### 🔐 Autenticação (session.js)

```javascript
// Exemplo de uso
Session.login(userData);
Session.logout();
const user = Session.getUser();
const isAuth = Session.isAuthenticated();
```

### 🛣️ Navegação (routes.js)

```javascript
// Exemplo de uso
Router.navigate("/home");
Router.getCurrentRoute();
Router.hasAccess("admin");
```

### 🔧 Utilitários (functions.js)

```javascript
// Exemplo de uso
loadComponent("components/home.html");
renderAlert("Sucesso!", "success");
showLoader();
```

### 📊 Logging (logger.js)

```javascript
// Exemplo de uso
Logger.info("Aplicação iniciada");
Logger.warn("Aviso importante");
Logger.error("Erro crítico");
```

## Configuração de Desenvolvimento

### 🏗️ Modo Desenvolvimento

```javascript
// Em config.js
const DEV_MODE = true; // ou false para produção

// Habilita logs detalhados
// Mostra informações de debug
// Permite mock de dados
```

### 🔧 Configurações Personalizadas

```javascript
// Exemplo de configuração personalizada
const CONFIG = {
  APP_NAME: "ISPMedia",
  VERSION: "1.0.0",
  API_BASE_URL: "https://api.ispmedia.com",
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: ["mp4", "avi", "mov", "mkv"],
};
```

## Padrões de Código

### 📝 Convenções

1. **Nomes de variáveis**: camelCase
2. **Constantes**: UPPER_SNAKE_CASE
3. **Funções**: camelCase com verbo
4. **Módulos**: PascalCase
5. **Arquivos**: kebab-case

### 🧹 Boas Práticas

- Sempre usar `'use strict'`
- Evitar variáveis globais desnecessárias
- Documentar funções complexas
- Tratar erros adequadamente
- Usar try/catch para operações críticas

### 🔍 Debugging

```javascript
// Usar o logger para debug
Logger.debug("Debug info", { data: someData });

// Ou console em desenvolvimento
if (CONFIG.DEV_MODE) {
  console.log("Debug:", data);
}
```

## Integração com Componentes

### 📋 Carregamento de Componentes

```javascript
// Carregar componente no main
await loadComponent("components/home.html");

// Carregar componente em elemento específico
await loadUIComponent("components/navbar.html", "#navbar");
```

### 🎯 Eventos Globais

```javascript
// Dispatchar evento personalizado
document.dispatchEvent(
  new CustomEvent("userLogin", {
    detail: { user: userData },
  })
);

// Escutar evento personalizado
document.addEventListener("userLogin", function (e) {
  console.log("Usuário logado:", e.detail.user);
});
```

## Performance

### ⚡ Otimizações

- Lazy loading de componentes
- Cache de componentes carregados
- Debounce em eventos frequentes
- Throttle em scroll/resize

### 📈 Monitoramento

```javascript
// Exemplo de medição de performance
const start = performance.now();
// ... código ...
const end = performance.now();
Logger.info(`Operação levou ${end - start}ms`);
```

## Extensibilidade

### 🔌 Adicionando Novos Módulos

1. Criar arquivo seguindo o padrão modular
2. Adicionar dependências no index.html
3. Documentar API pública
4. Adicionar testes se necessário

### 🎨 Customização

```javascript
// Exemplo de plugin/extensão
(function () {
  "use strict";

  // Estender funcionalidade existente
  const originalNavigate = Router.navigate;
  Router.navigate = function (route) {
    // Lógica personalizada
    Logger.info("Navegando para:", route);
    return originalNavigate.call(this, route);
  };
})();
```

## Troubleshooting

### 🐛 Problemas Comuns

1. **Componente não carrega**: Verificar caminho e permissões
2. **Sessão não persiste**: Verificar sessionStorage
3. **Rotas não funcionam**: Verificar configuração de acesso
4. **Logs não aparecem**: Verificar DEV_MODE

### 🔧 Ferramentas de Debug

```javascript
// Informações globais disponíveis
console.log("Session:", Session);
console.log("Router:", Router);
console.log("Config:", CONFIG);
console.log("Current Route:", Router.getCurrentRoute());
```

---

## 📞 Suporte

Para dúvidas sobre os scripts:

1. Verificar logs no console
2. Consultar esta documentação
3. Revisar código-fonte dos módulos
4. Testar em modo desenvolvimento

**Última atualização:** Dezembro 2024
