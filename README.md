# ISPMedia - Gestão Moderna de Ficheiros

Uma aplicação **SPA (Single Page Application)** minimalista e moderna para gestão de ficheiros, desenvolvida com **HTML5**, **CSS3** e **JavaScript puro**.

## 🎯 Características Principais

- **Design ultraminimalista** com paleta de cores azul suave
- **Interface responsiva** e mobile-first
- **Navegação SPA** sem recarregamento de página
- **Sistema de autenticação** simulado
- **Dashboard completo** com gráficos e estatísticas
- **Gestão de ficheiros** com drag & drop
- **Painel de administração** para utilizadores admin
- **Glassmorphism** sutil para elementos especiais

## 🚀 Funcionalidades

### 🏠 Página Inicial
- Apresentação da aplicação
- Demonstração de funcionalidades
- Acesso rápido ao sistema

### 📊 Dashboard
- Estatísticas em tempo real
- Gráficos de uso de armazenamento
- Atividade recente
- Ações rápidas

### 📁 Gestão de Ficheiros
- Upload via drag & drop
- Visualização em grade ou lista
- Pesquisa e filtros
- Organização por pastas
- Menu contextual para ações

### 👥 Administração
- Gestão de utilizadores
- Monitoramento de armazenamento
- Configurações do sistema
- Logs de atividade

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos e responsivos
- **JavaScript ES6+** - Funcionalidades dinâmicas
- **SVG** - Ícones vectoriais
- **Local/Session Storage** - Armazenamento local
- **Fetch API** - Carregamento dinâmico de conteúdo

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Suporte a ES6+
- JavaScript habilitado

## 🔧 Instalação

1. Clone ou descarregue o projeto
2. Abra o ficheiro `index.html` num navegador
3. Ou sirva através de um servidor local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

## 🎨 Estrutura do Projeto

```
ispmedia/
├── index.html              # Página principal
├── style.css               # Estilos globais
├── README.md              # Documentação
├── .gitignore             # Ficheiros ignorados
├── app/                   # Páginas da aplicação
│   ├── home/             # Página inicial
│   ├── dashboard/        # Dashboard
│   ├── files/            # Gestão de ficheiros
│   └── admin/            # Administração
├── components/           # Componentes reutilizáveis
│   ├── navbar.html      # Barra de navegação
│   └── footer.html      # Rodapé
├── scripts/              # JavaScript modular
│   ├── app.js           # Aplicação principal
│   ├── config.js        # Configurações
│   ├── session.js       # Gestão de sessão
│   ├── functions.js     # Funções utilitárias
│   ├── charts.js        # Gráficos
│   ├── routes.js        # Sistema de rotas
│   └── logger.js        # Sistema de logs
└── images/              # Recursos visuais
```

## 🎯 Contas de Demonstração

### Administrador
- **Email:** joao@example.com
- **Palavra-passe:** demo123
- **Acesso:** Todas as funcionalidades

### Utilizador
- **Email:** maria@example.com
- **Palavra-passe:** demo123
- **Acesso:** Funcionalidades básicas

## ⌨️ Atalhos de Teclado

- `Ctrl + H` - Ir para Início
- `Ctrl + D` - Ir para Dashboard
- `Ctrl + F` - Ir para Ficheiros
- `Ctrl + U` - Abrir Upload
- `Esc` - Fechar modais

## 🎨 Design System

### Paleta de Cores
- **Azul Principal:** #1F7AE0
- **Azul Suave:** #D4E6F1
- **Azul Acinzentado:** #B0C4DE
- **Branco:** #FFFFFF
- **Cinzento Claro:** #F8F9FA

### Tipografia
- **Fonte:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600

### Componentes
- **Botões:** Primário, Secundário, Ghost
- **Cards:** Sombra suave, bordas arredondadas
- **Modais:** Glassmorphism, animações suaves
- **Formulários:** Inputs limpos, validação visual

## 📱 Responsividade

- **Mobile First:** Design otimizado para dispositivos móveis
- **Breakpoints:** 480px, 768px, 1024px
- **Flexbox/Grid:** Layout flexível e adaptável
- **Touch Friendly:** Elementos tocáveis adequados

## 🔒 Segurança

- Validação de ficheiros no frontend
- Sanitização de inputs
- Gestão segura de sessões
- Controle de acesso baseado em roles

## 📈 Performance

- **Carregamento lazy** de componentes
- **Minificação** automática de recursos
- **Caching** inteligente
- **Otimização** de imagens SVG

## 🧪 Funcionalidades Simuladas

- Upload de ficheiros
- Autenticação de utilizadores
- Armazenamento em nuvem
- Processamento de imagens
- Notificações push
- Backup automático

## 🔄 Atualizações Futuras

- [ ] Integração com API real
- [ ] Suporte a múltiplos idiomas
- [ ] Modo escuro/claro
- [ ] Notificações push
- [ ] Compartilhamento de ficheiros
- [ ] Histórico de versões

## 📞 Suporte

Para dúvidas ou sugestões, entre em contacto através dos issues do projeto ou email.

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

---

**ISPMedia** - Gestão moderna de ficheiros com elegância e simplicidade. ✨
