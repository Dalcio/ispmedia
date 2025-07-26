# 🎵 ISPmedia - Guia de Configuração Completo

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

### Software Necessário
- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **pnpm** (gerenciador de pacotes recomendado)
- **Git** (para controle de versão)
- **Firebase CLI** (para configuração do Firebase)
- **Conta Google** (para acessar Firebase Console)

### Instalação dos Pré-requisitos
```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Instalar Firebase CLI
npm install -g firebase-tools

# Verificar versões instaladas
node --version    # Deve ser >= 18.0.0
pnpm --version    # Deve estar instalado
firebase --version # Deve estar instalado
```

---

## 🚀 Instalação do Projeto

### 1. Clone e Configure o Repositório

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd ispmedia

# Instalar dependências
pnpm install
```

### 2. Criar Arquivo de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# ===== FIREBASE CONFIGURATION =====
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ===== FIREBASE ADMIN (Opcional - para API routes) =====
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# ===== DEVELOPMENT =====
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ **Importante**: Nunca faça commit do arquivo `.env.local`. Ele já está no `.gitignore`.

---

## 🔥 Configuração do Firebase

### 1. Acessar Firebase Console
1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Faça login com sua conta Google
3. Clique em "Adicionar projeto" ou "Create a project"

### 2. Criar Projeto Firebase
1. **Nome do projeto**: `ISPmedia` (ou nome de sua escolha)
2. **Google Analytics**: Pode desabilitar para este projeto
3. Clique em "Criar projeto"
4. Aguarde a criação (1-2 minutos)

### 3. Configurar Firebase Authentication

#### 3.1. Ativar Authentication
1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"** ou **"Get started"**
3. Vá para a aba **"Sign-in method"**

#### 3.2. Configurar Métodos de Login
1. **Email/Password**:
   - Clique em "Email/Password"
   - **Ative** a primeira opção
   - **Desative** "Email link" (não necessário)
   - Clique em "Salvar"

2. **Google** (Opcional):
   - Clique em "Google"
   - Ative a opção
   - Configure o email de suporte
   - Clique em "Salvar"

### 4. Configurar Firestore Database

#### 4.1. Criar Banco de Dados
1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. **Modo de segurança**: Selecione **"Começar no modo de teste"**
   > 📝 Isso permite leitura/escrita por 30 dias. Depois configuraremos regras de produção.
4. **Localização**: Escolha a mais próxima (ex: `southamerica-east1`)
5. Clique em "Concluído"

#### 4.2. Estrutura de Coleções Esperada
O aplicativo criará automaticamente as seguintes coleções:

```
firestore/
├── users/               # Perfis dos usuários
├── tracks/              # Músicas uploadadas
├── tracks/{id}/comments # Comentários das músicas
├── playlists/           # Playlists dos usuários
└── atividades/          # Histórico de atividades
```

### 5. Configurar Firebase Storage

#### 5.1. Ativar Storage
1. No menu lateral, clique em **"Storage"**
2. Clique em **"Começar"** ou **"Get started"**
3. **Regras de segurança**: Aceite as regras padrão (modo teste)
4. **Localização**: Use a mesma do Firestore
5. Clique em "Concluído"

#### 5.2. Estrutura de Pastas
O aplicativo organizará os arquivos assim:

```
storage/
└── tracks/
    └── {userId}/
        └── {timestamp}_{filename}.mp3
