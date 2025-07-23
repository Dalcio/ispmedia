# 🎵 ISPmedia Audio Player

Um player de áudio moderno e responsivo desenvolvido para o ISPmedia, com interface glassmorphism e preparado para integração com Firebase Storage.

## 📋 Funcionalidades

### ✅ Implementadas

- **Controles Básicos**: Play, Pause, Stop
- **Navegação**: Seek por clique na barra de progresso
- **Volume**: Controle de volume com slider interativo
- **Playlist**: Navegação entre múltiplas faixas
- **Modos Avançados**: Repeat e Shuffle
- **Interface Responsiva**: Adaptação automática para mobile/desktop
- **Glassmorphism**: Efeito visual moderno com backdrop-blur
- **Animações**: Transições suaves e feedback visual
- **Dark Mode**: Suporte completo ao tema escuro
- **Acessibilidade**: Tooltips e indicadores visuais

### 🚀 Preparado para Firebase

- Estrutura pronta para URLs do Firebase Storage
- Interface para metadados de áudio
- Sistema de loading e error handling

## 🎯 Uso Básico

### Componente Principal

```tsx
import { AudioPlayer } from '@/components/player';

// Uso simples
<AudioPlayer />

// Com track específico
<AudioPlayer 
  track={{
    id: 'track-1',
    title: 'Minha Música',
    artist: 'Artista',
    duration: 240,
    url: 'https://exemplo.com/audio.mp3'
  }}
/>

// Com playlist
<AudioPlayer 
  playlist={[
    {
      id: 'track-1',
      title: 'Música 1',
      artist: 'Artista 1',
      duration: 240,
      url: 'https://exemplo.com/audio1.mp3'
    },
    {
      id: 'track-2',
      title: 'Música 2',
      artist: 'Artista 2',
      duration: 180,
      url: 'https://exemplo.com/audio2.mp3'
    }
  ]}
  autoPlay={true}
/>
```

### Hook Personalizado

```tsx
import { useAudioPlayer } from '@/hooks/use-audio-player';

function MeuComponente() {
  const {
    isPlaying,
    currentTrack,
    play,
    pause,
    nextTrack,
    setVolume
  } = useAudioPlayer(minhaPlaylist);

  return (
    <div>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pausar' : 'Tocar'}
      </button>
      <button onClick={nextTrack}>Próxima</button>
    </div>
  );
}
```

## 🔧 Interface AudioTrack

```typescript
interface AudioTrack {
  id: string;           // ID único do track
  title: string;        // Título da música
  artist: string;       // Nome do artista
  album?: string;       // Nome do álbum (opcional)
  duration: number;     // Duração em segundos
  url: string;          // URL do arquivo de áudio
  coverArt?: string;    // URL da capa (opcional)
}
```

## 🎨 Props do AudioPlayer

```typescript
interface AudioPlayerProps {
  track?: AudioTrack;     // Track específico para tocar
  playlist?: AudioTrack[]; // Lista de tracks
  autoPlay?: boolean;     // Auto-reproduzir ao carregar
  showPlaylist?: boolean; // Mostrar lista visual (futuro)
  className?: string;     // Classes CSS adicionais
}
```

## 🎮 Funcionalidades do Hook

### Estados Disponíveis
- `isPlaying`: boolean - Status de reprodução
- `currentTime`: number - Tempo atual em segundos
- `duration`: number - Duração total em segundos
- `volume`: number - Volume atual (0-1)
- `isMuted`: boolean - Status do mute
- `isRepeat`: boolean - Status do repeat
- `isShuffle`: boolean - Status do shuffle
- `isLoading`: boolean - Status de carregamento
- `error`: string | null - Mensagem de erro
- `currentTrack`: AudioTrack | null - Track atual
- `playlist`: AudioTrack[] - Playlist atual
- `currentTrackIndex`: number - Índice do track atual

### Funções de Controle
- `play()`: Reproduzir áudio
- `pause()`: Pausar áudio
- `stop()`: Parar áudio
- `seek(time: number)`: Ir para tempo específico
- `togglePlayPause()`: Alternar play/pause
- `nextTrack()`: Próximo track
- `previousTrack()`: Track anterior
- `setVolume(volume: number)`: Definir volume
- `toggleMute()`: Alternar mute
- `toggleRepeat()`: Alternar repeat
- `toggleShuffle()`: Alternar shuffle
- `loadPlaylist(tracks: AudioTrack[])`: Carregar nova playlist
- `loadTrack(track: AudioTrack)`: Carregar track específico

### Funções Utilitárias
- `formatTime(time: number)`: Formatar tempo para MM:SS
- `getProgressPercentage()`: Obter percentual de progresso

## 📱 Responsividade

O player adapta-se automaticamente:
- **Desktop**: Controles completos com volume visível
- **Mobile**: Controles otimizados, volume oculto para economizar espaço
- **Tablet**: Layout intermediário

## 🎨 Customização Visual

### Classes CSS Disponíveis
```css
.audio-player { /* Container principal */ }
.slider { /* Slider de volume */ }
```

### Glassmorphism Effect
- Backdrop blur automático
- Transparência adaptativa ao tema
- Bordas suaves e sombras

## 🔮 Integração Firebase (Futuro)

Para integrar com Firebase Storage:

1. **Substitua URLs mockadas**:
```tsx
// Antes (mock)
url: 'https://exemplo.com/audio.mp3'

// Depois (Firebase)
url: await getDownloadURL(ref(storage, 'audio/track1.mp3'))
```

2. **Adicione metadados**:
```tsx
const track = {
  id: doc.id,
  title: doc.data().title,
  artist: doc.data().artist,
  duration: doc.data().duration,
  url: await getDownloadURL(storageRef),
  coverArt: doc.data().coverArt ? await getDownloadURL(coverRef) : undefined
};
```

## 📦 Arquivos do Sistema

```
components/player/
├── audio-player.tsx       # Componente principal
├── audio-player-demo.tsx  # Demo com exemplos
└── index.ts              # Exports

hooks/
└── use-audio-player.ts   # Hook personalizado
```

## 🔊 URLs de Áudio Mock

Atualmente usando áudios públicos para desenvolvimento:
- `https://www.soundjay.com/misc/sounds/magic-chime-02.mp3`
- `https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3`

**Nota**: Substitua por URLs do Firebase em produção.

## 🧪 Testando

Acesse `/test` para ver o player em ação com a demo completa.

## 🛠️ Desenvolvimento

Para adicionar novas funcionalidades:

1. **Estados**: Adicione no hook `useAudioPlayer`
2. **Controles**: Implemente funções no hook
3. **UI**: Atualize o componente `AudioPlayer`
4. **Tipos**: Mantenha interfaces atualizadas

---

**Desenvolvido para ISPmedia** 🎵
