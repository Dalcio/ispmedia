# Components - ISPMedia

Esta pasta contém todos os componentes HTML reutilizáveis do ISPMedia.

## 📁 Estrutura

```
components/
├── README.md          # Este arquivo
├── navbar.html        # Navegação superior
├── footer.html        # Rodapé global
└── modal-alert.html   # Modal de alertas
```

## 🧩 Componentes Disponíveis

### **navbar.html**
**Navegação Superior**
- Glassmorphism design
- Menu responsivo mobile
- Controle de autenticação
- Ícones SVG inline
- Navegação SPA dinâmica

**Funcionalidades:**
- Menu hamburger mobile
- Logout automático
- Indicador de utilizador logado
- Navegação por roles (Admin/User)

### **footer.html**
**Rodapé Global**
- Links rápidos
- Atalhos de teclado
- Status da aplicação
- Design minimalista

**Funcionalidades:**
- Links para páginas principais
- Indicador de versão
- Atalhos visuais
- Responsividade completa

### **modal-alert.html**
**Modal de Alertas**
- Alertas de sistema
- Confirmações
- Notificações
- Mensagens de erro/sucesso

**Funcionalidades:**
- Auto-dismiss timer
- Animações suaves
- Tipos de alerta (info, success, warning, error)
- Botões de ação personalizáveis

## 🔧 Carregamento

Os componentes são carregados dinamicamente via JavaScript:

```javascript
// Exemplo de carregamento
await loadComponent('navbar', 'components/navbar.html');
await loadComponent('footer', 'components/footer.html');
```

## 🎨 Design System

Todos os componentes seguem o design system do ISPMedia:

- **Glassmorphism**: Transparência e blur
- **Paleta Azul**: Tons de azul claro
- **Tipografia**: Inter font family
- **Espaçamento**: Sistema de grid 8px
- **Responsividade**: Mobile-first
- **Animações**: Transições suaves

## 📱 Responsividade

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Todos os componentes adaptam-se automaticamente ao tamanho da tela.

## 🔍 Integração

### **Navbar**
- Integra com `session.js` para autenticação
- Integra com `routes.js` para navegação
- Controla visibilidade por role

### **Footer**
- Sempre visível
- Links dinâmicos baseados em autenticação
- Atalhos de teclado visuais

### **Modal Alert**
- Chamado via `renderAlert()` em `functions.js`
- Tipos: `info`, `success`, `warning`, `error`
- Auto-dismiss configurável

## 🎯 Boas Práticas

1. **Componentes Isolados**: Cada componente é independente
2. **Styles Inline**: CSS está no style.css global
3. **JavaScript Externo**: Lógica nos scripts principais
4. **Acessibilidade**: ARIA labels e keyboard navigation
5. **Performance**: Carregamento sob demanda

## 🚀 Extensibilidade

Para adicionar novos componentes:

1. Criar arquivo HTML na pasta `components/`
2. Adicionar estilos no `style.css`
3. Registrar carregamento no `app.js`
4. Documentar no README.md

## 🔧 Debugging

Para verificar componentes carregados:
```javascript
console.log('Navbar loaded:', document.querySelector('#navbar'));
console.log('Footer loaded:', document.querySelector('#footer'));
```