```

### 6. Obter Credenciais do Firebase

#### 6.1. Configurar Web App
1. Na página principal do projeto, clique no ícone **"</> Web"**
2. **Nome do app**: `ISPmedia Web`
3. **NÃO** marque "Configure também o Firebase Hosting"
4. Clique em "Registrar app"

#### 6.2. Copiar Configuração
Você verá uma tela com código JavaScript similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

#### 6.3. Atualizar .env.local
Copie os valores da configuração para seu arquivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

### 7. Configurar Service Account (Opcional - Para API Routes)

#### 7.1. Gerar Chave Privada
1. Vá em **"Configurações do projeto"** (ícone de engrenagem)
2. Clique na aba **"Contas de serviço"**
3. Clique em **"Gerar nova chave privada"**
4. Escolha formato **JSON**
5. Clique em **"Gerar chave"**
6. **Guarde o arquivo JSON baixado com segurança**

#### 7.2. Extrair Informações
Abra o arquivo JSON baixado e copie as informações para `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=abc123def456
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...SEU_PRIVATE_KEY_AQUI...AAAA\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901
```

> ⚠️ **Segurança**: Nunca compartilhe estas credenciais. Elas dão acesso administrativo total ao seu projeto Firebase.

---

## ⚙️ Configuração das Regras de Segurança

### 1. Regras do Firestore

#### 1.1. Para Desenvolvimento
1. No Firebase Console, vá em **"Firestore Database"**
2. Clique na aba **"Regras"**
3. Cole o seguinte código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem acessar seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Tracks: leitura pública, escrita apenas pelo criador
    match /tracks/{trackId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
      
      // Comentários das tracks
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && request.auth.uid == resource.data.userId;
        allow update, delete: if request.auth != null && 
          (request.auth.uid == resource.data.userId || 
           request.auth.uid == get(/databases/$(database)/documents/tracks/$(trackId)).data.createdBy);
      }
    }

    // Playlists: acesso baseado no criador
    match /playlists/{playlistId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }

    // Atividades: apenas leitura pelo usuário, escrita via admin
    match /atividades/{activityId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if false; // Apenas via Firebase Admin
    }
  }
}
```

4. Clique em **"Publicar"**

#### 1.2. Para Produção
Quando estiver pronto para produção, revise as regras para serem mais restritivas.

### 2. Regras do Storage

#### 2.1. Configurar Regras
1. No Firebase Console, vá em **"Storage"**
2. Clique na aba **"Regras"**
3. Cole o seguinte código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Tracks: usuário só pode fazer upload na sua pasta
    match /tracks/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 50 * 1024 * 1024  // 50MB max
                   && request.resource.contentType.matches('audio/.*');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Clique em **"Publicar"**

---

## 🔧 Implantação das Configurações

### 1. Login no Firebase CLI
```bash
# Fazer login no Firebase
firebase login

# Verificar se está logado corretamente
firebase projects:list
```

### 2. Inicializar Firebase no Projeto
```bash
# Na pasta raiz do projeto
firebase init

# Selecione:
# - Firestore: Configure rules and indexes files
# - Storage: Configure security rules file
# - Use existing project -> selecione seu projeto
```

### 3. Implantar Regras
```bash
# Implantar regras do Firestore
firebase deploy --only firestore:rules

# Implantar regras do Storage  
firebase deploy --only storage:rules

# Ou implantar tudo de uma vez
npm run deploy-firebase-rules
```

---

## 🏃 Início do Projeto

### 1. Verificar Configuração
```bash
# Verificar se Firebase está configurado corretamente
npm run check-firebase-setup

# Verificar variáveis de ambiente
npm run check-firebase
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
# Iniciar o projeto
pnpm dev

# Ou usando NPM
npm run dev
```

### 3. Acessar Aplicação
Abra seu navegador e acesse:
- **URL**: http://localhost:3000
- **Porta padrão**: 3000
- **Hot reload**: Ativado automaticamente

---

## 🛠️ Estrutura de Dados no Firestore

### Coleções e Documentos

#### Users Collection
```typescript
// Caminho: users/{userId}
interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  profilePicture?: string;
}
```

#### Tracks Collection
```typescript
// Caminho: tracks/{trackId}
interface Track {
  id: string;
  title: string;
  genre: string;
  createdBy: string;        // UID do usuário
  createdAt: Timestamp;
  audioUrl: string;         // URL do Firebase Storage
  fileName: string;
  fileSize: number;
  duration?: number;        // Em segundos
  mimeType: string;
  playCount: number;        // Contador de reproduções
}
```

#### Comments Subcollection
```typescript
// Caminho: tracks/{trackId}/comments/{commentId}
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  trackId: string;
  content: string;
  timestamp: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
}
```

