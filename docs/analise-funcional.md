# ISPmedia - Análise Funcional e Lógica

## 📋 1. Resumo do Escopo do Sistema

O **ISPmedia** é uma plataforma de streaming de mídia desenvolvida como projeto escolar, que oferece uma experiência completa de consumo musical com funcionalidades sociais integradas. A aplicação combina streaming de música, descoberta de artistas, criação de playlists personalizadas e um sistema de críticas e avaliações.

### Características Principais:

- **Plataforma Web Responsiva**: Interface moderna com glassmorphism e navegação fluida
- **Streaming de Música**: Reprodução de faixas com controles avançados
- **Sistema Social**: Interações entre usuários, artistas e críticos
- **Gestão de Conteúdo**: Upload e organização de músicas por artistas
- **Descoberta Musical**: Algoritmos de recomendação e exploração

---

## 🎯 2. Funcionalidades do Sistema

### 2.1 Funcionalidades Obrigatórias

#### **Autenticação e Usuários**

- ✅ Cadastro de usuários (comum, artista, administrador)
- ✅ Login/logout com Firebase Authentication
- ✅ Perfis de usuário personalizáveis
- ✅ Gerenciamento de sessão

#### **Gestão Musical**

- ✅ Catálogo de músicas organizadas por álbuns
- ✅ Páginas dedicadas de artistas
- ✅ Sistema de busca (música, artista, álbum)
- ✅ Player de música com controles básicos (play/pause/próxima/anterior)

#### **Playlists**

- ✅ Criação de playlists personalizadas
- ✅ Adição/remoção de músicas em playlists
- ✅ Playlists públicas e privadas
- ✅ Compartilhamento de playlists

#### **Sistema de Avaliações**

- ✅ Avaliação de músicas (1-5 estrelas)
- ✅ Críticas textuais de álbuns
- ✅ Visualização de médias de avaliações

### 2.2 Funcionalidades Opcionais

#### **Recursos Sociais Avançados**

- 🔄 Sistema de seguir artistas
- 🔄 Feed de atividades dos artistas seguidos
- 🔄 Comentários em críticas
- 🔄 Sistema de curtidas em playlists

#### **Recursos Premium**

- 🔄 Reprodução offline (simulada)
- 🔄 Qualidade de áudio superior
- 🔄 Pular propagandas

#### **Algoritmos e Recomendações**

- 🔄 Sistema de recomendação baseado em histórico
- 🔄 Playlists automáticas "Para Você"
- 🔄 Descoberta semanal

---

## 👥 3. Tipos de Usuários e Permissões

### 3.1 Usuário Comum

**Descrição**: Consumidor final da plataforma
**Permissões**:

- Escutar músicas do catálogo
- Criar e gerenciar playlists pessoais
- Avaliar músicas e álbuns
- Escrever críticas
- Visualizar perfis de artistas
- Buscar conteúdo

### 3.2 Artista

**Descrição**: Criador de conteúdo musical
**Permissões** (herda de Usuário Comum):

- Upload de músicas e álbuns
- Gerenciar perfil de artista
- Visualizar estatísticas de reprodução
- Responder a críticas
- Organizar discografia

### 3.3 Administrador

**Descrição**: Gestor da plataforma
**Permissões** (herda de Artista):

- Moderar conteúdo (músicas, críticas, comentários)
- Gerenciar usuários (banir, promover)
- Visualizar analytics da plataforma
- Configurar sistema
- Aprovar uploads de artistas

---

## 📝 4. Principais Regras de Negócio

### 4.1 Autenticação e Segurança

- Usuários devem estar autenticados para acessar funcionalidades principais
- Senhas devem ter no mínimo 8 caracteres
- Sessões expiram após 30 dias de inatividade

### 4.2 Conteúdo Musical

- Apenas artistas verificados podem fazer upload de conteúdo
- Músicas devem ter metadados obrigatórios (título, artista, álbum)
- Formatos aceitos: MP3, AAC (simulado com URLs/IDs)
- Cada álbum deve ter no mínimo 1 música

### 4.3 Playlists

- Usuários podem criar até 50 playlists
- Playlists podem ter até 500 músicas
- Nome da playlist deve ser único por usuário
- Playlists vazias são excluídas automaticamente após 30 dias

