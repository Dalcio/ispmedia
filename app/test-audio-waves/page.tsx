"use client";

import { useState } from "react";
import AudioWaves from "@/components/player/audio-waves";
import { Button } from "@/components/ui/button";

export default function AudioWavesTest() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Audio Waves Test</h1>
          <p className="text-white/60 mb-8">
            Test page to verify audio waves component is working properly.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </Button>
            <p className="text-sm text-white/60 mt-2">
              Current state: {isPlaying ? "Playing" : "Paused"}
            </p>
          </div>

          <div className="border-2 border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-center">Audio Waves Component</h3>
            <div className="flex justify-center">
              <AudioWaves isPlaying={isPlaying} className="border border-white/30 rounded-lg" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-white/60">
              The waves should animate when "Playing" and be static when "Paused"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
