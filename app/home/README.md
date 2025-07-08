# Home - ISPMedia

Esta pasta contém todos os arquivos relacionados à página inicial do ISPMedia.

## 📁 Estrutura

```
app/home/
├── README.md          # Este arquivo
├── home.html          # Página principal
├── home.js            # Lógica da página
└── modal-auth.html    # Modal de autenticação
```

## 🏠 Página Home

### **home.html**
**Página de Entrada**
- Hero section com CTA
- Seção de funcionalidades
- Estatísticas em tempo real
- Call-to-action para login

**Seções:**
- **Hero**: Título, descrição, botão principal
- **Features**: Cards com funcionalidades
- **Stats**: Números em destaque
- **CTA**: Convite para começar

### **home.js**
**Lógica da Página**
- Animações de entrada
- Carregamento de estatísticas
- Eventos de interação
- Integração com autenticação

**Funcionalidades:**
- Animação de números (counting)
- Intersection Observer para animações
- Lazy loading de conteúdo
- Eventos de scroll

### **modal-auth.html**
**Modal de Autenticação**
- Formulário de login
- Formulário de registo
- Contas demo disponíveis
- Validação de campos

**Funcionalidades:**
- Tabs login/registo
- Validação em tempo real
- Integração com `session.js`
- Contas demo (admin, user, guest)

## 🎨 Design

### **Layout**
- **Mobile-first**: Responsive design
- **Glassmorphism**: Elementos translúcidos
- **Grid System**: Layout flexível
- **Animations**: Entrada suave

### **Hero Section**
```html
<!-- Hero com gradiente e CTA -->
<section class="hero">
  <div class="hero-content">
    <h1>Gestão de Ficheiros Simples</h1>
    <p>Organize, visualize e gerencie seus arquivos...</p>
    <button class="cta-button">Começar Agora</button>
  </div>
</section>
```

### **Features Grid**
```html
<!-- Grid de funcionalidades -->
<div class="features-grid">
  <div class="feature-card">
    <div class="feature-icon">📁</div>
    <h3>Gestão Inteligente</h3>
    <p>Organize seus ficheiros...</p>
  </div>
</div>
```

## 🔧 Funcionalidades

### **Animações**
- **Fade In**: Elementos aparecem gradualmente
- **Count Up**: Números animados
- **Scroll Reveal**: Animações no scroll
- **Hover Effects**: Interações suaves

### **Interatividade**
- **Modal Toggle**: Abertura/fechamento
- **Form Validation**: Validação em tempo real
- **Demo Accounts**: Login rápido
- **Smooth Scroll**: Navegação suave

### **Responsividade**
```css
/* Breakpoints da home */
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .features-grid { grid-template-columns: 1fr; }
}
```

## 🚀 Integração

### **Com Session.js**
```javascript
// Verificação de autenticação
if (Session.isLoggedIn()) {
  // Redirecionar para dashboard
  Routes.navigate('/dashboard');
}
```

### **Com Routes.js**
```javascript
// Navegação SPA
document.querySelector('.cta-button').addEventListener('click', () => {
  Routes.showModal('auth');
});
```

### **Com Functions.js**
```javascript
// Carregamento de componentes
await loadComponent('auth-modal', 'app/home/modal-auth.html');
```

## 📊 Estatísticas

### **Dados Exibidos**
- Utilizadores ativos
- Ficheiros geridos
- Espaço utilizado
- Tempo de atividade

### **Animação de Números**
```javascript
// Contador animado
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);
    if (current >= target) {
      clearInterval(timer);
    }
  }, 20);
}
```

## 🔍 Autenticação

### **Contas Demo**
- **Admin**: admin@ispmedia.com / admin123
- **User**: user@ispmedia.com / user123
- **Guest**: guest@ispmedia.com / guest123

### **Fluxo de Login**
1. Utilizador clica "Começar Agora"
2. Modal de autenticação abre
3. Escolhe conta demo ou preenche dados
4. Validação e redirecionamento
5. Sessão iniciada

### **Validação**
```javascript
// Validação de email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validação de senha
function validatePassword(password) {
  return password.length >= 6;
}
```

## 🎯 SEO & Acessibilidade

### **Meta Tags**
```html
<meta name="description" content="ISPMedia - Gestão de ficheiros simples">
<meta name="keywords" content="gestão, ficheiros, upload, organização">
<meta property="og:title" content="ISPMedia">
```

### **Acessibilidade**
- **ARIA Labels**: Elementos semânticos
- **Keyboard Navigation**: Navegação por teclado
- **Screen Reader**: Suporte a leitores
- **Contrast**: Contraste adequado

## 🔧 Performance

### **Otimizações**
- **Lazy Loading**: Imagens sob demanda
- **Minification**: CSS/JS minificados
- **Compression**: Assets comprimidos
- **Caching**: Cache de componentes

### **Metrics**
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **FCP**: < 1.8s

## 📱 Mobile Experience

### **Touch Interactions**
- **Tap Targets**: Mínimo 44px
- **Swipe Gestures**: Navegação por swipe
- **Pinch Zoom**: Zoom em imagens
- **Orientation**: Suporte a rotação

### **Performance Mobile**
- **Viewport**: Meta tag correta
- **Touch Delay**: Eliminado
- **Scroll**: Suave e responsivo
- **Loading**: Indicadores visuais

## 🚀 Próximos Passos

- [ ] Adicionar mais animações
- [ ] Implementar PWA features
- [ ] Adicionar dark mode
- [ ] Criar testes unitários
- [ ] Otimizar para Core Web Vitals
