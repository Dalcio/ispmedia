"use client";

import React from "react";
import { motion } from "framer-motion";

interface AudioWavesProps {
  isPlaying: boolean;
  className?: string;
}

const AudioWaves: React.FC<AudioWavesProps> = ({ 
  isPlaying, 
  className = "" 
}) => {
  console.log("🎵 AudioWaves: isPlaying =", isPlaying);

  // Configuração das barras de onda - valores maiores para melhor visibilidade
  const bars = [
    { delay: 0, height: [8, 24, 8] },
    { delay: 0.1, height: [12, 32, 12] },
    { delay: 0.2, height: [10, 28, 10] },
    { delay: 0.3, height: [14, 36, 14] },
    { delay: 0.4, height: [8, 26, 8] }
  ];

  return (
    <div 
      className={`flex items-center justify-center gap-2 h-12 px-4 ${className}`}
      style={{ 
        minHeight: '48px',
        // Debug border when playing        border: isPlaying ? '1px solid rgba(253, 197, 0, 0.2)' : 'none',
        borderRadius: '12px',
        background: isPlaying ? 'rgba(253, 197, 0, 0.05)' : 'transparent'
      }}
    >      {bars.map((bar, index) => (
        <motion.div
          key={index}
          initial={{ height: 8 }}
          animate={{
            height: isPlaying ? bar.height : 8,
          }}
          transition={{
            duration: 0.6,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: bar.delay,
          }}
          style={{
            width: '12px',
            background: isPlaying 
              ? 'linear-gradient(to top, #FDC500, #F59E0B)'
              : 'rgba(253, 197, 0, 0.4)',
            filter: isPlaying 
              ? "drop-shadow(0 0 8px rgba(253, 197, 0, 0.7))" 
              : "none",
            minHeight: '8px',
            boxShadow: isPlaying ? 'inset 0 0 10px rgba(253, 197, 0, 0.3)' : 'none',
            opacity: isPlaying ? 1 : 0.6,
            borderRadius: '9999px'
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaves;
