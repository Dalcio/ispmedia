# ISPMedia - Plataforma de Mídia Premium

Uma aplicação SPA (Single Page Application) moderna e elegante para gerenciamento de mídia, desenvolvida com HTML5, CSS3 e JavaScript puro.

## 🚀 Características

- **Design Premium**: Interface visualmente superior com glassmorphism sutil
- **SPA Completa**: Navegação sem recarregamento de página
- **Modular**: Componentes HTML reutilizáveis
- **Responsivo**: Mobile-first design
- **Acessível**: Seguindo padrões de acessibilidade
- **Performático**: Carregamento otimizado de componentes

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap 5 (CDN)
- **Fontes**: Google Fonts (Poppins)
- **Ícones**: Bootstrap Icons
- **Arquitetura**: SPA com componentes modulares

## 📁 Estrutura do Projeto

```
ispmedia/
├── index.html              # Arquivo principal da aplicação
├── style.css               # Estilos globais e glassmorphism
├── .gitignore             # Arquivos ignorados pelo Git
├── README.md              # Documentação do projeto
├── components/            # Componentes HTML reutilizáveis
│   ├── home.html          # Página inicial
│   ├── login.html         # Formulário de login
│   ├── upload.html        # Upload de arquivos
│   ├── playlist.html      # Gerenciamento de playlists
│   ├── detalhes.html      # Detalhes do conteúdo
│   ├── admin.html         # Painel administrativo
│   ├── navbar.html        # Barra de navegação
│   ├── footer.html        # Rodapé
│   ├── card.html          # Componente de card
│   ├── form-login.html    # Formulário de login
│   ├── modal-alert.html   # Modal de alertas
│   └── README.md          # Documentação dos componentes
├── scripts/               # JavaScript modular
│   ├── app.js             # Ponto de entrada da aplicação
│   ├── session.js         # Gerenciamento de sessão
│   ├── routes.js          # Definição de rotas
│   ├── config.js          # Configurações globais
│   ├── functions.js       # Funções utilitárias
│   ├── logger.js          # Sistema de logging
│   └── README.md          # Documentação dos scripts
└── images/                # Recursos visuais
    └── README.md          # Documentação das imagens
```

## 🔧 Instalação e Execução

### Pré-requisitos

- Servidor web local (Live Server, http-server, etc.)
- Navegador moderno com suporte a ES6+

### Passos para execução:

1. **Clone ou baixe o projeto**

   ```bash
   git clone <url-do-repositorio>
   cd ispmedia
   ```

2. **Execute com Live Server (VS Code)**

   - Instale a extensão "Live Server" no VS Code
   - Clique com o botão direito em `index.html`
   - Selecione "Open with Live Server"

3. **Ou execute com http-server (Node.js)**

   ```bash
   npx http-server .
   ```

4. **Acesse no navegador**
   - Geralmente disponível em `http://localhost:5500` ou `http://localhost:8080`

## 🎨 Design e UX

### Glassmorphism

O projeto utiliza glassmorphism sutil com:

- Fundos translúcidos
- Blur effects elegantes
- Bordas suaves e sombras
- Transições fluidas

### Paleta de Cores

- **Primary**: #6366f1 (Azul índigo)
- **Secondary**: #8b5cf6 (Roxo)
- **Accent**: #06b6d4 (Ciano)
- **Background**: Gradiente de branco gelo

### Tipografia

- **Fonte principal**: Poppins (Google Fonts)
- **Hierarquia**: Tamanhos responsivos
- **Peso**: 300-700 conforme contexto

## 🔐 Sistema de Autenticação

### Sessão

- Gerenciamento via `sessionStorage`
- Métodos: `login()`, `logout()`, `getUser()`, `isAuthenticated()`

### Níveis de Acesso

- **Public**: Acesso livre (home, login)
- **Authenticated**: Usuários logados (upload, playlist)
- **Admin**: Administradores (admin)

## 📱 Componentes Principais

### Navegação SPA

- Carregamento dinâmico via `fetch()`
- Atributos `data-page` para navegação
- Controle de histórico do navegador

### Componentes Reutilizáveis

- **navbar.html**: Barra de navegação responsiva
- **footer.html**: Rodapé informativo
- **card.html**: Cards de conteúdo
- **modal-alert.html**: Sistema de alertas

### Utilitários

- **Loader**: Spinner animado
- **Alerts**: Notificações Bootstrap
- **Logger**: Sistema de log controlado
- **Functions**: Helpers diversos

## 🌐 Funcionalidades

### Páginas Principais

1. **Home**: Apresentação e recursos
2. **Login**: Autenticação de usuários
3. **Upload**: Envio de arquivos de mídia
4. **Playlist**: Gerenciamento de playlists
5. **Detalhes**: Visualização de conteúdo
6. **Admin**: Painel administrativo

### Recursos Técnicos

- Navegação SPA fluida
- Carregamento assíncrono
- Gestão de estado local
- Controle de acesso por rota
- Interface responsiva

## 📊 Performance

### Otimizações

- Carregamento lazy de componentes
- CSS otimizado com variáveis
- JavaScript modular
- Imagens vetoriais (SVG)

### Métricas Esperadas

- First Paint: < 1s
- Interactive: < 2s
- Lighthouse Score: 90+

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

```javascript
// config.js
const DEV_MODE = true; // Para desenvolvimento
const APP_NAME = "ISPMedia";
const VERSION = "1.0.0";
```

### Debugging

- Console logs controlados via `DEV_MODE`
- Função `logger()` para debug
- Validação de componentes

## 🚀 Deploy

### Preparação para Produção

1. Altere `DEV_MODE = false` em `config.js`
2. Otimize imagens e assets
3. Configure servidor web apropriado
4. Teste em diferentes navegadores

### Hospedagem Sugerida

- **Estático**: Netlify, Vercel, GitHub Pages
- **Tradicional**: Apache, Nginx
- **CDN**: CloudFlare, AWS CloudFront

## 🤝 Contribuição

### Padrões de Código

- Indentação: 4 espaços
- Nomenclatura: camelCase para JS, kebab-case para HTML/CSS
- Comentários: JSDoc para funções
- Commits: Conventional Commits

### Estrutura de Branches

- `main`: Produção
- `develop`: Desenvolvimento
- `feature/`: Novas funcionalidades
- `hotfix/`: Correções urgentes

## 📋 Próximos Passos

### v1.1.0

- [ ] Integração com backend
- [ ] Upload real de arquivos
- [ ] Autenticação JWT
- [ ] Sistema de busca

### v1.2.0

- [ ] Modo escuro opcional
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Compartilhamento social

## 📞 Suporte

Para dúvidas, sugestões ou problemas:

- Abra uma issue no repositório
- Consulte a documentação dos componentes
- Verifique os logs do console (modo DEV)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**ISPMedia** - Plataforma de Mídia Premium com design award-worthy 🏆
