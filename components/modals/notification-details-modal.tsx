/**
 * Modal expandido para mostrar detalhes completos da notificação
 */

"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Music,
  MessageCircle,
  Edit,
  Shield,
  Calendar,
  Tag,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import type {
  Notificacao,
  TipoNotificacao,
  AcaoNotificacao,
} from "@/lib/types/notificacao";

interface NotificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notificacao | null;
}

export function NotificationDetailsModal({
  isOpen,
  onClose,
  notification,
}: NotificationDetailsModalProps) {
  if (!notification) return null;

  const getNotificationIcon = (
    tipo: TipoNotificacao,
    acao: AcaoNotificacao
  ) => {
    switch (acao) {
      case "playlist":
        return <Music className="w-8 h-8 text-blue-500" />;
      case "comentario":
        return <MessageCircle className="w-8 h-8 text-green-500" />;
      case "edicao":
        return <Edit className="w-8 h-8 text-orange-500" />;
      case "moderacao":
        return <Shield className="w-8 h-8 text-purple-500" />;
      default:
        switch (tipo) {
          case "sucesso":
            return <CheckCircle className="w-8 h-8 text-green-500" />;
          case "erro":
            return <XCircle className="w-8 h-8 text-red-500" />;
          case "alerta":
            return <AlertCircle className="w-8 h-8 text-yellow-500" />;
          case "info":
          default:
            return <Info className="w-8 h-8 text-blue-500" />;
        }
    }
  };

  const getTypeLabel = (tipo: TipoNotificacao) => {
    switch (tipo) {
      case "sucesso":
        return "Sucesso";
      case "erro":
        return "Erro";
      case "alerta":
        return "Alerta";
      case "info":
      default:
        return "Informação";
    }
  };

  const getActionLabel = (acao: AcaoNotificacao) => {
    switch (acao) {
      case "playlist":
        return "Playlist";
      case "comentario":
        return "Comentário";
      case "edicao":
        return "Edição de Música";
      case "moderacao":
        return "Moderação";
      default:
        return "Geral";
    }
  };

  const getBadgeColor = (tipo: TipoNotificacao) => {
    switch (tipo) {
      case "sucesso":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "erro":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "alerta":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "info":
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true, locale: ptBR }),
        absolute: date.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return {
        relative: "Data inválida",
        absolute: "Data inválida",
      };
    }
  };

  const timeInfo = formatTimestamp(notification.timestamp);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Notificação"
      size="md"
    >
      <div className="space-y-6">
        {/* Header com ícone e status */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.tipo, notification.acao)}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                  notification.tipo
                )}`}
              >
                {getTypeLabel(notification.tipo)}
              </span>

              {!notification.lida && (
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full">
                  Não lida
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              {getActionLabel(notification.acao)}
            </h3>
          </div>
        </div>

        {/* Mensagem principal */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
          <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
            {notification.mensagem}
          </p>
        </div>

        {/* Informações técnicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Data e Hora
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {timeInfo.absolute}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {timeInfo.relative}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Categoria
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {getActionLabel(notification.acao)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações adicionais técnicas (para debug ou suporte) */}
        <details className="group">
          <summary className="cursor-pointer text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            Informações técnicas
          </summary>
          <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg text-xs font-mono space-y-1">
            <p>
              <span className="text-neutral-500">ID:</span> {notification.id}
            </p>
            <p>
              <span className="text-neutral-500">Origem:</span>{" "}
              {notification.origemId}
            </p>
            <p>
              <span className="text-neutral-500">Tipo:</span>{" "}
              {notification.tipo}
            </p>
            <p>
              <span className="text-neutral-500">Ação:</span>{" "}
              {notification.acao}
            </p>
            <p>
              <span className="text-neutral-500">Lida:</span>{" "}
              {notification.lida ? "Sim" : "Não"}
            </p>
          </div>
        </details>
      </div>
    </Modal>
  );
}
