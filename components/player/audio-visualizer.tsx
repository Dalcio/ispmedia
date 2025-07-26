'use client';

import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function AudioVisualizer({ 
  isPlaying, 
  className = '', 
  size = 'small' 
}: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>([40, 60, 80, 50, 70]);

  useEffect(() => {
    const generateBars = () => {
      if (isPlaying) {
        const newBars = Array.from({ length: 5 }, () => Math.random() * 70 + 20);
        setBars(newBars);
      } else {
        setBars([40, 60, 80, 50, 70]);
      }
    };

    generateBars();
    
    if (isPlaying) {
      const interval = setInterval(generateBars, 150);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Size configurations
  const sizeConfig = {
    small: {
      gap: 'gap-0.5',
      width: 'w-0.5',
      minHeight: '2px'
    },
    medium: {
      gap: 'gap-1',
      width: 'w-1',
      minHeight: '4px'
    },
    large: {
      gap: 'gap-1.5',
      width: 'w-1.5',
      minHeight: '6px'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-end justify-center ${config.gap} ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={`${config.width} bg-gradient-to-t from-primary-600 to-primary-400 rounded-full transition-all duration-150 ${
            isPlaying ? 'audio-visualizer-bar' : 'opacity-60'
          }`}
          style={{
            height: `${Math.max(height, 20)}%`,
            minHeight: config.minHeight,
            maxHeight: '100%',
            filter: isPlaying ? 'drop-shadow(0 0 4px rgba(253, 197, 0, 0.6))' : 'none',
            boxShadow: isPlaying ? 'inset 0 0 4px rgba(253, 197, 0, 0.3)' : 'none'
          }}
        />
      ))}
    </div>
  );
}
