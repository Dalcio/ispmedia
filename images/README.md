# Assets - ISPMedia

Esta pasta contém todos os recursos visuais da aplicação ISPMedia.

## Estrutura de Assets

### 📁 Organização

```
/images/
├── icons/          # Ícones SVG e PNG
├── logos/          # Logotipos da aplicação
├── illustrations/  # Ilustrações e gráficos
├── backgrounds/    # Imagens de fundo
├── avatars/        # Avatares padrão
├── placeholders/   # Imagens placeholder
└── demo/          # Imagens para demonstração
```

## Diretrizes de Design

### 🎨 Paleta de Cores

```css
/* Cores Primárias */
--primary: #007bff;
--secondary: #6c757d;
--success: #28a745;
--warning: #ffc107;
--danger: #dc3545;
--info: #17a2b8;

/* Cores Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.25);
--glass-border: rgba(255, 255, 255, 0.3);
--glass-shadow: rgba(0, 0, 0, 0.1);
```

### 📐 Dimensões Padrão

| Tipo             | Tamanho Recomendado | Formato  |
| ---------------- | ------------------- | -------- |
| **Ícones**       | 24px, 32px, 48px    | SVG      |
| **Logos**        | 120px altura        | SVG/PNG  |
| **Avatares**     | 40px, 60px, 80px    | PNG/JPG  |
| **Thumbnails**   | 200x120px           | JPG/WebP |
| **Backgrounds**  | 1920x1080px         | JPG/WebP |
| **Placeholders** | Variável            | SVG      |

## Recursos Disponíveis

### 🎯 Ícones SVG

Conjunto de ícones lineares minimalistas:

```html
<!-- Exemplo de uso -->
<svg class="icon" width="24" height="24">
  <use xlink:href="#icon-play"></use>
</svg>
```

#### Categorias de Ícones:

- **Mídia**: play, pause, stop, volume, fullscreen
- **Navegação**: home, back, forward, menu, close
- **Ações**: upload, download, share, delete, edit
- **Interface**: search, filter, sort, settings, help
- **Usuário**: profile, login, logout, admin, user
- **Arquivo**: file, folder, image, video, audio

### 🏢 Logotipos

- **Logo Principal**: ISPMedia completo
- **Logo Ícone**: Apenas símbolo
- **Logo Horizontal**: Versão horizontal
- **Logo Vertical**: Versão vertical
- **Logo Monochrome**: Versão monocromática

### 🎨 Ilustrações

- **Empty States**: Ilustrações para estados vazios
- **Onboarding**: Ilustrações de introdução
- **Errors**: Ilustrações de erro (404, 500, etc.)
- **Success**: Ilustrações de sucesso
- **Loading**: Ilustrações de carregamento

### 🖼️ Placeholders

```html
<!-- Placeholder dinâmico -->
<img
  src="data:image/svg+xml;base64,..."
  alt="Placeholder"
  class="placeholder-img"
/>
```

Tipos de placeholder:

- **Imagem genérica**: Para quando não há imagem
- **Avatar padrão**: Para usuários sem foto
- **Thumbnail**: Para vídeos sem preview
- **Logo**: Para empresas sem logo

## Otimização

### 🚀 Performance

1. **Formatos otimizados**:

   - SVG para ícones e logos
   - WebP para imagens modernas
   - JPG para fotos (fallback)
   - PNG para transparência

2. **Lazy Loading**:

   ```html
   <img
     src="placeholder.jpg"
     data-src="image.jpg"
     loading="lazy"
     alt="Descrição"
   />
   ```

3. **Responsive Images**:
   ```html
   <picture>
     <source
       srcset="image-large.webp"
       media="(min-width: 800px)"
       type="image/webp"
     />
     <source
       srcset="image-small.webp"
       media="(max-width: 799px)"
       type="image/webp"
     />
     <img src="image-fallback.jpg" alt="Descrição" />
   </picture>
   ```

### 📊 Compressão

- **SVG**: Minificar e remover metadados
- **PNG**: Usar ferramentas como TinyPNG
- **JPG**: Qualidade 80-85% para web
- **WebP**: Qualidade 80% (menor que JPG)

## Implementação

### 🔧 CSS Classes

