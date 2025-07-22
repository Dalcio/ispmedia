"use client";

import { useState } from "react";
import Player from "@/components/Player";
import ReviewBox from "@/components/ReviewBox";
import { motion } from "framer-motion";

export default function MediaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="container mx-auto px-4 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Media Info */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src="/api/placeholder/300/300"
                alt="Album Cover"
                className="w-64 h-64 rounded-2xl shadow-2xl animate-float"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">Nome do Álbum</h1>
                <p className="text-xl text-zinc-400 mb-6">Artista</p>
                <div className="flex gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-[#FDC500] text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2 primary-glow"
                  >
                    {isPlaying ? "⏸" : "▶"} Reproduzir
                  </motion.button>
                  <button className="glass glass-hover px-6 py-3 rounded-full">
                    ❤️ Favoritar
                  </button>
                </div>
                <p className="text-zinc-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>

          {/* Player */}
          {isPlaying && <Player />}

          {/* Track List */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Faixas</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl glass-hover cursor-pointer"
                >
                  <span className="text-zinc-500 w-6">{i}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">Faixa {i}</h3>
                  </div>
                  <span className="text-zinc-500">3:45</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-1">
          <ReviewBox mediaId={params.id} />
        </div>
      </motion.div>
    </div>
  );
}