### 4.4 Avaliações e Críticas

- Usuários podem avaliar cada música apenas uma vez
- Críticas devem ter no mínimo 50 caracteres
- Avaliações variam de 1 a 5 estrelas
- Artistas não podem avaliar suas próprias músicas

### 4.5 Sistema Social

- Usuários podem seguir até 1000 artistas
- Comentários ofensivos são moderados automaticamente
- Denúncias são revisadas por administradores

---

## 📚 5. Casos de Uso Principais

### 5.1 UC001 - Cadastro de Usuário

**Ator**: Visitante
**Descrição**: Novo usuário se cadastra na plataforma
**Fluxo Principal**:

1. Usuário acessa página de cadastro
2. Preenche formulário (nome, email, senha, tipo de usuário)
3. Sistema valida dados
4. Firebase cria conta
5. Usuário é redirecionado para dashboard

**Fluxos Alternativos**:

- Email já existe: exibe erro e sugere login
- Dados inválidos: destaca campos com erro

### 5.2 UC002 - Upload de Música (Artista)

**Ator**: Artista
**Descrição**: Artista adiciona nova música ao catálogo
**Fluxo Principal**:

1. Artista acessa painel de upload
2. Seleciona arquivo de áudio
3. Preenche metadados (título, álbum, gênero, duração)
4. Sistema valida formato e tamanho
5. Upload é processado e música fica disponível

### 5.3 UC003 - Criação de Playlist

**Ator**: Usuário Comum/Artista
**Descrição**: Usuário cria nova playlist personalizada
**Fluxo Principal**:

1. Usuário acessa seção "Minhas Playlists"
2. Clica em "Nova Playlist"
3. Define nome, descrição e privacidade
4. Adiciona músicas via busca ou navegação
5. Salva playlist

### 5.4 UC004 - Reprodução de Música

**Ator**: Usuário Comum/Artista
**Descrição**: Usuário escuta uma música
**Fluxo Principal**:

1. Usuário seleciona música (busca, playlist, álbum)
2. Player carrega e inicia reprodução
3. Sistema registra reprodução para estatísticas
4. Controles permitem pausar/pular/voltar

### 5.5 UC005 - Avaliação de Música

**Ator**: Usuário Comum
**Descrição**: Usuário avalia uma música
**Fluxo Principal**:

1. Durante ou após reprodução, usuário clica em estrelas
2. Seleciona nota de 1 a 5
3. Opcionalmente adiciona comentário
4. Sistema salva avaliação e atualiza média

---

## 🗄️ 6. Modelo de Dados (Firestore)

### 6.1 Estrutura de Coleções

#### **users** (Coleção Principal)

```
/users/{userId}
{
  uid: string
  email: string
  displayName: string
  userType: 'user' | 'artist' | 'admin'
  profileImage?: string
  bio?: string
  createdAt: timestamp
  lastLogin: timestamp
  isVerified: boolean (para artistas)
  followersCount?: number (para artistas)

  // Subcoleções
  playlists: subcollection
  ratings: subcollection
  following: subcollection (para usuários que seguem artistas)
}
```

#### **artists** (Coleção Principal)

```
/artists/{artistId}
{
  userId: string (referência ao user)
  name: string
  bio: string
  profileImage: string
  coverImage: string
  genre: string[]
  totalPlays: number
  monthlyListeners: number
  isVerified: boolean
  createdAt: timestamp

  // Subcoleções
  albums: subcollection
  tracks: subcollection
}
```

#### **albums** (Coleção Principal)

```
/albums/{albumId}
{
  title: string
  artistId: string
  artistName: string
  coverImage: string
  releaseDate: timestamp
  genre: string
  totalTracks: number
  duration: number (em segundos)
  averageRating: number
  totalRatings: number

  // Subcoleções
  tracks: subcollection
  reviews: subcollection
}
```

#### **tracks** (Coleção Principal)

```
/tracks/{trackId}
{
  title: string
  artistId: string
  artistName: string
  albumId: string
  albumName: string
  duration: number
  trackNumber: number
  audioUrl: string (Firebase Storage ou URL externa)
  genre: string
  playCount: number
  averageRating: number
  totalRatings: number
  createdAt: timestamp
  isExplicit: boolean
}
```

