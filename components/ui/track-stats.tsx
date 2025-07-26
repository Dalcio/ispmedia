"use client";

import { useState, useEffect } from "react";
import { usePlayCount } from "@/hooks/use-play-count";
import { useAtividade } from "@/hooks/use-atividade";
import { useAuth } from "@/contexts/auth-context";
import { Play, TrendingUp, Clock, Plus } from "lucide-react";

interface TrackStatsProps {
  trackId: string;
  initialPlayCount?: number;
  showTrend?: boolean;
  showLastPlayed?: boolean;
  showIncrementButton?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function TrackStats({
  trackId,
  initialPlayCount = 0,
  showTrend = false,
  showLastPlayed = false,
  showIncrementButton = false,
  className = "",
  size = "md",
}: TrackStatsProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<Date | null>(null);
  const [recentPlaysCount, setRecentPlaysCount] = useState(0);
  const [isIncrementing, setIsIncrementing] = useState(false);

  // Use the new usePlayCount hook with real-time updates
  const { playCount, incrementPlayCount, loading } = usePlayCount(trackId);
  const { buscarAtividades } = useAtividade();
  const { user } = useAuth();

  console.log(
    `[TrackStats] Component rendered for track ${trackId} with play count: ${playCount} (initial: ${initialPlayCount})`
  );  // Load activity history for trend and last played data
  useEffect(() => {
    if (trackId && user && (showTrend || showLastPlayed)) {
      loadActivityHistory();
    }
  }, [trackId, user, showTrend, showLastPlayed]);

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
    }  };  // Animation trigger for play count changes
  const [previousPlayCount, setPreviousPlayCount] = useState(playCount);
  
  useEffect(() => {
    if (playCount > previousPlayCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
    setPreviousPlayCount(playCount);
  }, [playCount, previousPlayCount]);  // Manual increment function
  const handleManualIncrement = async () => {
    if (isIncrementing || loading) return; // Prevent double clicks
    
    try {
      setIsIncrementing(true);
      console.log(`[TrackStats] Manual increment clicked for track: ${trackId}`);
      
      const result = await incrementPlayCount(trackId);
      if (result) {
        console.log(`[TrackStats] Manual increment successful: ${result.playCount}`);
      } else {
        console.warn(`[TrackStats] Manual increment failed`);
      }
    } catch (error) {
      console.warn("Failed to manually increment play count:", error);
    } finally {
      setIsIncrementing(false);
    }
  };  // Listen for global events to update last played time
  useEffect(() => {
    const handlePlayCountUpdate = (event: CustomEvent) => {
      console.log(`[TrackStats] Play count event received:`, event.detail);
      if (event.detail.trackId === trackId && showLastPlayed) {
        console.log(`[TrackStats] Event matches this track, updating last played`);
        setLastPlayed(new Date());
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
  }, [trackId, showLastPlayed]);

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
    <div className={`flex items-center gap-2 ${className}`}>
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
          </span>        </div>
      )}

      {/* Last Played */}
      {showLastPlayed && lastPlayed && (
        <div className={`flex items-center gap-1 text-text-muted`}>
          <Clock className={`${iconSizes[size]} opacity-70`} />
          <span className={`${sizeClasses[size]}`}>
            {formatLastPlayed(lastPlayed)}
          </span>        </div>
      )}

      {/* Manual Increment Button */}
      {showIncrementButton && (
        <button
          onClick={handleManualIncrement}
          disabled={isIncrementing}
          className={`flex items-center gap-1 px-1.5 py-0.5 text-primary-500 hover:text-primary-600 hover:bg-primary-500/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} flex-shrink-0`}
          title="Increment play count manually"
        >
          {isIncrementing ? (
            <div className={`border border-primary-500 border-t-transparent rounded-full animate-spin ${iconSizes[size]}`} />
          ) : (
            <Plus className={`${iconSizes[size]}`} />
          )}
          <span className="font-medium">+1</span>
        </button>
      )}
    </div>
  );
}
