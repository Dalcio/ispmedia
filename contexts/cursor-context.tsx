'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CursorContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  variant: 'default' | 'hover' | 'click' | 'text';
  setVariant: (variant: 'default' | 'hover' | 'click' | 'text') => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [variant, setVariant] = useState<'default' | 'hover' | 'click' | 'text'>('default');

  return (
    <CursorContext.Provider 
      value={{ 
        isEnabled, 
        setIsEnabled, 
        variant, 
        setVariant 
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}

// Hook para aplicar efeitos de hover facilmente
export function useCursorHover() {
  const { setVariant } = useCursor();

  const onMouseEnter = () => setVariant('hover');
  const onMouseLeave = () => setVariant('default');

  return { onMouseEnter, onMouseLeave };
}
