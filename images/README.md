# Images - ISPMedia

Esta pasta contém todos os assets visuais do ISPMedia.

## 📁 Estrutura

```
images/
├── README.md          # Este arquivo
├── logo/              # Logotipos
├── icons/             # Ícones
├── backgrounds/       # Fundos
├── avatars/           # Avatares
└── uploads/           # Uploads simulados
```

## 🎨 Organização de Assets

### **logo/**
- `logo.svg` - Logotipo principal
- `logo-white.svg` - Versão branca
- `logo-dark.svg` - Versão escura
- `favicon.ico` - Ícone do site

### **icons/**
- `home.svg` - Ícone home
- `dashboard.svg` - Ícone dashboard
- `files.svg` - Ícone ficheiros
- `admin.svg` - Ícone admin
- `upload.svg` - Ícone upload
- `download.svg` - Ícone download
- `search.svg` - Ícone pesquisa
- `filter.svg` - Ícone filtros
- `menu.svg` - Ícone menu
- `close.svg` - Ícone fechar
- `user.svg` - Ícone utilizador
- `settings.svg` - Ícone configurações

### **backgrounds/**
- `hero-bg.jpg` - Fundo da hero section
- `pattern.svg` - Padrão de fundo
- `gradient.svg` - Gradiente decorativo

### **avatars/**
- `default-avatar.svg` - Avatar padrão
- `admin-avatar.svg` - Avatar admin
- `user-avatar.svg` - Avatar utilizador

### **uploads/**
- `sample-document.pdf` - Documento exemplo
- `sample-image.jpg` - Imagem exemplo
- `sample-video.mp4` - Vídeo exemplo

## 📏 Especificações

### **Ícones SVG**
- Tamanho: 24x24px base
- Stroke: 1.5px
- Estilo: Outline
- Cor: Controlada via CSS

### **Logotipos**
- Formato: SVG vetorial
- Tamanhos: 32px, 48px, 64px
- Versões: Normal, White, Dark

### **Imagens**
- Formato: WebP (fallback JPG)
- Qualidade: 85%
- Responsivas: Multiple sizes

## 🔧 Implementação

### **Ícones SVG Inline**
```html
<!-- Ícone inline para controle total -->
<svg class="icon">
  <use href="#icon-home"></use>
</svg>
```

### **Sprite SVG**
```html
<!-- Sprite para performance -->
<svg style="display: none;">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <!-- SVG path aqui -->
  </symbol>
</svg>
```

### **Imagens Responsivas**
```html
<!-- Imagens com srcset -->
<img src="image.jpg" 
     srcset="image-sm.jpg 480w, image-md.jpg 768w, image-lg.jpg 1024w"
     alt="Descrição">
```

## 🎯 Otimização

### **SVG**
- Minificados com SVGO
- Sem metadados desnecessários
- Optimizados para web

### **Raster Images**
- Compressão inteligente
- Formatos modernos (WebP, AVIF)
- Lazy loading implementado

### **Performance**
- Sprite SVG para ícones comuns
- Preload de assets críticos
- Dimensões definidas (CLS)

## 🎨 Design System

### **Paleta de Cores**
```css
/* Cores principais nos SVGs */
--primary: #3B82F6
--secondary: #93C5FD
--accent: #DBEAFE
--neutral: #64748B
```

### **Estilo Visual**
- **Minimalista**: Linhas limpas
- **Moderno**: Geometria simples
- **Consistente**: Mesmo peso/estilo
- **Acessível**: Contraste adequado

## 📱 Responsividade

### **Breakpoints**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### **Adaptive Images**
```css
/* Imagens adaptáveis */
.responsive-image {
  width: 100%;
  height: auto;
  max-width: 100%;
}
```

## 🔍 Convenções

### **Nomenclatura**
- Kebab-case: `user-avatar.svg`
- Descritivo: `upload-success-icon.svg`
- Versionado: `logo-v2.svg`

### **Organização**
- Por categoria (icons, logos, etc.)
- Por contexto (dashboard, files, etc.)
- Por tamanho/versão

## 🚀 Adição de Novos Assets

1. **Preparar Asset**
   - Otimizar tamanho/qualidade
   - Nomear conforme convenção
   - Testar em diferentes tamanhos

2. **Adicionar ao Projeto**
   - Colocar na pasta apropriada
   - Atualizar sprites se necessário
   - Testar carregamento

3. **Documentar**
   - Adicionar à lista acima
   - Documentar uso/contexto
   - Atualizar README.md

## 🔧 Ferramentas Recomendadas

- **SVGO**: Otimização SVG
- **ImageOptim**: Compressão raster
- **Figma**: Design/export
- **Squoosh**: Conversão WebP

## 🎯 Próximos Passos

- [ ] Criar sprite SVG completo
- [ ] Implementar lazy loading
- [ ] Adicionar imagens WebP
- [ ] Criar sistema de placeholders
- [ ] Implementar progressive enhancement
