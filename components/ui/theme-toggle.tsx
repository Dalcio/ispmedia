"use client";

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/ui-button';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light' as const, label: 'Light', icon: Sun },
    { id: 'dark' as const, label: 'Dark', icon: Moon },
    { id: 'auto' as const, label: 'Auto', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg z-50 py-2">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.id;
              
              return (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'text-primary-500 bg-primary-50 dark:bg-primary-500/10'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{themeOption.label}</span>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
