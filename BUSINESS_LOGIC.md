# Regras de Negócio - ISPmedia

Este documento descreve as regras de negócio, validações e lógica funcional implementadas na aplicação ISPmedia.

## 🎵 Regras para Upload de Música

### Validações de Arquivo

#### Tipos de Arquivo Aceitos
```typescript
// Tipos MIME permitidos
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',      // .mp3
  'audio/wav',       // .wav
  'audio/ogg',       // .ogg
  'audio/mp4',       // .m4a
  'audio/aac'        // .aac
];
```

#### Limitações de Tamanho
- **Tamanho máximo**: 50MB por arquivo
- **Validação**: Realizada tanto no client quanto no Firebase Storage
- **Feedback**: Progress bar durante upload

#### Estrutura de Armazenamento
```
firebase-storage/
└── tracks/
    └── {userId}/
        └── {timestamp}_{filename}
```

### Validações de Metadados

#### Campos Obrigatórios
```typescript
interface TrackValidation {
  title: string;        // Mínimo 1 caractere, máximo 100
  genre: string;        // Seleção de lista predefinida
  audioFile: File;      // Arquivo válido
  userId: string;       // Usuário autenticado
}
```

#### Sanitização
```typescript
// Título da música
title.trim()                    // Remove espaços extras
  .replace(/[<>]/g, '')        // Remove caracteres perigosos
  .substring(0, 100);          // Limita tamanho

// Nome do arquivo
filename.replace(/[^a-zA-Z0-9.-]/g, '_'); // Caracteres seguros
```

### Fluxo de Upload

#### 1. Validação Client-Side
```typescript
export async function validateUpload(file: File, title: string, genre: string) {
  // Verificar tipo de arquivo
  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    throw new Error('Tipo de arquivo não suportado');
  }
  
  // Verificar tamanho
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo muito grande (máximo 50MB)');
  }
  
  // Verificar campos obrigatórios
  if (!title.trim()) {
    throw new Error('Título é obrigatório');
  }
}
```

#### 2. Upload para Storage
```typescript
export async function uploadTrack(params: UploadTrackParams) {
  // 1. Validações
  // 2. Gerar nome único do arquivo
  // 3. Upload com progress tracking
  // 4. Obter URL de download
  // 5. Salvar metadados no Firestore
  // 6. Atualizar contexto local
}
```

#### 3. Salvamento no Firestore
```typescript
interface TrackDocument {
  id: string;           // Auto-gerado pelo Firestore
  title: string;        // Título da música
  genre: string;        // Gênero musical
  createdBy: string;    // UID do usuário
  createdAt: Timestamp; // Data de criação
  audioUrl: string;     // URL do Firebase Storage
  fileName: string;     // Nome original do arquivo
  fileSize: number;     // Tamanho em bytes
  duration?: number;    // Duração em segundos (opcional)
  mimeType: string;     // Tipo MIME do arquivo
  playCount: number;    // Contador de reproduções (padrão: 0)
}
```

## 📋 Regras para Playlists

### Criação de Playlist

#### Validações
```typescript
interface PlaylistValidation {
  title: string;        // Obrigatório, 1-50 caracteres
  description?: string; // Opcional, máximo 200 caracteres
  visibility: 'public' | 'private'; // Padrão: private
}
```

#### Permissões
- **Criação**: Apenas usuários autenticados
- **Visualização**: 
  - Playlists públicas: Todos usuários autenticados
  - Playlists privadas: Apenas o criador
- **Edição/Exclusão**: Apenas o criador

### Adição de Tracks

#### Regras
```typescript
interface PlaylistTrack {
  trackId: string;      // ID da track
  addedAt: Timestamp;   // Data de adição
  addedBy: string;      // UID do usuário (criador da playlist)
  order: number;        // Ordem na playlist
}
```

#### Validações
- Track deve existir no Firestore
- Usuário deve ter permissão de leitura na track
- Não pode adicionar tracks duplicadas
- Máximo de 500 tracks por playlist

### Estrutura no Firestore

#### Documento Playlist
```typescript
interface PlaylistDocument {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  visibility: 'public' | 'private';
  trackCount: number;     // Contador de tracks
  totalDuration: number;  // Duração total em segundos
  coverImage?: string;    // URL da imagem de capa
}
```

#### Sub-coleção Tracks
```
playlists/{playlistId}/tracks/{trackId}
```

## 🎶 Funcionamento do Player de Áudio

### Estados do Player

#### Interface do Player
```typescript
interface PlayerState {
  currentTrack: Track | null;    // Track atual
  isPlaying: boolean;            // Estado de reprodução
  isPaused: boolean;             // Estado de pausa
  isLoading: boolean;            // Carregando áudio
  currentTime: number;           // Tempo atual (segundos)
  duration: number;              // Duração total (segundos)
  volume: number;                // Volume (0-1)
  isMuted: boolean;              // Estado de mute
  playbackRate: number;          // Velocidade (0.5-2.0)
}
```

### Controles do Player

#### Reprodução
```typescript
// Reproduzir nova track
const playTrack = async (track: Track) => {
  // 1. Pausar track atual (se existir)
  // 2. Definir nova track
  // 3. Carregar áudio
  // 4. Iniciar reprodução
  // 5. Incrementar contador de plays
};

// Pausar/Retomar
const togglePlayPause = () => {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
};
```