#### **playlists** (Subcoleção de users)

```
/users/{userId}/playlists/{playlistId}
{
  name: string
  description: string
  isPublic: boolean
  coverImage?: string
  trackIds: string[]
  totalTracks: number
  totalDuration: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### **ratings** (Subcoleção de users)

```
/users/{userId}/ratings/{trackId}
{
  trackId: string
  rating: number (1-5)
  comment?: string
  createdAt: timestamp
}
```

#### **reviews** (Subcoleção de albums)

```
/albums/{albumId}/reviews/{reviewId}
{
  userId: string
  userName: string
  userImage?: string
  rating: number (1-5)
  title: string
  content: string
  likes: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 6.2 Índices Necessários

- `tracks`: `{artistId: asc, createdAt: desc}`
- `tracks`: `{genre: asc, averageRating: desc}`
- `albums`: `{artistId: asc, releaseDate: desc}`
- `reviews`: `{albumId: asc, createdAt: desc}`

---

## 🏗️ 7. Diagrama de Classes (Descrição)

### 7.1 Classes Principais

#### **User**

```typescript
class User {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  profileImage?: string;
  bio?: string;
  createdAt: Date;

  // Métodos
  createPlaylist(name: string, isPublic: boolean): Playlist;
  rateTrack(trackId: string, rating: number): Rating;
  followArtist(artistId: string): void;
}
```

#### **Artist** (extends User)

```typescript
class Artist extends User {
  isVerified: boolean;
  followersCount: number;
  totalPlays: number;
  monthlyListeners: number;

  // Métodos
  uploadTrack(trackData: TrackData): Track;
  createAlbum(albumData: AlbumData): Album;
  getStatistics(): ArtistStats;
}
```

#### **Track**

```typescript
class Track {
  id: string;
  title: string;
  artistId: string;
  albumId: string;
  duration: number;
  audioUrl: string;
  playCount: number;
  averageRating: number;

  // Métodos
  play(): void;
  addToPlaylist(playlistId: string): void;
  rate(userId: string, rating: number): void;
}
```

#### **Playlist**

```typescript
class Playlist {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  trackIds: string[];
  isPublic: boolean;

  // Métodos
  addTrack(trackId: string): void;
  removeTrack(trackId: string): void;
  reorderTracks(newOrder: string[]): void;
  share(): string;
}
```

#### **Album**

```typescript
class Album {
  id: string;
  title: string;
  artistId: string;
  coverImage: string;
  releaseDate: Date;
  tracks: Track[];

  // Métodos
  addTrack(track: Track): void;
  getTotalDuration(): number;
  getAverageRating(): number;
}
```

### 7.2 Classes de Serviço

#### **AudioService**

```typescript
class AudioService {
  currentTrack?: Track;
  isPlaying: boolean;
  currentTime: number;

  // Métodos
  play(track: Track): void;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  next(): void;
  previous(): void;
}
```

#### **RecommendationService**

```typescript
class RecommendationService {
  // Métodos
  getRecommendationsForUser(userId: string): Track[];
  getSimilarTracks(trackId: string): Track[];
  getTrendingTracks(): Track[];
}
```

---

## 🎨 8. Proposta de Identidade Visual

### 8.1 Paleta de Cores

#### **Cor Principal**

- **Primária**: `#FDC500` (Dourado vibrante)
- **Primária Suave**: `rgba(253, 197, 0, 0.1)` (Para backgrounds)
- **Primária Hover**: `#E6B200`

#### **Cores Secundárias**

- **Escuro**: `#1A1A1A` (Background principal)
- **Escuro Médio**: `#2A2A2A` (Cards e containers)
- **Escuro Claro**: `#3A3A3A` (Hover states)
- **Texto Primário**: `#FFFFFF`
- **Texto Secundário**: `#B3B3B3`
- **Texto Terciário**: `#808080`

#### **Cores de Status**

- **Sucesso**: `#22C55E`
- **Erro**: `#EF4444`
- **Aviso**: `#F59E0B`
- **Info**: `#3B82F6`

### 8.2 Glassmorphism Design

#### **Elementos com Glassmorphism**

```css
.glass-card {
  background: rgba(42, 42, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(253, 197, 0, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-navigation {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(253, 197, 0, 0.1);
}

.glass-modal {
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(253, 197, 0, 0.2);
}
```

### 8.3 Componentes de Interface

#### **Player de Música**

- Design minimalista com controles glassmorphism
- Barra de progresso com cor primária
- Botões com hover suave e feedback visual
- Visualizador de onda sonora opcional

#### **Cards de Álbum/Artista**

- Imagem com overlay gradiente
- Texto com sombra para legibilidade
- Hover com elevação e glow dourado
- Transições suaves (300ms)

#### **Modais**

- Entrada com slide-up animation
- Background blur intenso
- Fechamento com ESC ou clique fora
- Formulários com validation em tempo real

### 8.4 Animações e Transições

#### **Micro-interações**

- Hover states com escala (1.05x)
- Loading spinners com rotação suave
- Botões com ripple effect
- Transições de página com fade

#### **Navegação**

- Slide transitions entre seções
- Sticky player na parte inferior
- Menu lateral com slide-in
- Breadcrumbs animados

---

## 📁 9. Estrutura de Pastas do Projeto

### 9.1 Estrutura Atual Otimizada

```
ispmedia/
├── 📁 app/                          # Next.js App Router
│   ├── 📄 layout.tsx               # Layout principal
│   ├── 📄 page.tsx                 # Homepage
│   ├── 📄 globals.css              # Estilos globais
│   ├── 📁 auth/                    # Páginas de autenticação
│   │   ├── 📄 login/page.tsx
│   │   └── 📄 register/page.tsx
│   ├── 📁 dashboard/               # Dashboard do usuário
│   │   └── 📄 page.tsx
│   ├── 📁 artist/                  # Perfis de artistas
│   │   └── 📄 [id]/page.tsx
│   ├── 📁 album/                   # Páginas de álbuns
│   │   └── 📄 [id]/page.tsx
│   ├── 📁 playlist/                # Gestão de playlists
│   │   ├── 📄 page.tsx
│   │   └── 📄 [id]/page.tsx
│   ├── 📁 search/                  # Busca e exploração
│   │   └── 📄 page.tsx
│   ├── 📁 upload/                  # Upload de conteúdo (artistas)
│   │   └── 📄 page.tsx
│   ├── 📁 admin/                   # Painel administrativo
│   │   └── 📄 page.tsx
│   ├── 📁 diagrams/                # **Página de diagramas futura**
│   │   └── 📄 page.tsx
│   └── 📁 api/                     # API Routes
│       ├── 📁 auth/
│       ├── 📁 tracks/
│       ├── 📁 playlists/
│       └── 📁 upload/
│
├── 📁 components/                   # Componentes reutilizáveis
│   ├── 📁 ui/                      # Componentes base
│   │   ├── 📄 Button.tsx
│   │   ├── 📄 Card.tsx
│   │   ├── 📄 Input.tsx
│   │   ├── 📄 Modal.tsx
│   │   └── 📄 LoadingSpinner.tsx
│   ├── 📁 audio/                   # Componentes de áudio
│   │   ├── 📄 AudioPlayer.tsx
│   │   ├── 📄 TrackList.tsx
│   │   └── 📄 VolumeControl.tsx
│   ├── 📁 layout/                  # Layout components
│   │   ├── 📄 Header.tsx
│   │   ├── 📄 Sidebar.tsx
│   │   └── 📄 Footer.tsx
│   ├── 📁 auth/                    # Componentes de auth
│   │   ├── 📄 LoginForm.tsx
│   │   └── 📄 RegisterForm.tsx
│   └── 📁 content/                 # Componentes de conteúdo
│       ├── 📄 AlbumCard.tsx
│       ├── 📄 ArtistCard.tsx
│       ├── 📄 PlaylistCard.tsx
│       └── 📄 TrackItem.tsx
│
├── 📁 contexts/                     # React Contexts
│   ├── 📄 AuthContext.tsx
│   ├── 📄 AudioContext.tsx
│   └── 📄 ThemeContext.tsx
│
├── 📁 hooks/                       # Custom Hooks
│   ├── 📄 useAuth.ts
│   ├── 📄 useAudio.ts
│   ├── 📄 useFirestore.ts
│   └── 📄 useLocalStorage.ts
│
├── 📁 lib/                         # Bibliotecas e utilitários
│   ├── 📄 firebase.ts              # Configuração Firebase
│   ├── 📄 api.ts                   # Cliente API
│   ├── 📄 utils.ts                 # Funções utilitárias
│   └── 📄 validation.ts            # Schemas de validação
│
├── 📁 types/                       # Tipos TypeScript
│   ├── 📄 index.ts                 # Tipos principais
│   ├── 📄 auth.ts                  # Tipos de autenticação
│   ├── 📄 music.ts                 # Tipos musicais
│   └── 📄 api.ts                   # Tipos de API
│
├── 📁 stores/                      # Estado global (Zustand)
│   ├── 📄 authStore.ts
│   ├── 📄 audioStore.ts
│   └── 📄 uiStore.ts
│
├── 📁 backend/                     # Backend Express (opcional)
│   ├── 📄 package.json
│   └── 📁 src/
│       ├── 📁 routes/
│       ├── 📁 middleware/
│       ├── 📁 config/
│       └── 📁 types/
│
├── 📁 docs/                        # Documentação
│   ├── 📄 analise-funcional.md     # **Este documento**
│   ├── 📄 Ispmedia Planejamento.pdf
│   └── 📄 api-documentation.md
│
├── 📁 public/                      # Arquivos estáticos
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📁 audio-samples/
│
├── 📄 package.json                 # Dependências do projeto
├── 📄 next.config.ts               # Configuração Next.js
├── 📄 tailwind.config.ts           # Configuração Tailwind
├── 📄 tsconfig.json                # Configuração TypeScript
└── 📄 README.md                    # Documentação do projeto
```

### 9.2 Dependências Principais

#### **Frontend**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "firebase": "^10.0.0",
    "zustand": "^4.0.0",
    "framer-motion": "^10.0.0",
    "react-hot-toast": "^2.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

#### **Backend (Opcional)**

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.0",
    "helmet": "^7.0.0",
    "firebase-admin": "^11.0.0",
    "multer": "^1.4.0"
  }
}
```

---

## 🚀 10. Próximos Passos

### 10.1 Implementação Faseada

#### **Fase 1 - Fundação** (Semanas 1-2)

- [ ] Configuração do projeto Next.js + TypeScript
- [ ] Setup Firebase (Auth + Firestore)
- [ ] Sistema de autenticação básico
- [ ] Layout principal com navigation

#### **Fase 2 - Core Features** (Semanas 3-4)

- [ ] Player de música básico
- [ ] Catálogo de músicas e artistas
- [ ] Sistema de busca
- [ ] Criação de playlists

#### **Fase 3 - Features Sociais** (Semanas 5-6)

- [ ] Sistema de avaliações
- [ ] Críticas de álbuns
- [ ] Perfis de usuário
- [ ] Sistema de seguir artistas

#### **Fase 4 - Polish & Diagramas** (Semana 7)

- [ ] Implementação da página `/app/diagrams/page.tsx`
- [ ] Geração de diagramas visuais
- [ ] Refinamento da UI/UX
- [ ] Testes e otimizações

### 10.2 Página de Diagramas Futura

A página `/app/diagrams/page.tsx` será implementada no final do projeto e incluirá:

- **Diagrama de Casos de Uso** (interativo)
- **Diagrama de Classes UML**
- **Diagrama Entidade-Relacionamento**
- **Fluxograma de Navegação**
- **Arquitetura do Sistema**

Utilizando bibliotecas como `react-flow`, `mermaid` ou `d3.js` para visualizações interativas.

---

## 📞 Considerações Finais

Esta análise funcional fornece a base sólida para o desenvolvimento da aplicação ISPmedia. O documento serve como guia para implementação, garantindo que todos os requisitos sejam atendidos de forma organizada e eficiente.

A estrutura modular proposta permite desenvolvimento incremental, facilitando a manutenção e expansão futuras do sistema.

**Data de Criação**: 22 de Julho de 2025  
**Versão**: 1.0  
**Autor**: Projeto Escolar ISPmedia
