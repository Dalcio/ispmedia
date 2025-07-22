"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ReviewBoxProps {
  mediaId: string;
}

export default function ReviewBox({ mediaId }: ReviewBoxProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Avaliações</h2>

      {/* Add Review */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-primary" : "text-zinc-600"
              }`}
            >
              ★
            </motion.button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escreva sua avaliação..."
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#FDC500]/50 outline-none resize-none h-24"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3 bg-[#FDC500] text-black px-6 py-2 rounded-full font-medium"
        >
          Publicar
        </motion.button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
              <span className="font-medium">Usuário {i}</span>
              <div className="flex gap-0.5 ml-auto">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= 4 ? "text-primary" : "text-zinc-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
