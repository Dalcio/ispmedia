"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";

export function TrackDebug() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    if (!user) {
      addLog("No user logged in");
      return;
    }

    addLog(`Starting debug for user: ${user.uid}`);

    // First, try to get ALL tracks in the database
    const testAllTracks = async () => {
      try {
        addLog("Querying ALL tracks in database...");
        const allTracksSnapshot = await getDocs(collection(db, "tracks"));
        addLog(`Total tracks in database: ${allTracksSnapshot.size}`);

        allTracksSnapshot.forEach((doc) => {
          const data = doc.data();
          addLog(
            `Track: ${data.title} | CreatedBy: ${data.createdBy} | Your UID: ${user.uid}`
          );
        });
      } catch (error) {
        addLog(`Error querying all tracks: ${error}`);
      }
    };

    // Then, try to get tracks for current user
    const testUserTracks = async () => {
      try {
        addLog("Querying tracks for current user...");
        const userTracksQuery = query(
          collection(db, "tracks"),
          where("createdBy", "==", user.uid)
        );
        const userTracksSnapshot = await getDocs(userTracksQuery);
        addLog(`User tracks found: ${userTracksSnapshot.size}`);

        userTracksSnapshot.forEach((doc) => {
          const data = doc.data();
          addLog(`User track: ${data.title} | Genre: ${data.genre}`);
        });
      } catch (error) {
        addLog(`Error querying user tracks: ${error}`);
      }
    };

    testAllTracks().then(() => testUserTracks());
  }, [user]);

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <h3 className="font-bold">Track Debug - Not logged in</h3>
        <p>Please log in to debug tracks</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Track Debug Info</h3>
      <div className="text-sm space-y-1">
        {debugInfo.map((info, index) => (
          <div key={index} className="font-mono">
            {info}
          </div>
        ))}
      </div>
    </div>
  );
}
