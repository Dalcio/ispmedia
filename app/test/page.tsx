"use client";

import FirebaseTest from "@/components/firebase-test";
import AudioPlayerDemo from "@/components/player/audio-player-demo";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 to-background-200 dark:from-background-900 dark:to-background-800 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Audio Player Demo */}
        <section>
          <AudioPlayerDemo />
        </section>

        {/* Firebase Test */}
        <section>
          <FirebaseTest />
        </section>
      </div>
    </div>
  );
}
