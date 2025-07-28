"use client";

import { useState } from "react";
import { UserAvatarButton } from "@/components/layout/user-avatar-button";
import { NotificationButton } from "@/components/layout/notification-button";
import { Button } from "@/components/ui/ui-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthModal } from "@/components/modals/auth-modal";
import { useUploadModal } from "@/contexts/upload-context";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { useAuth } from "@/contexts/auth-context";
import { Music, Upload, BarChart3, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { user } = useAuth();
  const { openUploadModal } = useUploadModal();
  const { openCommandPalette: openPalette } = useCommandPalette();
  const { openDrawer } = useDashboardDrawer();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      {" "}
      <header
        className={`sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-700 ${className}`}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  ISPmedia
                </h1>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-4">
                <Link
                  href="/diagrams"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Diagramas
                </Link>
              </nav>
            </div>{" "}
            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {user ? (
                <>
                  {/* Mobile Dashboard Button */}
                  <Button
                    onClick={() => openDrawer("tracks")}
                    size="sm"
                    variant="ghost"
                    className="lg:hidden inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 p-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>

                  {/* Quick Actions */}
                  <div className="hidden lg:flex items-center gap-2">
                    <Button
                      onClick={() => openUploadModal()}
                      size="sm"
                      className="inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="hidden xl:inline">Upload</span>
                    </Button>
                    <Button
                      onClick={() => openDrawer("tracks")}
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Button>
                  </div>

                  {/* Notifications Button */}
                  <NotificationButton />

                  {/* User Avatar with Dropdown */}
                  <UserAvatarButton onOpenCommandPalette={openPalette} />
                </>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Entrar</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Criar Conta</span>
                    <span className="sm:hidden">Cadastro</span>
                  </Button>
                </div>
              )}
            </div>{" "}
          </div>
        </div>
      </header>
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
