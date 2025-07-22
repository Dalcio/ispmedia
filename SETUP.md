# 🎵 ISPmedia - Setup e Instalação

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **pnpm** (gerenciador de pacotes)
- **Git** (para controle de versão)
- **Firebase CLI** (para configurar o Firebase)

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Instalar Firebase CLI
npm install -g firebase-tools
```

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd ispmedia
```

### 2. Instalar Dependências

```bash
# Na pasta raiz do projeto
pnpm install
```

### 3. Configuração do Firebase

#### 3.1. Criar Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite `ispmedia-dev` como nome
4. Siga o assistente de configuração

#### 3.2. Configurar Authentication
1. No painel do Firebase, vá em **Authentication**
2. Clique em "Começar"
3. Na aba **Sign-in method**, habilite:
   - Email/Password
   - Google (opcional)

#### 3.3. Configurar Firestore Database
1. Vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha modo de **teste** (para desenvolvimento)
4. Selecione uma localização próxima

#### 3.4. Configurar Storage
1. Vá em **Storage**
2. Clique em "Começar"
3. Aceite as regras padrão (modo teste)

#### 3.5. Obter Credenciais Web
1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Na aba **Geral**, role até "Seus apps"
3. Clique em "Adicionar app" → Web (ícone </> )
4. Digite `ispmedia-web` como nome
5. **Copie as credenciais do Firebase** (você precisará delas)

#### 3.6. Configurar Service Account (API Routes)
1. Vá em **Configurações do projeto** → **Contas de serviço**
2. Clique em "Gerar nova chave privada"
3. Baixe o arquivo JSON
4. **Guarde as informações** (você precisará delas)

### 4. Configurar Variáveis de Ambiente

#### 4.1. Copiar arquivo de exemplo
```bash
# Na pasta raiz, copie o arquivo de exemplo
cp .env.example .env.local
```

#### 4.2. Editar .env.local
Edite `.env.local` com suas credenciais do Firebase:

```env
# Firebase Configuration (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ispmedia-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ispmedia-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ispmedia-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX

# Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
# Na pasta raiz
pnpm dev
```
🌐 Acesse: http://localhost:3000
🔗 API: http://localhost:3000/api

### Verificar se está funcionando
- Frontend: http://localhost:3000
- API Health Check: http://localhost:3000/api/health

## 📁 Estrutura do Projeto

```
ispmedia/
├── 📱 Frontend + Backend (Next.js App Router + API Routes)
│   ├── app/
│   │   ├── api/                   # API Routes (Backend)
│   │   │   ├── auth/             # Autenticação
│   │   │   ├── users/            # Usuários
│   │   │   ├── songs/            # Músicas
│   │   │   ├── playlists/        # Playlists
│   │   │   ├── artists/          # Artistas
│   │   │   ├── reviews/          # Críticas
│   │   │   └── health/           # Health check
│   │   ├── components/           # Componentes reutilizáveis
│   │   │   ├── ui/              # Componentes base (Button, Input, etc.)
│   │   │   └── player/          # Componentes do player de música
│   │   ├── auth/                # Páginas de autenticação
│   │   ├── dashboard/           # Dashboard por tipo de usuário
│   │   ├── library/             # Biblioteca de músicas
│   │   ├── playlists/           # Gestão de playlists
│   │   ├── search/              # Busca e filtros
│   │   ├── profile/             # Perfil do usuário
│   │   ├── artist/              # Páginas de artistas
│   │   ├── diagrams/            # Página de diagramas (futura)
│   │   ├── hooks/               # Custom hooks React
│   │   ├── lib/                 # Utilitários e middlewares
│   │   └── types/               # TypeScript interfaces
│   ├── components/              # Componentes compartilhados
│   ├── firebase/                # Configurações Firebase
│   ├── public/                  # Assets estáticos
│   └── styles/                  # Configurações de estilo
│
└── 📚 Documentação
    └── docs/
        └── Ispmedia Planejamento.pdf
```

## 🔧 Scripts Disponíveis

```bash
pnpm dev            # Desenvolvimento com Turbopack
pnpm build          # Build para produção
pnpm start          # Servidor de produção
pnpm lint           # Linting do código
```

## 🎨 Tecnologias Utilizadas

### Full-Stack (Next.js)
- **Next.js 15** (App Router + API Routes)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3** (com glassmorphism)
- **Framer Motion** (animações)
- **Zustand** (gerenciamento de estado)
- **Firebase SDK** (client-side autenticação e Firestore)

### Firebase Services
- **Authentication** (login/cadastro)
- **Firestore** (banco de dados NoSQL)
- **Storage** (arquivos de áudio e imagens)
- **Hosting** (deploy - opcional)

## 🛠️ API Endpoints

### Autenticação
- `POST /api/auth/verify` - Verificar token

### Usuários
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil

### Músicas
- `GET /api/songs` - Listar músicas
- `POST /api/songs` - Upload de música (artistas)

### Playlists
- `GET /api/playlists` - Listar playlists
- `POST /api/playlists` - Criar playlist

### Artistas
- `GET /api/artists` - Listar artistas

### Críticas
- `GET /api/reviews` - Listar críticas
- `POST /api/reviews` - Criar crítica

### Sistema
- `GET /api/health` - Health check

## 🎭 Identidade Visual

### Cores Principais
- **Primária:** `#FDC500` (Dourado ISPmedia)
- **Fundo:** `#0F0F0F` (Preto profundo)
- **Superfície:** Glassmorphism com `rgba(255, 255, 255, 0.05)`

### Design System
- **Glassmorphism moderado** para cards e modais
- **Animações fluidas** com Framer Motion
- **Typography:** Inter (clean e moderno)
- **Iconografia:** Lucide React

## 🚨 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
pnpm install
```

### Erro: Firebase permissions
- Verifique se as regras do Firestore estão em modo teste
- Confirme se as credenciais estão corretas no .env.local

### Erro: Port already in use
```bash
# Matar processo na porta
npx kill-port 3000
```

### Build Error: TypeScript
```bash
# Verificar tipos
pnpm build
```

## 🎯 Próximos Passos

1. **Autenticação:** Implementar login/cadastro com Firebase Auth
2. **Player:** Criar componente de reprodução de música
3. **Upload:** Sistema de upload para artistas
4. **Dashboard:** Painéis por tipo de usuário
5. **Críticas:** Sistema de avaliações e comentários
6. **Deploy:** Configurar Vercel

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme as configurações do Firebase
3. Verifique os logs do console para erros específicos
4. Consulte a documentação do [Next.js](https://nextjs.org/docs) e [Firebase](https://firebase.google.com/docs)

---

**🎵 Desenvolvido com ❤️ para o projeto ISPmedia**
