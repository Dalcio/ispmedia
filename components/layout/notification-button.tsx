/**
 * Botão de notificações para o header
 */

"use client";

import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/ui-button";
import { useNotificacoesSimple } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/auth-context";
import { NotificationsModal } from "@/components/modals/notifications-modal";

interface NotificationButtonProps {
  className?: string;
}

export function NotificationButton({
  className = "",
}: NotificationButtonProps) {
  const { user } = useAuth();
  const { countNaoLidas, iniciarListener, pararListener, limparNotificacoes } =
    useNotificacoesSimple();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inicializar listener quando usuário estiver logado
  useEffect(() => {
    if (user?.uid) {
      iniciarListener(user.uid);
    } else {
      limparNotificacoes();
    }

    return () => {
      pararListener();
    };
  }, [user?.uid, iniciarListener, pararListener, limparNotificacoes]);

  // Não mostrar botão se usuário não estiver logado
  if (!user) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const hasUnreadNotifications = countNaoLidas > 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenModal}
        className={`relative transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${className}`}
        title={`${countNaoLidas} notificações não lidas`}
      >
        {hasUnreadNotifications ? (
          <BellDot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        ) : (
          <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        )}

        {/* Badge com número de notificações */}
        {hasUnreadNotifications && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {countNaoLidas > 99 ? "99+" : countNaoLidas}
          </span>
        )}
      </Button>

      {/* Modal de notificações */}
      <NotificationsModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
