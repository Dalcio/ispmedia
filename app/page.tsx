"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { motion } from "framer-motion";
import { Music, Users, Star, Headphones } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [featuredMedia] = useState([
    {
      id: 1,
      title: "Sunset Dreams",
      artist: "Luna Silva",
      type: "album",
      cover: "/api/placeholder/300/300",
    },
    {
      id: 2,
      title: "Electric Nights",
      artist: "The Neons",
      type: "album",
      cover: "/api/placeholder/300/300",
    },
    {
      id: 3,
      title: "Acoustic Sessions",
      artist: "Maria Santos",
      type: "album",
      cover: "/api/placeholder/300/300",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-medium to-dark">
      {/* Header */}
      <header className="glass-navigation p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-2xl font-bold text-primary">ISPmedia</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Explorar
            </Link>
            <Link href="/auth/login" className="glass-button-secondary">
              Entrar
            </Link>
            <Link href="/auth/register" className="glass-button">
              Registrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[70vh] flex items-center justify-center mb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 gradient-primary opacity-30"></div>
        </div>

        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            ISP<span className="text-primary">media</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            Descubra, ouça e compartilhe música nova
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FDC500] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#FDC500]/90 primary-glow"
          >
            Começar a Explorar
          </motion.button>
        </div>
      </motion.section>

      {/* Featured Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card {...item} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Tendências</h2>
        <div className="glass rounded-2xl p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl glass-hover cursor-pointer"
              >
                <span className="text-2xl font-bold text-zinc-600 w-8">
                  {i}
                </span>
                <img
                  src="/api/placeholder/60/60"
                  alt=""
                  className="w-14 h-14 rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">Nome da Música {i}</h3>
                  <p className="text-sm text-zinc-400">Artista {i}</p>
                </div>
                <span className="text-primary">▶</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-dark" />
            </div>
            <span className="text-xl font-bold text-primary">ISPmedia</span>
          </div>
          <p className="text-text-tertiary">
            © 2025 ISPmedia. Projeto Escolar - Plataforma de Streaming Musical.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-card-hover p-6 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
