"use client";

import { useState, useEffect } from "react";
import { usePlayCount } from "@/hooks/use-play-count";

interface PlayCountDebugProps {
  trackId: string;
}

export function PlayCountDebug({ trackId }: PlayCountDebugProps) {
  const [currentCount, setCurrentCount] = useState(0);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [realTimeCount, setRealTimeCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const { incrementPlayCount, getPlayCount, loading } = usePlayCount();

  // Load initial count
  useEffect(() => {
    const loadInitialCount = async () => {
      const count = await getPlayCount(trackId);
      setCurrentCount(count);
      setRealTimeCount(count);
      addToLog(`Initial count loaded: ${count}`);
    };

    loadInitialCount();
  }, [trackId, getPlayCount]);

  // Listen for play count updates
  useEffect(() => {
    const handlePlayCountUpdate = (event: CustomEvent) => {
      if (event.detail.trackId === trackId) {
        setRealTimeCount(event.detail.playCount);
        addToLog(`Event received: ${event.detail.playCount}`);
      }
    };

    window.addEventListener(
      "playCountUpdated",
      handlePlayCountUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "playCountUpdated",
        handlePlayCountUpdate as EventListener
      );
    };
  }, [trackId]);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 4)]);
  };
  const handleIncrement = async () => {
    addToLog("Manual increment clicked");
    try {
      const result = await incrementPlayCount(trackId);
      if (result) {
        setCurrentCount(result.playCount);
        setLastError(null);
        addToLog(`API returned: ${result.playCount}`);
      } else {
        setLastError("API returned null result");
        addToLog("API failed - check console for details");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMsg);
      addToLog(`Exception: ${errorMsg}`);
    }
  };

  const handleRefresh = async () => {
    addToLog("Manual refresh clicked");
    try {
      const count = await getPlayCount(trackId);
      setCurrentCount(count);
      setLastError(null);
      addToLog(`Refreshed count: ${count}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMsg);
      addToLog(`Refresh failed: ${errorMsg}`);
    }
  };

  const testFirebaseConnection = async () => {
    addToLog("Testing Firebase connection...");
    try {
      const response = await fetch("/api/test-firebase");
      const result = await response.json();
      if (result.success) {
        addToLog("Firebase connection OK");
        setLastError(null);
      } else {
        addToLog(`Firebase test failed: ${result.error}`);
        setLastError(result.error);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addToLog(`Connection test failed: ${errorMsg}`);
      setLastError(errorMsg);
    }
  };
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
      <h4 className="font-bold text-red-800 mb-2">🐛 Play Count Debug</h4>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-gray-600">Track ID:</div>
          <div className="font-mono text-gray-800">
            {trackId.slice(0, 8)}...
          </div>
        </div>
        <div>
          <div className="text-gray-600">Loading:</div>
          <div className={loading ? "text-orange-600" : "text-green-600"}>
            {loading ? "Yes" : "No"}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Static Count:</div>
          <div className="font-bold text-blue-600">{currentCount}</div>
        </div>
        <div>
          <div className="text-gray-600">Real-time:</div>
          <div className="font-bold text-green-600">{realTimeCount}</div>
        </div>
      </div>

      {lastError && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
          <strong>Last Error:</strong> {lastError}
        </div>
      )}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleIncrement}
          disabled={loading}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          +1 Play
        </button>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Refresh
        </button>

        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test DB
        </button>
      </div>

      <div className="space-y-1">
        <div className="font-semibold text-gray-700">Event Log:</div>
        {eventLog.map((log, index) => (
          <div key={index} className="text-gray-600 font-mono text-xs">
            {log}
          </div>
        ))}
        {eventLog.length === 0 && (
          <div className="text-gray-400 italic">No events yet...</div>
        )}
      </div>
    </div>
  );
}
