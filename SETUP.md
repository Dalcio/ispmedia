# 🎵 ISPmedia - Setup e Instalação

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.0.0 ou superior)
- **npm** (versão 8.0.0 ou superior) ou **yarn**
- **Git** para controle de versão
- **Conta Firebase** para autenticação e banco de dados
- **Editor de código** (recomendado: VS Code)

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd ispmedia
```

### 2. Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative a **Authentication** (Email/Password e Google)
4. Ative o **Firestore Database**
5. Ative o **Storage** (para upload de imagens/áudio)
6. Copie as credenciais do projeto

### 3. Configuração das Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo com suas credenciais do Firebase
# Use um editor de texto ou VS Code:
code .env.local
```

Preencha todas as variáveis do Firebase com as credenciais do seu projeto.

### 4. Instalação das Dependências

```bash
# Instalar dependências do frontend e backend
npm run install:all

# OU instalar separadamente:
npm install                    # Frontend
npm run server:install        # Backend
```

## 🏃‍♂️ Como Executar

### Desenvolvimento Completo (Frontend + Backend)

```bash
# Executa frontend (porta 3000) e backend (porta 3001) simultaneamente
npm run dev
```

### Executar Apenas o Frontend

```bash
npm run dev:frontend
```

### Executar Apenas o Backend

```bash
npm run dev:backend
```

### Build para Produção

```bash
# Build do frontend
npm run build

# Start do frontend em produção
npm start
```

## 📁 Estrutura do Projeto Explicada

```
ispmedia/
├── 📁 app/                          # Next.js App Router (Frontend)
│   ├── 📄 layout.tsx               # Layout principal da aplicação
│   ├── 📄 page.tsx                 # Página inicial (Landing Page)
│   ├── 📄 globals.css              # Estilos globais com glassmorphism
│   ├── 📁 auth/                    # Páginas de autenticação
│   │   ├── 📁 login/               # Página de login
│   │   └── 📁 register/            # Página de registro
│   ├── 📁 dashboard/               # Dashboard do usuário
│   ├── 📁 artist/[id]/            # Perfis de artistas (rota dinâmica)
│   ├── 📁 album/[id]/             # Páginas de álbuns
│   ├── 📁 playlist/               # Gestão de playlists
│   ├── 📁 search/                 # Busca e exploração
│   ├── 📁 upload/                 # Upload de conteúdo (artistas)
│   ├── 📁 admin/                  # Painel administrativo
│   └── 📁 diagrams/               # **Página de diagramas (futura)**
│
├── 📁 components/                   # Componentes React reutilizáveis
│   ├── 📁 ui/                      # Componentes base (Button, Card, etc.)
│   ├── 📁 audio/                   # Componentes de áudio/player
│   ├── 📁 auth/                    # Componentes de autenticação
│   └── 📁 content/                 # Componentes de conteúdo musical
│
├── 📁 firebase/                     # Configurações e serviços Firebase
│   ├── 📄 config.ts                # Configuração inicial
│   ├── 📄 auth.ts                  # Serviços de autenticação
│   └── 📄 firestore.ts             # Serviços do Firestore
│
├── 📁 server/                       # Backend Express.js
│   ├── 📄 package.json             # Dependências do servidor
│   ├── 📄 tsconfig.json            # Configuração TypeScript do server
│   └── 📁 src/
│       ├── 📄 index.ts             # Entrada principal do servidor
│       └── 📁 routes/              # Rotas da API REST
│           ├── 📄 auth.ts          # Rotas de autenticação
│           ├── 📄 tracks.ts        # Rotas de músicas
│           ├── 📄 playlists.ts     # Rotas de playlists
│           └── 📄 users.ts         # Rotas de usuários
│
├── 📁 types/                       # Tipos TypeScript compartilhados
│   └── 📄 index.ts                 # Interfaces principais
│
├── 📁 stores/                      # Estado global (Zustand)
│   ├── 📄 authStore.ts             # Estado de autenticação
│   └── 📄 audioStore.ts            # Estado do player de áudio
│
├── 📁 styles/                      # Configurações de estilo
│   └── 📄 tailwind.config.ts       # Configuração do Tailwind
│
└── 📁 docs/                        # Documentação
    ├── 📄 analise-funcional.md     # Análise funcional completa
    ├── 📄 SETUP.md                 # Este arquivo
    └── 📄 Ispmedia Planejamento.pdf # Documento original
```

## 🎨 Design System

### Cores Principais
- **Primária**: `#FDC500` (Dourado ISPmedia)
- **Primária Suave**: `rgba(253, 197, 0, 0.1)`
- **Escuro**: `#1A1A1A`, `#2A2A2A`, `#3A3A3A`
- **Texto**: `#FFFFFF`, `#B3B3B3`, `#808080`

### Componentes com Glassmorphism
- `.glass-card` - Cards com efeito de vidro
- `.glass-button` - Botões principais
- `.glass-modal` - Modais com blur
- `.glass-navigation` - Barras de navegação

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev              # Frontend + Backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend
```

### Build e Deploy
```bash
npm run build           # Build de produção
npm start              # Executar build
```

### Utilitários
```bash
npm run install:all     # Instalar todas as dependências
npm run server:install  # Instalar dependências do servidor
```

## 🐛 Solução de Problemas

### Erro: "Module not found: lucide-react"
```bash
npm install lucide-react
```

### Erro: "Firebase not configured"
- Verifique se o arquivo `.env.local` existe
- Confirme se todas as variáveis do Firebase estão preenchidas
- Reinicie o servidor de desenvolvimento

### Erro: "Port 3000 already in use"
```bash
# Matar processo na porta 3000
npx kill-port 3000
# OU usar porta diferente
npm run dev -- --port 3001
```

### Erro: "TypeScript compilation failed"
```bash
# Limpar cache do TypeScript
rm -rf .next
npm run dev
```

## 📚 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos utility-first
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações fluidas
- **Zustand** - Gerenciamento de estado

### Backend
- **Express.js** - Framework web para Node.js
- **TypeScript** - Tipagem estática
- **Cors** - Configuração de CORS
- **Helmet** - Segurança HTTP
- **Morgan** - Logging de requests

### Banco de Dados e Autenticação
- **Firebase Auth** - Autenticação de usuários
- **Firestore** - Banco NoSQL em tempo real
- **Firebase Storage** - Armazenamento de arquivos

## 🚀 Próximos Passos

1. **Configure o Firebase** conforme as instruções
2. **Execute `npm run dev`** para iniciar o desenvolvimento
3. **Acesse `http://localhost:3000`** para ver a aplicação
4. **Implemente as funcionalidades** seguindo a análise funcional
5. **Teste as APIs** em `http://localhost:3001/health`

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se o Firebase está configurado corretamente
3. Consulte a documentação do Next.js e Firebase
4. Verifique os logs no terminal para erros específicos

---

**ISPmedia** - Projeto Escolar de Plataforma de Streaming Musical  
**Versão**: 1.0.0  
**Data**: Janeiro 2025
