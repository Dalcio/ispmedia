"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CardProps {
  id: number;
  title: string;
  artist: string;
  type: string;
  cover: string;
}

export default function Card({ id, title, artist, type, cover }: CardProps) {
  return (
    <Link href={`/media/${id}`}>
      <motion.div whileHover={{ y: -5 }} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl mb-4">
          <img
            src={cover}
            alt={title}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <button className="bg-[#FDC500] text-black p-3 rounded-full">
              ▶
            </button>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm">{artist}</p>
        <span className="text-xs text-zinc-500 capitalize">{type}</span>
      </motion.div>
    </Link>
  );
}
