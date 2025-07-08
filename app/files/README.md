# Files - ISPMedia

Esta pasta contém todos os arquivos relacionados à gestão de ficheiros do ISPMedia.

## 📁 Estrutura

```
app/files/
├── README.md          # Este arquivo
├── file-manager.html  # Gestor de ficheiros
├── files.js           # Lógica da página
├── modal-upload.html  # Modal de upload
└── file-list.html     # Lista de ficheiros
```

## 📂 Gestor de Ficheiros

### **file-manager.html**
**Interface Principal**
- Grid/Lista de ficheiros
- Barra de pesquisa
- Filtros e ordenação
- Menu contextual
- Drag & Drop

**Funcionalidades:**
- Visualização dual (grid/lista)
- Pesquisa em tempo real
- Filtros por tipo/data
- Seleção múltipla
- Ações em lote

### **files.js**
**Lógica do Gestor**
- Carregamento de ficheiros
- Operações CRUD
- Drag & Drop
- Validações

**Funcionalidades:**
- Upload via drag & drop
- Previsualização de ficheiros
- Ordenação dinâmica
- Filtros avançados

### **modal-upload.html**
**Modal de Upload**
- Drag & Drop zone
- Seleção de ficheiros
- Barra de progresso
- Validação em tempo real

### **file-list.html**
**Componente de Lista**
- Item de ficheiro
- Ações por item
- Thumbnails
- Metadados

## 🎨 Design

### **Layout Grid**
```css
/* Grid de ficheiros */
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Vista em lista */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

### **File Cards**
```html
<!-- Card de ficheiro -->
<div class="file-card" data-file-id="123">
  <div class="file-thumbnail">
    <img src="thumbnail.jpg" alt="Ficheiro">
  </div>
  <div class="file-info">
    <h3>document.pdf</h3>
    <p>2.5 MB • 10 min ago</p>
  </div>
  <div class="file-actions">
    <button class="action-btn" data-action="download">⬇️</button>
    <button class="action-btn" data-action="share">🔗</button>
    <button class="action-btn" data-action="delete">🗑️</button>
  </div>
</div>
```

### **Drag & Drop Zone**
```css
/* Zona de drag & drop */
.drop-zone {
  border: 2px dashed var(--primary);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.drop-zone.dragover {
  background: var(--primary-light);
  border-color: var(--primary-dark);
}
```

## 📁 Tipos de Ficheiros

### **Suportados**
```javascript
// Tipos de ficheiros suportados
const supportedTypes = {
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
  audio: ['.mp3', '.wav', '.flac', '.ogg'],
  archives: ['.zip', '.rar', '.7z', '.tar', '.gz']
};
```

### **Validação**
```javascript
// Validação de ficheiros
function validateFile(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = Object.values(supportedTypes).flat();
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Ficheiro muito grande' };
  }
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(extension)) {
    return { valid: false, error: 'Tipo de ficheiro não suportado' };
  }
  
  return { valid: true };
}
```

### **Thumbnails**
```javascript
// Geração de thumbnails
function generateThumbnail(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 200;
        canvas.height = 150;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```

## 🔍 Pesquisa e Filtros

### **Pesquisa em Tempo Real**
```javascript
// Pesquisa de ficheiros
function searchFiles(query) {
  const filtered = files.filter(file => 
    file.name.toLowerCase().includes(query.toLowerCase()) ||
    file.type.toLowerCase().includes(query.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  
  renderFiles(filtered);
}

// Debounce para performance
const debouncedSearch = debounce(searchFiles, 300);
```

### **Filtros Avançados**
```javascript
// Sistema de filtros
const filters = {
  type: null,        // Tipo de ficheiro
  size: null,        // Tamanho
  date: null,        // Data
  author: null,      // Autor
  shared: null       // Partilhado
};

function applyFilters() {
  let filtered = [...files];
  
  if (filters.type) {
    filtered = filtered.filter(file => file.type === filters.type);
  }
  
  if (filters.size) {
    filtered = filtered.filter(file => {
      const size = file.size;
      switch (filters.size) {
        case 'small': return size < 1024 * 1024; // < 1MB
        case 'medium': return size < 10 * 1024 * 1024; // < 10MB
        case 'large': return size >= 10 * 1024 * 1024; // >= 10MB
      }
    });
  }
  
  renderFiles(filtered);
}
```

## 📤 Upload de Ficheiros

### **Drag & Drop**
```javascript
// Implementação drag & drop
const dropZone = document.querySelector('.drop-zone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const files = Array.from(e.dataTransfer.files);
  handleFiles(files);
});
```

### **Upload com Progresso**
```javascript
// Upload com barra de progresso
function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentage = (e.loaded / e.total) * 100;
      updateProgressBar(file.name, percentage);
    }
  });
  
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      showSuccess(`${file.name} enviado com sucesso!`);
      refreshFileList();
    }
  });
  
  xhr.open('POST', '/upload');
  xhr.send(formData);
}
```

### **Fila de Upload**
```javascript
// Gestão de fila de upload
class UploadQueue {
  constructor() {
    this.queue = [];
    this.maxConcurrent = 3;
    this.active = 0;
  }
  