#### Playlists Collection
```typescript
// Caminho: playlists/{playlistId}
interface Playlist {
  id: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private';
  tracks: string[];         // Array de IDs das tracks
  createdBy: string;        // UID do usuário
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Activities Collection
```typescript
// Caminho: atividades/{activityId}
interface Activity {
  id: string;
  userId: string;
  tipo: 'reproducao' | 'upload' | 'pausa' | 'pulo' | 'curtida';
  trackId?: string;
  detalhes?: any;
  timestamp: Timestamp;
}
```

---

## 🚨 Erros Comuns e Soluções

### 1. Erro: "Firebase API key not found"
**Problema**: Variáveis de ambiente não configuradas
**Solução**:
```bash
# Verificar se .env.local existe e tem as variáveis corretas
cat .env.local

# Reiniciar servidor após editar .env.local
pnpm dev
```

### 2. Erro: "FirebaseError: Missing or insufficient permissions"
**Problema**: Regras do Firestore muito restritivas ou usuário não autenticado
**Solução**:
- Fazer login na aplicação
- Verificar se as regras foram implantadas corretamente
- Verificar se o usuário tem permissão para a operação

### 3. Erro: "storage/unauthorized" no upload
**Problema**: Regras do Storage não configuradas ou usuário sem permissão
**Solução**:
```bash
# Implantar regras do Storage
firebase deploy --only storage:rules

# Verificar se usuário está autenticado
# Verificar se arquivo tem formato permitido (audio/*)
```

### 4. Erro: "Firebase project not found"
**Problema**: Projeto não configurado corretamente
**Solução**:
```bash
# Verificar se está no projeto correto
firebase use --list

# Trocar para projeto correto
firebase use your-project-id
```

### 5. Erro de CORS no desenvolvimento
**Problema**: Regras de CORS do Firebase
**Solução**:
- Verificar se domínio localhost está autorizado no Firebase Console
- Verificar se as regras de Storage estão corretas

---

## 📋 Checklist de Configuração

### ✅ Pré-requisitos
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] Firebase CLI instalado
- [ ] Conta Google ativa

### ✅ Firebase Console
- [ ] Projeto Firebase criado
- [ ] Authentication configurado (Email/Password)
- [ ] Firestore Database criado (modo teste)
- [ ] Storage configurado
- [ ] Web app registrado
- [ ] Credenciais copiadas

### ✅ Projeto Local
- [ ] Repositório clonado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Firebase CLI logado (`firebase login`)

### ✅ Regras de Segurança
- [ ] Regras do Firestore implantadas
- [ ] Regras do Storage implantadas
- [ ] Regras testadas e funcionando

### ✅ Teste Final
- [ ] Aplicação iniciada (`pnpm dev`)
- [ ] Página carrega em http://localhost:3000
- [ ] Login funciona
- [ ] Upload de música funciona
- [ ] Player funciona
- [ ] Dashboard carrega dados

---

## 📞 Suporte e Resolução de Problemas

### Logs Úteis
```bash
# Verificar logs do Firebase
firebase functions:log

# Verificar configuração atual
npm run check-firebase-setup

# Verificar status das regras
firebase firestore:rules:list
firebase storage:rules:list
```

### Comandos de Debug
```bash
# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules
pnpm install

# Verificar sintaxe das regras
firebase firestore:rules:list
```

### Recursos de Ajuda
- **Documentação Firebase**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Para problemas específicos do projeto
- **Firebase Support**: https://firebase.google.com/support

---

## 🚀 Próximos Passos

Após a configuração completa:

1. **Testar Funcionalidades**:
   - Criar conta de usuário
   - Fazer upload de música
   - Criar playlist
   - Testar comentários

2. **Personalização**:
   - Ajustar cores no `tailwind.config.ts`
   - Modificar textos em `app/page.tsx`
   - Adicionar próprias músicas de teste

3. **Deploy para Produção**:
   - Configurar Vercel ou Netlify
   - Atualizar regras para modo produção
   - Configurar domínio personalizado

4. **Expandir Funcionalidades**:
   - Sistema de seguidores
   - Recomendações personalizadas
   - Analytics avançado

---

**🎵 Configuração completa! Seu ISPmedia está pronto para uso.**

*Guia criado para garantir uma configuração suave e sem erros*
