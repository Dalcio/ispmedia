/**
 * Modal para exibir notificações do usuário
 */

"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Music,
  MessageCircle,
  Edit,
  Shield,
  Check,
  Eye,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/ui-button";
import { useNotificacoesSimple } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/auth-context";
import type {
  Notificacao,
  TipoNotificacao,
  AcaoNotificacao,
} from "@/lib/types/notificacao";
import { NotificationDetailsModal } from "./notification-details-modal";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const { user } = useAuth();
  const {
    notificacoes,
    countNaoLidas,
    loading,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoesSimple();

  const [selectedNotification, setSelectedNotification] =
    useState<Notificacao | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleMarkAsRead = async (notificacao: Notificacao) => {
    if (!user?.uid || notificacao.lida) return;

    await marcarComoLida(user.uid, notificacao.id);
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.uid || countNaoLidas === 0) return;

    await marcarTodasComoLidas(user.uid);
  };

  const handleViewDetails = (notificacao: Notificacao) => {
    setSelectedNotification(notificacao);
    setShowDetailsModal(true);

    // Marcar como lida ao abrir detalhes
    if (!notificacao.lida) {
      handleMarkAsRead(notificacao);
    }
  };

  const getNotificationIcon = (
    tipo: TipoNotificacao,
    acao: AcaoNotificacao
  ) => {
    // Ícone baseado na ação primeiro, depois no tipo
    switch (acao) {
      case "playlist":
        return <Music className="w-5 h-5 text-blue-500" />;
      case "comentario":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "edicao":
        return <Edit className="w-5 h-5 text-orange-500" />;
      case "moderacao":
        return <Shield className="w-5 h-5 text-purple-500" />;
      default:
        // Fallback para ícone baseado no tipo
        switch (tipo) {
          case "sucesso":
            return <CheckCircle className="w-5 h-5 text-green-500" />;
          case "erro":
            return <XCircle className="w-5 h-5 text-red-500" />;
          case "alerta":
            return <AlertCircle className="w-5 h-5 text-yellow-500" />;
          case "info":
          default:
            return <Info className="w-5 h-5 text-blue-500" />;
        }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const getNotificationBorderColor = (tipo: TipoNotificacao) => {
    switch (tipo) {
      case "sucesso":
        return "border-l-green-500";
      case "erro":
        return "border-l-red-500";
      case "alerta":
        return "border-l-yellow-500";
      case "info":
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Notificações" size="lg">
        <div className="space-y-4">
          {/* Header com ações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {notificacoes.length > 0
                  ? `${notificacoes.length} notificação${
                      notificacoes.length > 1 ? "ões" : ""
                    }`
                  : "Nenhuma notificação"}
              </span>
              {countNaoLidas > 0 && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                  {countNaoLidas} não lida{countNaoLidas > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {countNaoLidas > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {/* Lista de notificações */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Carregando notificações...
                </p>
              </div>
            ) : notificacoes.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Você não tem notificações ainda
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Quando houver atividade em suas músicas, você será notificado
                  aqui
                </p>
              </div>
            ) : (
              notificacoes.map((notificacao) => (
                <NotificationItem
                  key={notificacao.id}
                  notificacao={notificacao}
                  onMarkAsRead={() => handleMarkAsRead(notificacao)}
                  onViewDetails={() => handleViewDetails(notificacao)}
                  getIcon={getNotificationIcon}
                  formatTime={formatTimestamp}
                  getBorderColor={getNotificationBorderColor}
                />
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de detalhes da notificação */}
      <NotificationDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        notification={selectedNotification}
      />
    </>
  );
}

interface NotificationItemProps {
  notificacao: Notificacao;
  onMarkAsRead: () => void;
  onViewDetails: () => void;
  getIcon: (tipo: TipoNotificacao, acao: AcaoNotificacao) => React.ReactElement;
  formatTime: (timestamp: string) => string;
  getBorderColor: (tipo: TipoNotificacao) => string;
}

function NotificationItem({
  notificacao,
  onMarkAsRead,
  onViewDetails,
  getIcon,
  formatTime,
  getBorderColor,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
        notificacao.lida
          ? "bg-neutral-50 dark:bg-neutral-800/50 opacity-75"
          : "bg-white dark:bg-neutral-800 shadow-sm"
      } ${getBorderColor(notificacao.tipo)}`}
    >
      <div className="flex items-start gap-3">
        {/* Ícone */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notificacao.tipo, notificacao.acao)}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-relaxed ${
              notificacao.lida
                ? "text-neutral-600 dark:text-neutral-400"
                : "text-neutral-800 dark:text-neutral-200"
            }`}
          >
            {notificacao.mensagem}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              {formatTime(notificacao.timestamp)}
            </span>

            <div className="flex items-center gap-2">
              {!notificacao.lida && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  title="Marcar como lida"
                >
                  Marcar como lida
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1"
                title="Ver detalhes"
              >
                <Eye className="w-3 h-3" />
                Ver mais
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de não lida */}
        {!notificacao.lida && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
