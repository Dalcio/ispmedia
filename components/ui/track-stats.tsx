"use client";

import { useState, useEffect } from "react";
import { usePlayCount } from "@/hooks/use-play-count";
import { useAtividade } from "@/hooks/use-atividade";
import { useAuth } from "@/contexts/auth-context";
import { Play, TrendingUp, Clock } from "lucide-react";

interface TrackStatsProps {
  trackId: string;
  initialPlayCount?: number;
  showTrend?: boolean;
  showLastPlayed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function TrackStats({
  trackId,
  initialPlayCount = 0,
  showTrend = false,
  showLastPlayed = false,
  className = "",
  size = "md",
}: TrackStatsProps) {
  const [playCount, setPlayCount] = useState(initialPlayCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<Date | null>(null);
  const [recentPlaysCount, setRecentPlaysCount] = useState(0);

  const { getPlayCount } = usePlayCount();
  const { buscarAtividades } = useAtividade();
  const { user } = useAuth();

  console.log(
    `[TrackStats] Component rendered for track ${trackId} with initial count: ${initialPlayCount}`
  ); // Carregar estatísticas iniciais
  useEffect(() => {
    if (trackId) {
      console.log(
        `[TrackStats] Loading stats for track: ${trackId}, initial: ${initialPlayCount}`
      );

      // Usar o valor inicial se disponível
      if (initialPlayCount > 0 && playCount === 0) {
        console.log(
          `[TrackStats] Using initial play count: ${initialPlayCount}`
        );
        setPlayCount(initialPlayCount);
      }

      // Carregar play count atual do servidor para sincronizar
      getPlayCount(trackId).then((count) => {
        console.log(
          `[TrackStats] Got play count from server: ${count} for track: ${trackId}`
        );
        if (count !== playCount) {
          console.log(
            `[TrackStats] Updating play count from ${playCount} to ${count}`
          );
          setPlayCount(count);
        }
      });

      // Carregar histórico de atividades se usuário logado
      if (user && (showTrend || showLastPlayed)) {
        loadActivityHistory();
      }
    }
  }, [
    trackId,
    initialPlayCount,
    user,
    showTrend,
    showLastPlayed,
    getPlayCount,
  ]);

  const loadActivityHistory = async () => {
    if (!user) return;

    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const resultado = await buscarAtividades(user.uid, {
        acao: "ouviu",
        limit: 50,
      });

      if (resultado.atividades.length > 0) {
        // Filtrar atividades relacionadas a esta track
        const atividadesTrack = resultado.atividades.filter(
          (atividade) => atividade.midiaId === trackId
        );

        if (atividadesTrack.length > 0) {
          // Última reprodução
          const ultimaReproducao = atividadesTrack[0];
          setLastPlayed(new Date(ultimaReproducao.timestamp));

          // Contar reproduções recentes (últimas 24h)
          const reproducoesRecentes = atividadesTrack.filter(
            (atividade) => new Date(atividade.timestamp) > oneDayAgo
          );
          setRecentPlaysCount(reproducoesRecentes.length);
        }
      }
    } catch (error) {
      console.warn("Erro ao carregar histórico de atividades:", error);
    }
  };
  // Atualizar contador com animação
  const updateCount = (newCount: number) => {
    console.log(
      `[TrackStats] updateCount called: ${playCount} -> ${newCount} for track: ${trackId}`
    );
    if (newCount > playCount) {
      setIsAnimating(true);
      setPlayCount(newCount);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  // Escutar eventos globais de play count
  useEffect(() => {
    const handlePlayCountUpdate = (event: CustomEvent) => {
      console.log(`[TrackStats] Play count event received:`, event.detail);
      if (event.detail.trackId === trackId) {
        console.log(`[TrackStats] Event matches this track, updating count`);
        updateCount(event.detail.playCount);

        // Atualizar também a última reprodução
        if (showLastPlayed) {
          setLastPlayed(new Date());
        }
      }
    };

    console.log(`[TrackStats] Setting up event listener for track: ${trackId}`);
    window.addEventListener(
      "playCountUpdated",
      handlePlayCountUpdate as EventListener
    );
    return () => {
      console.log(`[TrackStats] Removing event listener for track: ${trackId}`);
      window.removeEventListener(
        "playCountUpdated",
        handlePlayCountUpdate as EventListener
      );
    };
  }, [trackId, playCount, showLastPlayed]);

  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatLastPlayed = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return `${diffDays}d atrás`;
    }
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Play Count */}
      <div
        className={`flex items-center gap-1 text-text-muted transition-all duration-300 ${
          isAnimating ? "scale-110 text-primary-500" : ""
        }`}
      >
        <Play className={`${iconSizes[size]} opacity-70`} />
        <span className={`${sizeClasses[size]} font-medium tabular-nums`}>
          {formatPlayCount(playCount)}
        </span>
      </div>

      {/* Trend (recent plays) */}
      {showTrend && recentPlaysCount > 0 && (
        <div className={`flex items-center gap-1 text-primary-500`}>
          <TrendingUp className={`${iconSizes[size]}`} />
          <span className={`${sizeClasses[size]} font-medium`}>
            +{recentPlaysCount}
          </span>
        </div>
      )}

      {/* Last Played */}
      {showLastPlayed && lastPlayed && (
        <div className={`flex items-center gap-1 text-text-muted`}>
          <Clock className={`${iconSizes[size]} opacity-70`} />
          <span className={`${sizeClasses[size]}`}>
            {formatLastPlayed(lastPlayed)}
          </span>
        </div>
      )}
    </div>
  );
}
