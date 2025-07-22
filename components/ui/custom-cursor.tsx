'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface CursorState {
  x: number;
  y: number;
  isVisible: boolean;
  isHovering: boolean;
  isClicking: boolean;
  variant: 'default' | 'hover' | 'click' | 'text';
}

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isVisible: false,
    isHovering: false,
    isClicking: false,
    variant: 'default'
  });

  const [isMobile, setIsMobile] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Detect mobile devices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 768;
        setIsMobile(isTouchDevice || isSmallScreen);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Smooth cursor movement with animation frame
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setCursorState(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        isVisible: true
      }));
    });
  }, []);

  // Handle mouse events
  useEffect(() => {
    if (isMobile || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e);
    };

    const handleMouseEnter = () => {
      setCursorState(prev => ({ ...prev, isVisible: true }));
    };

    const handleMouseLeave = () => {
      setCursorState(prev => ({ ...prev, isVisible: false }));
    };

    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, isClicking: false }));
    };

    // Handle hoverable elements
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches(`
        button, 
        a, 
        input, 
        textarea, 
        select, 
        [role="button"], 
        [tabindex]:not([tabindex="-1"]),
        .cursor-hover,
        .cursor-clickable
      `) || target.closest('.cursor-hover, .cursor-clickable');

      const isTextInput = target.matches('input[type="text"], input[type="email"], input[type="password"], textarea');

      if (isTextInput) {
        setCursorState(prev => ({ ...prev, isHovering: true, variant: 'text' }));
      } else if (isInteractive) {
        setCursorState(prev => ({ ...prev, isHovering: true, variant: 'hover' }));
      } else {
        setCursorState(prev => ({ ...prev, isHovering: false, variant: 'default' }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile, updateCursorPosition]);

  // Don't render on mobile or during SSR
  if (isMobile || typeof window === 'undefined') {
    return null;
  }

  return (
    <>
      {cursorState.isVisible && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
          style={{
            transform: `translate3d(${cursorState.x}px, ${cursorState.y}px, 0)`,
          }}
        >
          {/* Outer Ring */}
          <div
            className={`
              absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out
              ${cursorState.isClicking ? 'scale-75' : cursorState.isHovering ? 'scale-150' : 'scale-100'}
              ${cursorState.isClicking ? 'opacity-60' : cursorState.isHovering ? 'opacity-20' : 'opacity-30'}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full border backdrop-blur-sm transition-all duration-200
              ${cursorState.isHovering 
                ? 'border-primary-400/40 bg-primary-500/10 shadow-lg shadow-primary-500/20' 
                : 'border-white/20 bg-white/5'
              }
              ${cursorState.variant === 'text' ? 'border-blue-400/40 bg-blue-500/10' : ''}
            `} />
          </div>

          {/* Inner Dot */}
          <div
            className={`
              absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out
              ${cursorState.isClicking ? 'scale-150' : cursorState.isHovering ? 'scale-75' : 'scale-100'}
            `}
          >
            <div className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${cursorState.isHovering 
                ? 'bg-primary-500 shadow-lg shadow-primary-500/50' 
                : 'bg-white shadow-lg shadow-white/50'
              }
              ${cursorState.variant === 'text' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : ''}
            `} />
          </div>

          {/* Click Ripple Effect */}
          {cursorState.isClicking && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping"
            >
              <div className={`
                w-4 h-4 rounded-full border-2 opacity-75
                ${cursorState.isHovering 
                  ? 'border-primary-400/60' 
                  : 'border-white/60'
                }
              `} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
