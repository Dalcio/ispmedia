import { create } from "zustand";

interface DashboardDrawerStore {
  isOpen: boolean;
  activeSection: "tracks" | "playlists" | "profile" | "settings";
  openDrawer: (
    section?: "tracks" | "playlists" | "profile" | "settings"
  ) => void;
  closeDrawer: () => void;
  setActiveSection: (
    section: "tracks" | "playlists" | "profile" | "settings"
  ) => void;
}

/**
 * Hook para gerenciar o estado do drawer lateral do dashboard
 */
export const useDashboardDrawer = create<DashboardDrawerStore>((set) => ({
  isOpen: false,
  activeSection: "tracks",

  openDrawer: (section = "tracks") => {
    set({ isOpen: true, activeSection: section });
  },

  closeDrawer: () => {
    set({ isOpen: false });
  },

  setActiveSection: (section) => {
    set({ activeSection: section });
  },
}));

/**
 * Hook de conveniência para usar o dashboard
 */
export const useDashboard = () => {
  const { openDrawer, setActiveSection } = useDashboardDrawer();

  return {
    openDrawer,
    setActiveTab: setActiveSection,
  };
};
