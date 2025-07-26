"use client";

import { UserAvatarButton } from "@/components/layout/user-avatar-button";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-700 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  ISPmedia
                </h1>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-4">
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
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  {/* Mobile Dashboard Button */}
                  <Button
                    onClick={() => openDrawer("tracks")}
                    size="sm"
                    variant="ghost"
                    className="sm:hidden inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Button>

                  {/* Quick Actions */}
                  <div className="hidden sm:flex items-center gap-2">
                    {" "}
                    <Button
                      onClick={() => openUploadModal()}
                      size="sm"
                      className="inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                    <Button
                      onClick={() => openDrawer("tracks")}
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </div>
                  {/* User Avatar with Dropdown */}
                  <UserAvatarButton onOpenCommandPalette={openPalette} />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                  <Button size="sm">Criar Conta</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