#### Navegação
```typescript
// Buscar posição
const seekTo = (time: number) => {
  if (audio) {
    audio.currentTime = time;
  }
};

// Controle de volume
const setVolume = (volume: number) => {
  if (audio) {
    audio.volume = Math.max(0, Math.min(1, volume));
  }
};
```

### Estatísticas de Reprodução

#### Incremento de Play Count
```typescript
// Condições para incrementar
const shouldIncrementPlayCount = (currentTime: number, duration: number) => {
  // Reproduziu pelo menos 30 segundos OU 50% da música
  return currentTime >= 30 || (currentTime / duration) >= 0.5;
};

// Implementação
export async function incrementPlayCount(trackId: string) {
  try {
    await updateDoc(doc(db, 'tracks', trackId), {
      playCount: increment(1)
    });
  } catch (error) {
    // Log error but don't fail the player
    console.warn('Failed to increment play count:', error);
  }
}
```

## 🗃️ Estrutura dos Dados no Firestore

### Coleções Principais

#### Users
```typescript
// Documento: users/{uid}
interface UserDocument {
  uid: string;              // UID do Firebase Auth
  email: string;            // Email do usuário
  name: string;             // Nome de exibição
  createdAt: Timestamp;     // Data de criação
  profilePicture?: string;  // URL da foto de perfil
  bio?: string;             // Biografia
  tracksCount: number;      // Contador de tracks
  playlistsCount: number;   // Contador de playlists
  totalPlays: number;       // Total de reproduções recebidas
}
```

#### Tracks
```typescript
// Documento: tracks/{trackId}
interface TrackDocument {
  id: string;
  title: string;
  genre: string;
  createdBy: string;        // UID do criador
  createdAt: Timestamp;
  audioUrl: string;         // URL do Firebase Storage
  fileName: string;
  fileSize: number;
  duration?: number;
  mimeType: string;
  playCount: number;        // Contador de reproduções
  // Campos de busca
  titleLowercase: string;   // Para busca case-insensitive
  genreLowercase: string;
}
```

#### Playlists
```typescript
// Documento: playlists/{playlistId}
interface PlaylistDocument {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  visibility: 'public' | 'private';
  trackCount: number;
  totalDuration: number;
  coverImage?: string;
  // Sub-coleção: tracks/{trackId}
}
```

### Índices do Firestore

#### Consultas Otimizadas
```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "tracks",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdBy", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "tracks",
      "queryScope": "COLLECTION", 
      "fields": [
        { "fieldPath": "genre", "order": "ASCENDING" },
        { "fieldPath": "playCount", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 📊 Estatísticas e Contadores

### Tracks Mais Ouvidas

#### Query Otimizada
```typescript
export async function getMostPlayedTracks(limit = 10) {
  const q = query(
    collection(db, 'tracks'),
    orderBy('playCount', 'desc'),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
```

### Estatísticas do Usuário

#### Contadores Automáticos
```typescript
// Incrementar contador ao criar track
export async function createTrack(trackData: TrackData) {
  const batch = writeBatch(db);
  
  // Criar track
  const trackRef = doc(collection(db, 'tracks'));
  batch.set(trackRef, trackData);
  
  // Incrementar contador do usuário
  const userRef = doc(db, 'users', trackData.createdBy);
  batch.update(userRef, {
    tracksCount: increment(1)
  });
  
  await batch.commit();
}
```

### Analytics de Uso

#### Métricas Coletadas
- **Tracks**: Total de uploads, reproduções, gêneros populares
- **Usuários**: Usuários ativos, novos registros, retenção
- **Playlists**: Playlists criadas, tracks por playlist

#### Implementação
```typescript
// Event tracking
export function trackEvent(eventName: string, data: any) {
  // Firebase Analytics ou custom analytics
  analytics.logEvent(eventName, data);
}

// Exemplos de eventos
trackEvent('track_uploaded', { genre, fileSize });
trackEvent('track_played', { trackId, duration });
trackEvent('playlist_created', { trackCount });
```

## 🔒 Regras de Segurança

### Firestore Rules

#### Validação de Dados
```javascript
// Validar criação de track
match /tracks/{trackId} {
  allow create: if request.auth != null 
    && request.auth.uid == request.resource.data.createdBy
    && isValidTrackData(request.resource.data);
}

function isValidTrackData(data) {
  return data.keys().hasAll(['title', 'genre', 'audioUrl'])
    && data.title is string
    && data.title.size() > 0
    && data.title.size() <= 100
    && data.genre is string
    && data.audioUrl is string;
}
```

### Storage Rules

#### Controle de Upload
```javascript
match /tracks/{userId}/{fileName} {
  allow write: if request.auth != null 
    && request.auth.uid == userId
    && request.resource.size < 50 * 1024 * 1024  // 50MB
    && request.resource.contentType.matches('audio/.*');
}
```

## 🚀 Performance e Otimização

### Cache Strategies
- **Tracks**: Cache local com TTL
- **Playlists**: Cache otimista com sync
- **User Data**: Persist no localStorage

### Lazy Loading
- **Audio**: Preload apenas quando necessário
- **Images**: Lazy loading com intersection observer
- **Components**: Dynamic imports para modals

### Database Optimization
- **Pagination**: Cursor-based para listas grandes
- **Denormalization**: Contadores duplicados para performance
- **Batch Operations**: Operações múltiplas em uma transação
