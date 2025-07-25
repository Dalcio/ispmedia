import { Music, List, User, Search, Keyboard, Upload } from "lucide-react";

export interface ShortcutAction {
  key: string;
  label: string;
  description: string;
  icon: any;
  action: () => void;
  category: "actions" | "navigation" | "shortcuts";
}

// Esta função será chamada com os callbacks necessários
export function getShortcuts(actions: {
  openUploadModal: () => void;
  openPlaylistModal: () => void;
  openDashboard: () => void;
  openSearch: () => void;
  closeAllModals: () => void;
  openProfile: () => void;
}): ShortcutAction[] {
  return [
    // Ações principais
    {
      key: "U",
      label: "Upload de música",
      description: "Fazer upload de uma nova música",
      icon: Upload,
      action: actions.openUploadModal,
      category: "actions",
    },
    {
      key: "P",
      label: "Criar playlist",
      description: "Criar uma nova playlist",
      icon: List,
      action: actions.openPlaylistModal,
      category: "actions",
    },
    {
      key: "D",
      label: "Abrir dashboard",
      description: "Abrir o painel do usuário",
      icon: Music,
      action: actions.openDashboard,
      category: "navigation",
    },
    {
      key: "/",
      label: "Buscar músicas e artistas",
      description: "Abrir modal de busca",
      icon: Search,
      action: actions.openSearch,
      category: "navigation",
    },
    {
      key: "Perfil",
      label: "Ir para perfil",
      description: "Navegar para o perfil do usuário",
      icon: User,
      action: actions.openProfile,
      category: "navigation",
    },
    {
      key: "Esc",
      label: "Fechar modais",
      description: "Fechar todos os modais abertos",
      icon: Keyboard,
      action: actions.closeAllModals,
      category: "shortcuts",
    },
  ];
}

export const COMMAND_PALETTE_SHORTCUTS = [
  {
    key: "k",
    ctrlKey: true,
    description: "Abrir painel de comandos (Ctrl+K)",
  },
  {
    key: "k",
    metaKey: true,
    description: "Abrir painel de comandos (Cmd+K)",
  },
];
