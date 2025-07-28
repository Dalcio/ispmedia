"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/ui-button";
import { UserTrackList } from "@/components/drawers/UserTrackList";
import { PlaylistSection } from "@/components/dashboard-tabs/playlists";
import { ProfileSection } from "@/components/dashboard-tabs/profile";
import { ActivitySection } from "@/components/dashboard-tabs/activity";
import {
  X,
  Music,
  ListMusic,
  User,
  Settings,
  Upload,
  LogOut,
  Activity,
} from "lucide-react";

interface DashboardDrawerProps {
  className?: string;
}

export function DashboardDrawer({ className = "" }: DashboardDrawerProps) {
  const { isOpen, activeSection, closeDrawer, setActiveSection } =
    useDashboardDrawer();
  const { user, signOut } = useAuth();

  // Atalhos de teclado
  useKeyboardShortcuts(
    [
      {
        key: "Escape",
        callback: closeDrawer,
        description: "Fechar drawer do dashboard",
      },
    ],
    { enabled: isOpen }
  );
  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const drawer = document.getElementById("dashboard-drawer");

      // Don't close if clicking on a modal or other overlay
      const isModalContent =
        target.closest('[role="dialog"]') ||
        target.closest(".modal-content") ||
        target.closest("[data-modal]");

      if (drawer && !drawer.contains(target) && !isModalContent) {
        closeDrawer();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeDrawer]);

  // Prevenir scroll do body quando drawer estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  const navigationItems = [
    {
      id: "tracks" as const,
      label: "Minhas Músicas",
      icon: Music,
      description: "Gerencie suas músicas",
    },
    {
      id: "playlists" as const,
      label: "Minhas Playlists",
      icon: ListMusic,
      description: "Organize suas playlists",
    },
    {
      id: "activity" as const,
      label: "Atividades",
      icon: Activity,
      description: "Histórico de reprodução",
    },
    {
      id: "profile" as const,
      label: "Perfil",
      icon: User,
      description: "Configurações do perfil",
    },
    {
      id: "settings" as const,
      label: "Configurações",
      icon: Settings,
      description: "Preferências da conta",
    },
  ];
  const renderContent = () => {
    switch (activeSection) {
      case "tracks":
        return <UserTrackList />;
      case "playlists":
        return <PlaylistSection />;
      case "activity":
        return <ActivitySection />;
      case "profile":
        return <ProfileSection />;
      case "settings":
        return (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Configurações
            </h3>
            <p className="text-neutral-500">Seção em desenvolvimento...</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={closeDrawer}
      />{" "}
      {/* Drawer */}
      <div
        id="dashboard-drawer"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-[420px] lg:w-[480px] max-w-[95vw] sm:max-w-md md:max-w-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-200 dark:border-neutral-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${className}`}
      >
        {" "}
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Dashboard
            </h2>
            {user && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[200px] sm:max-w-none">
                {user.displayName || user.email}
              </p>
            )}
          </div>
          <Button
            onClick={closeDrawer}
            variant="ghost"
            size="sm"
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 p-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>{" "}
        {/* Navigation */}
        <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {navigationItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-700"
                      : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">
                    {item.label.split(" ").map((word, i) => (
                      <span key={i} className="block sm:inline">
                        {word}
                        {i < item.label.split(" ").length - 1 && (
                          <span className="hidden sm:inline"> </span>
                        )}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-1 sm:mt-2">
            {navigationItems.slice(3).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-700"
                      : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-medium text-center">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>{" "}
        {/* Quick Actions */}
        <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 sm:mb-3">
            Ações Rápidas
          </h3>
          <div className="space-y-2">
            <Button
              onClick={() => {
                console.log("🎵 Botão upload clicado no dashboard");
                const event = new CustomEvent("openUploadModal");
                window.dispatchEvent(event);
                closeDrawer();
              }}
              className="w-full justify-start gap-2 sm:gap-3 bg-primary-600 hover:bg-primary-700 text-white text-sm p-2 sm:p-3"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Fazer Upload de Música</span>
              <span className="sm:hidden">Upload Música</span>
            </Button>
          </div>
        </div>{" "}
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-3 sm:p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
