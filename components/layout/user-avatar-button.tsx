"use client";

import { useAuth } from "@/contexts/auth-context";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { Button } from "@/components/ui/button";
import {
  User,
  ChevronDown,
  Music,
  ListMusic,
  UserIcon,
  Settings,
  LogOut,
  Command,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UserAvatarButtonProps {
  className?: string;
  showDropdown?: boolean;
  onOpenCommandPalette?: () => void;
}

export function UserAvatarButton({
  className = "",
  showDropdown = true,
  onOpenCommandPalette,
}: UserAvatarButtonProps) {
  const { user, signOut } = useAuth();
  const { openDrawer } = useDashboardDrawer();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  const getUserInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    return user.displayName || user.email?.split("@")[0] || "Usuário";
  };

  const handleAvatarClick = () => {
    if (showDropdown) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      openDrawer();
    }
  };
  const handleOpenDashboard = (
    section: "tracks" | "playlists" | "profile" | "settings" = "tracks"
  ) => {
    openDrawer(section);
    setIsDropdownOpen(false);
  };

  const handleOpenTracks = () => handleOpenDashboard("tracks");
  const handleOpenPlaylists = () => handleOpenDashboard("playlists");
  const handleOpenProfile = () => handleOpenDashboard("profile");
  const handleOpenSettings = () => handleOpenDashboard("settings");

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Avatar Button */}
      <Button
        onClick={handleAvatarClick}
        variant="ghost"
        className={`flex items-center gap-2 p-2 h-auto rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
          showDropdown ? "pr-3" : ""
        }`}
      >
        {/* Avatar Circle */}
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getUserInitials()
          )}
        </div>

        {/* Nome (apenas se showDropdown for true) */}
        {showDropdown && (
          <>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden sm:block">
              {getUserDisplayName()}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </Button>
      {/* Dropdown Menu */}
      {showDropdown && isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl rounded-lg shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-neutral-200/50 dark:border-neutral-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          {/* Menu Items */}
          <div className="py-1 px-1">
            {onOpenCommandPalette && (
              <button
                onClick={() => {
                  onOpenCommandPalette();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 transition-colors rounded-md"
              >
                <Command className="w-4 h-4" />
                Painel de Comandos
                <span className="ml-auto text-xs text-neutral-500 font-mono">
                  ⌘K
                </span>
              </button>
            )}

            <button
              onClick={handleOpenTracks}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 transition-colors rounded-md"
            >
              <Music className="w-4 h-4" />
              Minhas Músicas
            </button>

            <button
              onClick={handleOpenPlaylists}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 transition-colors rounded-md"
            >
              <ListMusic className="w-4 h-4" />
              Minhas Playlists
            </button>

            <button
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 transition-colors rounded-md"
            >
              <UserIcon className="w-4 h-4" />
              Meu Perfil
            </button>

            <button
              onClick={handleOpenSettings}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 transition-colors rounded-md"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>

            <div className="border-t border-neutral-200/50 dark:border-neutral-700/50 my-1 mx-2"></div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-md"
            >
              <LogOut className="w-4 h-4" />
              Sair da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
