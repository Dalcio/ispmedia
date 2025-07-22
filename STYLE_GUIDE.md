# ISPmedia - Guia de Estilo e Design System

## 🎨 Paleta de Cores

### Cores Primárias
```css
/* Brand Colors */
primary-50: #FFFDF0    /* Background muito claro */
primary-100: #FFFADC   /* Background claro */
primary-200: #FFF4B8   /* Borders sutis */
primary-300: #FFED94   /* Elementos secundários */
primary-400: #FFE670   /* Hover states */
primary-500: #FDC500   /* Cor principal da marca */
primary-600: #E6B200   /* Hover principal */
primary-700: #CC9F00   /* Active states */
primary-800: #B38C00   /* Pressed states */
primary-900: #997900   /* Text contrast */
```

### Cores de Background
```css
/* Light Theme */
background-50: #FAFAFA   /* Background principal claro */
background-100: #F5F5F5  /* Background secundário */
background-200: #E5E5E5  /* Cards e elementos */

/* Dark Theme */
background-800: #262626  /* Background secundário escuro */
background-900: #0F0F0F  /* Background principal escuro */
```

### Cores de Estado
```css
/* Success */
success-500: #00FF88

/* Error */
error-500: #FF4757

/* Warning */
warning-500: #FFA726

/* Info */
info-500: #29B6F6
```

## 📝 Tipografia

### Fonte Principal
- **Família**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800, 900
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Hierarquia de Textos
```css
/* Títulos Principais */
.heading-1 { font-size: 4rem; font-weight: 700; line-height: 1.1; }    /* 64px */
.heading-2 { font-size: 3rem; font-weight: 700; line-height: 1.2; }    /* 48px */
.heading-3 { font-size: 2rem; font-weight: 600; line-height: 1.3; }    /* 32px */
.heading-4 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }  /* 24px */

/* Textos do Corpo */
.body-large { font-size: 1.25rem; font-weight: 400; line-height: 1.6; }  /* 20px */
.body-normal { font-size: 1rem; font-weight: 400; line-height: 1.6; }    /* 16px */
.body-small { font-size: 0.875rem; font-weight: 400; line-height: 1.5; } /* 14px */

/* Textos Especiais */
.caption { font-size: 0.75rem; font-weight: 500; line-height: 1.4; }     /* 12px */
```

### Cores de Texto
```css
/* Light Theme */
text-primary: #0A0A0A      /* Texto principal */
text-secondary: #525252    /* Texto secundário */
text-muted: #A3A3A3        /* Texto menos importante */

/* Dark Theme */
text-primary: #FFFFFF      /* Texto principal */
text-secondary: #D4D4D4    /* Texto secundário */
text-muted: #737373        /* Texto menos importante */
```

## 🔘 Componentes de Botão

### Variações de Botão
```html
<!-- Botão Primário -->
<button class="btn-primary">
  Ação Principal
</button>

<!-- Botão Secundário -->
<button class="btn-secondary">
  Ação Secundária
</button>

<!-- Botão Ghost -->
<button class="btn-ghost">
  Ação Sutil
</button>
```

### Estados dos Botões
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #FDC500 0%, #E6B200 100%);
  color: #0a0a0a;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(253, 197, 0, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(253, 197, 0, 0.4);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #FDC500;
  border: 2px solid rgba(253, 197, 0, 0.3);
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 500;
}

