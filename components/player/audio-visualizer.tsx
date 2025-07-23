'use client';

import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export function AudioVisualizer({ isPlaying, className = '' }: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>([40, 60, 80, 50, 70]);

  useEffect(() => {
    const generateBars = () => {
      if (isPlaying) {
        const newBars = Array.from({ length: 5 }, () => Math.random() * 60 + 30);
        setBars(newBars);
      } else {
        setBars([40, 60, 80, 50, 70]);
      }
    };

    generateBars();
    
    if (isPlaying) {
      const interval = setInterval(generateBars, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className={`flex items-end justify-center gap-0.5 ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-0.5 bg-gradient-to-t from-primary-600 to-primary-400 rounded-full transition-all duration-200 ${
            isPlaying ? 'audio-visualizer-bar' : 'opacity-60'
          }`}
          style={{
            height: `${Math.max(height, 20)}%`,
            minHeight: '2px',
            maxHeight: '100%',
          }}
        />
      ))}
    </div>
  );
}
