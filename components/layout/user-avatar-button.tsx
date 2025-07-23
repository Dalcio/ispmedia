"use client";

import { useAuth } from "@/contexts/auth-context";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { Button } from "@/components/ui/button";
import { User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UserAvatarButtonProps {
  className?: string;
  showDropdown?: boolean;
}

export function UserAvatarButton({
  className = "",
  showDropdown = true,
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

  const handleOpenDashboard = () => {
    openDrawer();
    setIsDropdownOpen(false);
  };

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
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
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
          <div className="py-1">
            <button
              onClick={handleOpenDashboard}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
