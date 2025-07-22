"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Player() {
  const [progress, setProgress] = useState(30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/api/placeholder/60/60"
          alt=""
          className="w-14 h-14 rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold">Nome da Música</h3>
          <p className="text-sm text-zinc-400">Artista</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#FDC500] rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button className="text-2xl hover:text-primary">⏮</button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-[#FDC500] text-black w-12 h-12 rounded-full flex items-center justify-center text-xl"
          >
            ⏸
          </motion.button>
          <button className="text-2xl hover:text-primary">⏭</button>
        </div>
      </div>
    </motion.div>
  );
}
