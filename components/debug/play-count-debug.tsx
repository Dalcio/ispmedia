"use client";

import { useState, useEffect } from "react";
import { usePlayCount } from "@/hooks/use-play-count";

interface PlayCountDebugProps {
  trackId: string;
}

export function PlayCountDebug({ trackId }: PlayCountDebugProps) {
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Use the new usePlayCount hook with real-time updates
  const { playCount, incrementPlayCount, getPlayCount, loading, isListening } = usePlayCount(trackId);

  // Log when play count changes
  useEffect(() => {
    addToLog(`Play count updated: ${playCount}`);
  }, [playCount]);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 4)]);
  };  const handleIncrement = async () => {
    addToLog("Manual increment clicked");
    try {
      const result = await incrementPlayCount(trackId);
      if (result) {
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
        </div>        <div>
          <div className="text-gray-600">Loading:</div>
          <div className={loading ? "text-orange-600" : "text-green-600"}>
            {loading ? "Yes" : "No"}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Listening:</div>
          <div className={isListening ? "text-orange-600" : "text-green-600"}>
            {isListening ? "Yes" : "No"}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Play Count:</div>
          <div className="font-bold text-blue-600">{playCount}</div>
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
