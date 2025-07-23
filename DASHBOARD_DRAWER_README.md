# Dashboard Lateral (Drawer) - ISPmedia

Este documento explica a implementação do dashboard lateral (drawer) do ISPmedia, que substitui a página de dashboard por um painel lateral acessível de qualquer lugar da aplicação.

## 🎯 Funcionalidades Implementadas

### 1. Drawer Principal

- **Componente**: `components/drawers/user-dashboard-drawer.tsx`
- **Largura**: 480px máximo
- **Estilo**: Glassmorphism com blur e transparência
- **Posição**: Slide-in da direita da tela
- **Overlay**: Fundo escuro com blur
- **Fechamento**: Clique fora, tecla ESC, ou botão X

### 2. Métodos de Abertura

✅ **Atalho de Teclado**: Tecla `D` (configurado globalmente)
✅ **Botão de Avatar**: No header com dropdown
✅ **Botão Dashboard**: No header (quando logado)
✅ **URL /dashboard**: Redireciona para home e abre o drawer

### 3. Seções do Drawer

#### Header

- Saudação personalizada com nome do usuário
- Botão de fechar (X)

#### Navegação por Abas

- **Minhas Músicas** (tracks)
- **Minhas Playlists** (playlists)
- **Perfil** (profile) - Em desenvolvimento
- **Configurações** (settings) - Em desenvolvimento

#### Ações Rápidas

- **Botão Upload**: Abre o modal de upload de música
- Integrado com atalho `U` global

#### Rodapé

- **Botão Sair**: Logout com confirmação

### 4. Componentes Modulares

#### UserTrackList.tsx

- Lista músicas do usuário atual
- Funcionalidades:
  - ▶️ Reproduzir música
  - ✏️ Editar detalhes
  - ❌ Remover do Firebase
  - 📊 Estatísticas (visualizações, data)
- Integração completa com Firestore
- Loading states e empty states

#### UserPlaylistList.tsx

- Lista playlists do usuário atual
- Funcionalidades:
  - ➕ Criar nova playlist
  - ✏️ Editar playlist existente
  - ❌ Remover playlist
  - 👁️ Alternar visibilidade (pública/privada)
- Contadores de músicas e duração
- Modais de edição integrados

### 5. Sistema de Estado Global

#### Hook: `use-dashboard-drawer.ts`

```typescript
const { isOpen, activeSection, openDrawer, closeDrawer, setActiveSection } =
  useDashboardDrawer();
```

- **Zustand** para gerenciamento de estado
- Seções ativas configuráveis
- Abertura com seção específica opcional

### 6. Atalhos de Teclado Globais

#### Configurados em: `hooks/use-keyboard-shortcuts.ts`

- `D` - Abre/fecha o drawer do dashboard
- `U` - Abre modal de upload de música
- `ESC` - Fecha drawer (quando aberto)

### 7. Header Global e Avatar

#### Componente: `components/layout/header.tsx`

- Logo ISPmedia
- Botões de ação rápida (Upload, Dashboard)
- Avatar dropdown com informações do usuário

#### Componente: `components/layout/user-avatar-button.tsx`

- Avatar com iniciais ou foto do usuário
- Dropdown com:
  - Informações da conta
  - Link para dashboard
  - Botão de logout

### 8. Integração com Firebase

#### Firestore Collections:

- **tracks**: Músicas do usuário
  - Filtro: `createdBy == user.uid`
  - Ordenação: `createdAt desc`
- **playlists**: Playlists do usuário
  - Filtro: `userId == user.uid`
  - Ordenação: `updatedAt desc`

#### Funcionalidades CRUD:

- ✅ Create: Upload de músicas via modal
- ✅ Read: Listagem em tempo real (onSnapshot)
- ✅ Update: Edição de metadados
- ✅ Delete: Remoção com confirmação

## 🎨 Design System

### Glassmorphism

- Background: `bg-white/95 dark:bg-neutral-900/95`
- Backdrop: `backdrop-blur-xl`
- Borders: `border-neutral-200 dark:border-neutral-700`
- Shadows: `shadow-2xl`

### Animações

- Transição de entrada: `transform transition-transform duration-300 ease-out`
- Hover effects: `hover:scale-105 transition-all`
- Loading states: `animate-pulse`

### Responsividade

- Largura máxima: `max-w-md` (28rem / 448px)
- Scroll interno: `overflow-y-auto`
- Mobile-friendly: Ocupa largura total em telas pequenas

## 🔧 Como Usar

### 1. Abrir o Drawer

```typescript
const { openDrawer } = useDashboardDrawer();

// Abrir na seção padrão (tracks)
openDrawer();

// Abrir em seção específica
openDrawer("playlists");
```

### 2. Navegação entre Seções

```typescript
const { setActiveSection } = useDashboardDrawer();
setActiveSection("profile");
```

### 3. Atalhos de Teclado

- Usuário pressiona `D` → Drawer abre/fecha automaticamente
- Usuário pressiona `U` → Modal de upload abre
- Dentro do drawer, `ESC` → Fecha o drawer

### 4. Autenticação

- Drawer só aparece se usuário estiver logado
- Conteúdo carrega automaticamente baseado no `user.uid`
- Logout fecha o drawer automaticamente

## 🚀 Próximos Passos

### Seções Futuras:

1. **Perfil do Usuário**

   - Edição de informações pessoais
   - Upload de avatar
   - Estatísticas detalhadas

2. **Configurações**

   - Preferências de privacidade
   - Configurações de notificação
   - Temas e aparência

3. **Estatísticas**
   - Gráficos de reprodução
   - Análise de engajamento
   - Dados de crescimento

### Melhorias Técnicas:

- [ ] Cache de dados para melhor performance
- [ ] Pagination nas listas longas
- [ ] Search/filtros dentro das seções
- [ ] Drag & drop para reorganização
- [ ] Keyboard navigation completa

## 📁 Estrutura de Arquivos

```
components/
├── drawers/
│   ├── user-dashboard-drawer.tsx      # Drawer principal
│   ├── UserTrackList.tsx              # Lista de músicas
│   └── UserPlaylistList.tsx           # Lista de playlists
├── layout/
│   ├── header.tsx                     # Header global
│   ├── user-avatar-button.tsx         # Botão de avatar
│   └── global-keyboard-shortcuts.tsx  # Atalhos globais
└── modals/
    └── upload-music-modal.tsx         # Modal de upload

hooks/
├── use-dashboard-drawer.ts            # Estado do drawer
└── use-keyboard-shortcuts.ts          # Sistema de atalhos

app/
├── layout.tsx                         # Layout com componentes globais
├── page.tsx                          # Home page atualizada
└── dashboard/page.tsx                # Redirecionamento para drawer
```

Este sistema de dashboard lateral oferece uma experiência moderna e acessível, mantendo o usuário sempre conectado às suas funcionalidades principais independentemente da página em que estiver navegando.
