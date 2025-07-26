"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Get theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const updateResolvedTheme = () => {
      let newResolvedTheme: 'light' | 'dark';

      if (theme === 'auto') {
        newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      } else {
        newResolvedTheme = theme;
      }

      setResolvedTheme(newResolvedTheme);

      // Update DOM classes
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);

      // Save to localStorage
      localStorage.setItem('theme', theme);
    };

    updateResolvedTheme();

    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateResolvedTheme);
      
      return () => {
        mediaQuery.removeEventListener('change', updateResolvedTheme);
      };
    }
  }, [theme]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