.btn-secondary:hover {
  background: rgba(253, 197, 0, 0.1);
  border-color: rgba(253, 197, 0, 0.6);
}
```

## 🎭 Glassmorphism

### Glass Cards
```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.05);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(253, 197, 0, 0.2);
  transform: translateY(-2px);
}
```

### Glass Navigation
```css
.glass-nav {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

/* Dark Theme */
@media (prefers-color-scheme: dark) {
  .glass-nav {
    background: rgba(15, 15, 15, 0.9);
    border-bottom-color: rgba(253, 197, 0, 0.2);
  }
}
```

## 📐 Spacing e Layout

### Sistema de Espaçamento
```css
/* Baseado em múltiplos de 4px */
spacing-1: 0.25rem;  /* 4px */
spacing-2: 0.5rem;   /* 8px */
spacing-3: 0.75rem;  /* 12px */
spacing-4: 1rem;     /* 16px */
spacing-5: 1.25rem;  /* 20px */
spacing-6: 1.5rem;   /* 24px */
spacing-8: 2rem;     /* 32px */
spacing-10: 2.5rem;  /* 40px */
spacing-12: 3rem;    /* 48px */
spacing-16: 4rem;    /* 64px */
spacing-20: 5rem;    /* 80px */
```

### Container
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

## 🎪 Bordas e Sombras

### Border Radius
```css
rounded-sm: 4px;
rounded: 8px;
rounded-lg: 12px;
rounded-xl: 16px;
rounded-2xl: 20px;
rounded-3xl: 24px;
```

### Sombras
```css
/* Card Shadows */
shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);

/* Brand Shadows */
shadow-primary: 0 4px 16px rgba(253, 197, 0, 0.3);
shadow-primary-lg: 0 8px 24px rgba(253, 197, 0, 0.4);
```

## 📱 Grids Responsivos

### Music Grid
```css
.music-grid {
  display: grid;
  gap: 1rem;
}

/* Breakpoints */
@media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
@media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
@media (min-width: 1024px) { grid-template-columns: repeat(5, 1fr); }
@media (min-width: 1280px) { grid-template-columns: repeat(6, 1fr); }
```

### Playlist Grid
```css
.playlist-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
@media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
@media (min-width: 1280px) { grid-template-columns: repeat(4, 1fr); }
```

## 🎨 Gradientes e Efeitos

### Text Gradient
```css
.text-gradient {
  background: linear-gradient(135deg, #FDC500 0%, #E6B200 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Background Gradients
```css
/* Light Theme */
bg-gradient-light: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);

/* Dark Theme */
bg-gradient-dark: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);

/* Primary Gradient */
bg-gradient-primary: linear-gradient(135deg, #FDC500 0%, #E6B200 100%);
```

## 📋 Inputs e Forms

### Form Input
```css
.form-input {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #FDC500;
  box-shadow: 0 0 0 3px rgba(253, 197, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

/* Dark Theme */
@media (prefers-color-scheme: dark) {
  .form-input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
}
```

## 🎭 Modais e Overlays

### Modal Container
```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

/* Dark Theme */
@media (prefers-color-scheme: dark) {
  .modal-content {
    background: rgba(15, 15, 15, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
```

## ⚡ Animações e Transições

### Transições Padrão
```css
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}
```

### Delays de Animação
```css
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-500 { animation-delay: 500ms; }
```

## 🌙 Dark Mode

### Implementação
O tema escuro é suportado através de:
1. `@media (prefers-color-scheme: dark)` - Respeita a preferência do sistema
2. `.dark` class - Permite override manual
3. Todas as cores têm variantes para tema claro e escuro

### Exemplo de Uso
```css
/* Elemento que muda com o tema */
.card {
  background: #ffffff;
  color: #0a0a0a;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .card {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.dark .card {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.1);
}
```

## 📏 Breakpoints

```css
/* Mobile First */
sm: 640px;   /* Tablets pequenos */
md: 768px;   /* Tablets */
lg: 1024px;  /* Laptops */
xl: 1280px;  /* Desktops */
2xl: 1536px; /* Telas grandes */
```

## ✅ Boas Práticas

### Acessibilidade
- Sempre usar `focus-visible` para navegação por teclado
- Contraste mínimo de 4.5:1 para texto normal
- Contraste mínimo de 3:1 para texto grande (>18px)
- Usar `aria-labels` em elementos interativos

### Performance
- Usar `backdrop-filter` com moderação
- Implementar `transition` apenas onde necessário
- Evitar animações desnecessárias em dispositivos móveis

### Consistência
- Sempre usar o sistema de spacing definido
- Usar as classes CSS pré-definidas ao invés de estilos inline
- Manter consistência entre temas claro e escuro
- Seguir a hierarquia tipográfica estabelecida

---

*Este guia de estilo garante consistência visual e uma experiência de usuário excepcional em todo o ISPmedia.*
