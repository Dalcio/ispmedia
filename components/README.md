# Componentes HTML

Esta pasta contém todos os componentes HTML reutilizáveis da aplicação ISPMedia.

## Estrutura dos Componentes

### Componentes de Layout

- **navbar.html** - Barra de navegação responsiva
- **footer.html** - Rodapé informativo

### Componentes de Página

- **home.html** - Página inicial
- **login.html** - Página de autenticação
- **upload.html** - Interface de upload de arquivos
- **playlist.html** - Gerenciamento de playlists
- **detalhes.html** - Visualização de detalhes de conteúdo
- **admin.html** - Painel administrativo

### Componentes Reutilizáveis

- **card.html** - Componente de card genérico
- **form-login.html** - Formulário de login
- **modal-alert.html** - Modal de alertas

## Padrões de Desenvolvimento

### Estrutura HTML

- Todos os componentes devem ser fragmentos HTML válidos
- Não incluir tags `<html>`, `<head>`, `<body>`
- Usar classes Bootstrap 5 para estilização
- Aplicar classes personalizadas quando necessário

### Classes CSS

- Usar classes utilitárias do Bootstrap
- Aplicar classes `.glass` para efeitos de glassmorphism
- Usar classes `.fade-in`, `.slide-in-left`, `.slide-in-right` para animações

### Atributos Especiais

- `data-page="pagina"` - Para navegação SPA
- `data-action="acao"` - Para ações globais
- `data-role="papel"` - Para controle de acesso
- `data-form-type="tipo"` - Para identificação de formulários

### Acessibilidade

- Usar atributos ARIA apropriados
- Incluir textos alternativos para imagens
- Garantir contraste adequado
- Suportar navegação por teclado

## Exemplo de Componente

```html
<!-- Exemplo de componente básico -->
<div class="component-container fade-in">
  <div class="card glass-card">
    <div class="card-header">
      <h5 class="card-title">Título do Componente</h5>
    </div>
    <div class="card-body">
      <p class="card-text">Conteúdo do componente...</p>
    </div>
  </div>
</div>
```

## Carregamento de Componentes

Os componentes são carregados dinamicamente via JavaScript:

```javascript
// Carregar componente principal
await loadComponent("components/home.html");

// Carregar componente de UI
await loadUIComponent("components/navbar.html", "#navbar-container");
```

## Testes

Para testar componentes:

1. Navegue até a página que usa o componente
2. Verifique se o HTML é carregado corretamente
3. Teste interações e funcionalidades
4. Valide responsividade em diferentes tamanhos de tela

## Contribuição

Ao criar novos componentes:

1. Siga os padrões estabelecidos
2. Documente funcionalidades especiais
3. Teste em diferentes dispositivos
4. Valide acessibilidade
5. Otimize para performance