  add(file) {
    this.queue.push(file);
    this.process();
  }
  
  process() {
    if (this.active >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    const file = this.queue.shift();
    this.active++;
    
    uploadFile(file).finally(() => {
      this.active--;
      this.process();
    });
  }
}
```

## 🔧 Operações de Ficheiros

### **Ações Disponíveis**
- **Download**: Descarregar ficheiro
- **Share**: Partilhar via link
- **Rename**: Renomear ficheiro
- **Move**: Mover para pasta
- **Copy**: Copiar ficheiro
- **Delete**: Eliminar ficheiro

### **Menu Contextual**
```javascript
// Menu contextual
function showContextMenu(e, fileId) {
  e.preventDefault();
  
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = `
    <button data-action="download">📥 Download</button>
    <button data-action="share">🔗 Partilhar</button>
    <button data-action="rename">✏️ Renomear</button>
    <button data-action="move">📁 Mover</button>
    <button data-action="delete">🗑️ Eliminar</button>
  `;
  
  menu.style.left = e.pageX + 'px';
  menu.style.top = e.pageY + 'px';
  
  document.body.appendChild(menu);
  
  // Eventos do menu
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action) {
      handleFileAction(action, fileId);
      menu.remove();
    }
  });
}
```

### **Seleção Múltipla**
```javascript
// Seleção múltipla
let selectedFiles = new Set();

function toggleSelection(fileId) {
  if (selectedFiles.has(fileId)) {
    selectedFiles.delete(fileId);
    document.querySelector(`[data-file-id="${fileId}"]`).classList.remove('selected');
  } else {
    selectedFiles.add(fileId);
    document.querySelector(`[data-file-id="${fileId}"]`).classList.add('selected');
  }
  
  updateSelectionUI();
}

function updateSelectionUI() {
  const count = selectedFiles.size;
  const toolbar = document.querySelector('.selection-toolbar');
  
  if (count > 0) {
    toolbar.style.display = 'flex';
    toolbar.querySelector('.count').textContent = `${count} selecionados`;
  } else {
    toolbar.style.display = 'none';
  }
}
```

## 📱 Responsividade

### **Breakpoints**
```css
/* Desktop */
@media (min-width: 1024px) {
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

/* Tablet */
@media (max-width: 768px) {
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* Mobile */
@media (max-width: 480px) {
  .files-grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

### **Mobile Gestures**
```javascript
// Gestos mobile
let touchStart = null;
let touchEnd = null;

function handleTouchStart(e) {
  touchStart = e.targetTouches[0].clientX;
}

function handleTouchMove(e) {
  touchEnd = e.targetTouches[0].clientX;
}

function handleTouchEnd(fileId) {
  if (!touchStart || !touchEnd) return;
  
  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > 50;
  const isRightSwipe = distance < -50;
  
  if (isLeftSwipe) {
    showFileActions(fileId);
  } else if (isRightSwipe) {
    hideFileActions(fileId);
  }
}
```

## 🔐 Segurança

### **Validação de Ficheiros**
```javascript
// Validação de segurança
function validateFileSecurity(file) {
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs'];
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (dangerousExtensions.includes(extension)) {
    return { valid: false, error: 'Tipo de ficheiro não permitido por segurança' };
  }
  
  // Verificação de conteúdo vs extensão
  return checkFileContent(file);
}
```

### **Sanitização**
```javascript
// Sanitização de nomes
function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}
```

## 📊 Metadados

### **Informações do Ficheiro**
```javascript
// Estrutura de metadados
const fileMetadata = {
  name: 'document.pdf',
  size: 2547392,
  type: 'application/pdf',
  created: '2024-01-15T10:30:00Z',
  modified: '2024-01-15T10:30:00Z',
  author: 'João Silva',
  tags: ['importante', 'trabalho'],
  permissions: {
    read: true,
    write: true,
    share: true
  }
};
```

### **Extração de Metadados**
```javascript
// Extração automática
function extractMetadata(file) {
  const metadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified)
  };
  
  // Metadados específicos por tipo
  if (file.type.startsWith('image/')) {
    return extractImageMetadata(file, metadata);
  } else if (file.type === 'application/pdf') {
    return extractPDFMetadata(file, metadata);
  }
  
  return metadata;
}
```

## 🚀 Próximos Passos

- [ ] Implementar sincronização cloud
- [ ] Adicionar versionamento
- [ ] Criar sistema de tags
- [ ] Implementar OCR para PDFs
- [ ] Adicionar previsualização inline
- [ ] Criar sistema de backup automático
