// Player Components Exports
export { default as AudioPlayer } from './audio-player';
export { default as AudioPlayerDemo } from './audio-player-demo';

// Hook exports
export { useAudioPlayer } from '@/hooks/use-audio-player';

// Types
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverArt?: string;
}

export interface AudioPlayerProps {
  track?: AudioTrack;
  playlist?: AudioTrack[];
  autoPlay?: boolean;
  showPlaylist?: boolean;
  className?: string;
}
