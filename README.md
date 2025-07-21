# 🎵 ISPmedia - Plataforma de Streaming Musical

![ISPmedia Banner](https://img.shields.io/badge/ISPmedia-Streaming%20Platform-FDC500?style=for-the-badge&logo=music)

**ISPmedia** é uma plataforma completa de streaming de mídia desenvolvida como projeto escolar, oferecendo uma experiência moderna de consumo musical com funcionalidades sociais integradas.

## 🌟 Características Principais

- 🎧 **Streaming de Música** - Reprodução de alta qualidade
- 🎨 **Interface Moderna** - Design glassmorphism com tema dourado
- 👥 **Funcionalidades Sociais** - Comunidade de artistas e ouvintes
- 📱 **Responsivo** - Funciona perfeitamente em todos os dispositivos
- 🔐 **Autenticação Segura** - Firebase Authentication
- 📊 **Analytics** - Estatísticas para artistas
- ⭐ **Sistema de Avaliações** - Críticas e ratings de música

## 🚀 Início Rápido

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd ispmedia

# Instale as dependências
npm run install:all

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase

# Execute em modo desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` para ver a aplicação rodando.

## 📋 Pré-requisitos

- Node.js 18.0+ 
- npm 8.0+
- Conta Firebase (Auth + Firestore + Storage)
- Editor de código (VS Code recomendado)

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # Next.js API routes
│   │   ├── auth/login/           # Authentication endpoints
│   │   └── health/               # Health check endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main page component
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── auth/                     # Authentication components
│   │   └── LoginForm.tsx
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       ├── Layout.tsx
│       └── index.ts
│
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Firebase authentication context
│
├── hooks/                        # Custom React hooks
│   └── useApi.ts                 # API call hook
│
├── lib/                          # Utility libraries
│   ├── firebase.ts               # Firebase configuration
│   ├── api.ts                    # API client
│   └── utils.ts                  # Utility functions
│
├── server/                       # Express server
│   ├── routes/                   # Express routes
│   │   ├── auth.ts               # Authentication routes
│   │   └── users.ts              # User management routes
│   └── index.ts                  # Express server setup
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Common types
│
└── public/                       # Static assets
```

## Features

- ✅ Next.js 15 with App Router
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Firebase Storage
- ✅ Express.js Custom Backend
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Component-based Architecture
- ✅ Clean Project Structure

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local` and configure your Firebase credentials if needed.

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Run the Express server (optional):**

   ```bash
   npm run server
   ```

5. **Run both Next.js and Express concurrently:**
   ```bash
   npm run dev:full
   ```

## Development

- **Next.js app:** Runs on http://localhost:3000
- **Express server:** Runs on http://localhost:3001
- **Firebase:** Configured and ready to use

## Adding Features

1. **New UI components:** Add to `components/ui/`
2. **Feature components:** Create folders in `components/` (e.g., `components/dashboard/`)
3. **API routes:** Add to `app/api/` for Next.js routes or `server/routes/` for Express
4. **Types:** Add to `types/index.ts`
5. **Utilities:** Add to `lib/utils.ts`

## Architecture

This project follows a clean, scalable architecture:

- **SPA:** Single Page Application using Next.js App Router
- **Authentication:** Firebase Auth with React Context
- **Database:** Firestore for data persistence
- **API:** Both Next.js API routes and Express server available
- **Styling:** Tailwind CSS for utility-first styling
- **Type Safety:** Full TypeScript support throughout

The structure is designed to be intuitive and scalable, allowing for easy addition of new features while maintaining clean separation of concerns.
