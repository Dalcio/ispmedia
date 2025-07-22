"use client";

import { useState } from "react";
import { Play, Search, Music, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/modals/auth-modal";
import { SearchModal } from "@/components/modals/search-modal";

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-white">ISPmedia</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setSearchModalOpen(true)}
            className="text-white/80"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
          <Button onClick={() => setAuthModalOpen(true)}>Entrar</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Sua música, <span className="text-primary">em qualquer lugar</span>
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Milhares de músicas, artistas e playlists esperando por você
          </p>
          <Button size="lg" onClick={() => setAuthModalOpen(true)}>
            <Play className="h-5 w-5 mr-2" />
            Começar agora
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={Music}
            title="Catálogo Infinito"
            description="Milhares de músicas de todos os gêneros"
          />
          <FeatureCard
            icon={Users}
            title="Artistas Verificados"
            description="Siga seus artistas favoritos"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Trending"
            description="Descubra as músicas do momento"
          />
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
      <Icon className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
}
