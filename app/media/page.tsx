"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { motion } from "framer-motion";

export default function MediaPage() {
  const [filter, setFilter] = useState("all");
  const [media] = useState([
    {
      id: 1,
      title: "Album 1",
      artist: "Artist 1",
      type: "album",
      cover: "/api/placeholder/300/300",
    },
    {
      id: 2,
      title: "Track 1",
      artist: "Artist 2",
      type: "track",
      cover: "/api/placeholder/300/300",
    },
    {
      id: 3,
      title: "Album 2",
      artist: "Artist 3",
      type: "album",
      cover: "/api/placeholder/300/300",
    },
    {
      id: 4,
      title: "Track 2",
      artist: "Artist 4",
      type: "track",
      cover: "/api/placeholder/300/300",
    },
  ]);

  const filteredMedia =
    filter === "all" ? media : media.filter((m) => m.type === filter);

  return (
    <div className="container mx-auto px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-6">Explorar Música</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {["all", "album", "track", "artist"].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-medium capitalize ${
                filter === f ? "bg-[#FDC500] text-black" : "glass glass-hover"
              }`}
            >
              {f === "all"
                ? "Todos"
                : f === "album"
                ? "Álbuns"
                : f === "track"
                ? "Faixas"
                : "Artistas"}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMedia.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card {...item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
