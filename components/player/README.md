# 🎵 ISPmedia Audio Player

## Modern Audio Player Component

O player de áudio da ISPmedia foi completamente redesenhado para oferecer uma experiência moderna, responsiva e visualmente atraente.

### ✨ Características Principais

#### 🎨 Design Visual
- **Glassmorphism suave** com blur backdrop e gradientes
- **Cor primária** `#FDC500` aplicada consistentemente  
- **Visualizador de áudio** com barras animadas
- **Gradientes premium** em botões e elementos
- **Animações suaves** em todos os controles

#### 🎛️ Funcionalidades

##### Player Compacto (Mini Mode)
- Exibição clara do nome da música e artista
- Barra de progresso interativa no topo
- Controles principais sempre visíveis:
  - ▶️ Play/Pause com efeito glow quando tocando
  - ⏮️ ⏭️ Pular faixas (desktop)
  - 🔊 Controle de volume com slider (desktop)
  - 🔼 Expandir para modo completo

##### Player Expandido (Full Mode)
- **Album art** grande com placeholder animado
- **Botão de curtir** (coração) interativo
- **Controles completos**:
  - 🔀 Shuffle
  - ⏮️ Anterior
  - ▶️ Play/Pause (extra grande)
  - ⏭️ Próximo
  - 🔁 Repetir
- **Barra de progresso** com thumb interativo
- **Controle de volume** completo com indicador percentual
- **Informações detalhadas** da faixa

#### ⌨️ Atalhos do Teclado
- **Espaço**: Play/Pause
- **Seta ←**: Retroceder 10 segundos
- **Seta →**: Avançar 10 segundos

#### 📱 Responsividade
- **Mobile-first design**
- **Controles adaptativos** por tamanho de tela
- **Safe area** respeitada em dispositivos móveis
- **Touch-friendly** para dispositivos móveis
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
