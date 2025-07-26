import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

/**
 * Hook para gerenciar atalhos de teclado globais
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input/textarea
      const target = event.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (isTyping) return;

      for (const shortcut of shortcuts) {
        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
        const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
        const altMatches = !!shortcut.altKey === event.altKey;
        const metaMatches = !!shortcut.metaKey === event.metaKey;

        if (
          keyMatches &&
          ctrlMatches &&
          shiftMatches &&
          altMatches &&
          metaMatches
        ) {
          if (preventDefault) {
            event.preventDefault();
          }
          shortcut.callback();
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts, enabled, preventDefault]);
}

/**
 * Hook específico para atalhos de upload de música
 */
export function useUploadShortcuts(
  onUpload: () => void,
  enabled: boolean = true
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: "u",
      callback: onUpload,
      description: "Abrir modal de upload de música",
    },
  ];

  useKeyboardShortcuts(shortcuts, { enabled });
}

/**
 * Hook específico para atalhos do dashboard
 */
export function useDashboardShortcuts(
  onOpenDashboard: () => void,
  enabled: boolean = true
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: "d",
      callback: onOpenDashboard,
      description: "Abrir/fechar drawer do dashboard",
    },
  ];

  useKeyboardShortcuts(shortcuts, { enabled });
}

/**
 * Hook específico para atalhos de busca
 */
export function useSearchShortcuts(
  onOpenSearch: () => void,
  enabled: boolean = true
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: "/",
      callback: onOpenSearch,
      description: "Abrir modal de busca",
    },
    {
      key: "s",
      ctrlKey: true,
      callback: onOpenSearch,
      description: "Abrir modal de busca (Ctrl+S)",
    },
  ];

  useKeyboardShortcuts(shortcuts, { enabled });
}
