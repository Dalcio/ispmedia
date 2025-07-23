"use client";

import { UserAvatarButton } from "@/components/layout/user-avatar-button";
import { Button } from "@/components/ui/button";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { useUploadModal } from "@/hooks/use-upload-modal";
import { useAuth } from "@/contexts/auth-context";
import { Music, Upload, LayoutDashboard } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { user } = useAuth();
  const { openDrawer } = useDashboardDrawer();
  const { openModal } = useUploadModal();

  return (
    <header
      className={`sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-700 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              ISPmedia
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Quick Actions */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    onClick={openModal}
                    size="sm"
                    className="inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  <Button
                    onClick={() => openDrawer()}
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </div>

                {/* User Avatar with Dropdown */}
                <UserAvatarButton />
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
  );
}