```css
/* Ícones */
.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}
.icon-lg {
  width: 2rem;
  height: 2rem;
}
.icon-xl {
  width: 3rem;
  height: 3rem;
}

/* Imagens responsivas */
.img-responsive {
  max-width: 100%;
  height: auto;
}

/* Placeholders */
.placeholder-img {
  background: var(--bs-light);
  border: 1px solid var(--bs-border-color);
  border-radius: 0.375rem;
}

/* Avatares */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-sm {
  width: 32px;
  height: 32px;
}
.avatar-lg {
  width: 64px;
  height: 64px;
}
.avatar-xl {
  width: 96px;
  height: 96px;
}
```

### 🎯 JavaScript Helpers

```javascript
// Gerar placeholder dinâmico
function generatePlaceholder(width, height, text) {
  const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                  fill="#6c757d" font-family="Arial" font-size="14">
                ${text}
            </text>
        </svg>
    `;
  return "data:image/svg+xml;base64," + btoa(svg);
}

// Lazy loading de imagens
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => observer.observe(img));
}

// Verificar suporte a WebP
function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
}
```

## Biblioteca de Ícones

### 📚 Sprite SVG

```html
<!-- Sprite de ícones -->
<svg style="display: none;">
  <defs>
    <symbol id="icon-play" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </symbol>
    <symbol id="icon-pause" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </symbol>
    <symbol id="icon-upload" viewBox="0 0 24 24">
      <path
        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"
      />
    </symbol>
    <!-- Mais ícones... -->
  </defs>
</svg>
```

### 🎨 Uso dos Ícones

```html
<!-- Ícone básico -->
<svg class="icon">
  <use xlink:href="#icon-play"></use>
</svg>

<!-- Ícone com classes -->
<svg class="icon icon-lg text-primary">
  <use xlink:href="#icon-upload"></use>
</svg>

<!-- Ícone em botão -->
<button class="btn btn-primary">
  <svg class="icon me-2">
    <use xlink:href="#icon-play"></use>
  </svg>
  Reproduzir
</button>
```

## Recursos Demo

### 🎬 Dados Mock

Para demonstração da aplicação:

```javascript
const mockThumbnails = [
  "https://via.placeholder.com/200x120/007bff/ffffff?text=Video+1",
  "https://via.placeholder.com/200x120/28a745/ffffff?text=Video+2",
  "https://via.placeholder.com/200x120/ffc107/000000?text=Video+3",
];

const mockAvatars = [
  "https://via.placeholder.com/40x40/6c757d/ffffff?text=U",
  "https://via.placeholder.com/40x40/007bff/ffffff?text=A",
  "https://via.placeholder.com/40x40/28a745/ffffff?text=M",
];
```

### 🖼️ Serviços de Placeholder

- **Placeholder.com**: `https://via.placeholder.com/WIDTHxHEIGHT`
- **Unsplash**: `https://source.unsplash.com/WIDTHxHEIGHT`
- **Picsum**: `https://picsum.photos/WIDTH/HEIGHT`

## Acessibilidade

### ♿ Boas Práticas

1. **Alt text descritivo**:

   ```html
   <img src="video-thumb.jpg" alt="Thumbnail do vídeo: Apresentação Q1 2024" />
   ```

2. **Ícones acessíveis**:

   ```html
   <button aria-label="Reproduzir vídeo">
     <svg class="icon" aria-hidden="true">
       <use xlink:href="#icon-play"></use>
     </svg>
   </button>
   ```

3. **Contraste adequado**:
   - Texto: mínimo 4.5:1
   - Ícones: mínimo 3:1
   - Elementos interativos: mínimo 3:1

### 🔍 Ferramentas de Teste

- **Lighthouse**: Auditoria de acessibilidade
- **axe DevTools**: Verificação de acessibilidade
- **Color Contrast Analyzer**: Verificação de contraste

## Manutenção

### 📝 Checklist de Adição

Ao adicionar novos recursos:

- [ ] Otimizar para web
- [ ] Adicionar versões responsivas
- [ ] Incluir alt text
- [ ] Testar em diferentes dispositivos
- [ ] Verificar contraste
- [ ] Documentar uso

### 🔄 Versionamento

```
v1.0.0 - Conjunto inicial de ícones e logos
v1.1.0 - Adição de ilustrações de empty states
v1.2.0 - Otimização para WebP
```

---

## 📞 Suporte

Para dúvidas sobre assets:

1. Verificar dimensões e formatos
2. Consultar esta documentação
3. Testar em diferentes navegadores
4. Validar acessibilidade

**Última atualização:** Dezembro 2024
