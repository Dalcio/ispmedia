"use client";

import { useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { SearchModal } from "@/components/modals/search-modal";
import { Button } from "@/components/ui/button";

interface Track {
  id: string;
  title: string;
  genre: string;
  createdBy: string;
  isPublic: boolean;
}

export default function TestPublicSearchPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [publicTracks, setPublicTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const testPublicTracksAccess = async () => {
    setLoading(true);
    try {
      console.log("🔍 Testing unauthenticated access to public tracks...");
      
      const tracksRef = collection(db, "tracks");
      const publicTracksQuery = query(
        tracksRef,
        where("isPublic", "==", true),
        limit(10)
      );
      
      const snapshot = await getDocs(publicTracksQuery);
      
      const tracks: Track[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tracks.push({
          id: doc.id,
          title: data.title,
          genre: data.genre,
          createdBy: data.createdBy,
          isPublic: data.isPublic,
        });
      });
      
      setPublicTracks(tracks);
      console.log("✅ Successfully retrieved public tracks:", tracks);
    } catch (error) {
      console.error("❌ Error accessing public tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Test Public Music Search</h1>
          <p className="text-white/60 mb-8">
            This page tests unauthenticated access to public tracks and the search functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Search Modal */}
          <div className="bg-glass-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Search Modal Test</h2>
            <p className="text-white/60 mb-4">
              Test the search modal without authentication. It should only show public tracks.
            </p>
            <Button
              onClick={() => setIsSearchOpen(true)}
              className="w-full"
            >
              Open Search Modal
            </Button>
          </div>

          {/* Test Direct Firestore Query */}
          <div className="bg-glass-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Direct Query Test</h2>
            <p className="text-white/60 mb-4">
              Test direct Firestore query for public tracks without authentication.
            </p>
            <Button
              onClick={testPublicTracksAccess}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Test Public Tracks Query"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {publicTracks.length > 0 && (
          <div className="bg-glass-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Public Tracks Found ({publicTracks.length})
            </h2>
            <div className="space-y-3">
              {publicTracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-glass-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-white/60 text-sm">{track.genre}</p>
                  </div>
                  <div className="text-xs text-white/40">
                    <div>ID: {track.id}</div>
                    <div>Public: {track.isPublic ? "Yes" : "No"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-glass-100 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <div className="space-y-3 text-white/80">
            <p>1. Make sure you are logged out of the application</p>
            <p>2. Use the "Open Search Modal" button to test search functionality</p>
            <p>3. Try searching for track names or genres</p>
            <p>4. Only public tracks should be visible</p>
            <p>5. Use "Test Public Tracks Query" to see what public tracks are available</p>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
