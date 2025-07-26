"use client";

import { useState, useCallback } from "react";

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const openPalette = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openCommandPalette = useCallback(() => {
    const event = new CustomEvent("openCommandPalette");
    window.dispatchEvent(event);
  }, []);

  return {
    isOpen,
    openPalette,
    closePalette,
    togglePalette,
    openCommandPalette,
  };
}
