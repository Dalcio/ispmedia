"use client";

import { useState, useEffect } from "react";
import { usePlayCount } from "@/hooks/use-play-count";
import { Play } from "lucide-react";

interface PlayCountDisplayProps {
  trackId: string;
  initialCount?: number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PlayCountDisplay({
  trackId,
  initialCount = 0,
  className = "",
  showIcon = true,
  size = "md",
}: PlayCountDisplayProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use the new usePlayCount hook with real-time updates
  const { playCount } = usePlayCount(trackId);

  // Animation trigger for play count changes
  const [previousPlayCount, setPreviousPlayCount] = useState(playCount);
  
  useEffect(() => {
    if (playCount > previousPlayCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    setPreviousPlayCount(playCount);
  }, [playCount, previousPlayCount]);

  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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
    <div
      className={`flex items-center gap-1 text-text-muted transition-all duration-200 ${
        isAnimating ? "scale-110 text-primary-500" : ""
      } ${className}`}
    >
      {showIcon && <Play className={`${iconSizes[size]} opacity-70`} />}
      <span className={`${sizeClasses[size]} font-medium tabular-nums`}>
        {formatPlayCount(playCount)}
      </span>
    </div>
  );
}
