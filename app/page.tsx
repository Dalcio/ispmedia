"use client";

import { useState } from "react";
import {
  Search,
  Music,
  Users,
  TrendingUp,
  Sparkles,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/ui-button";
import { AuthModal } from "@/components/modals/auth-modal";
import { SearchModal } from "@/components/modals/search-modal";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <main className="container px-6 py-16">
        {/* Hero Content */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Streaming de música inteligente
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Sua música, <span className="text-gradient">em qualquer lugar</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Descubra milhões de músicas, crie playlists incríveis e conecte-se
            com seus artistas favoritos em uma experiência única de streaming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setSearchModalOpen(true)}
              className="btn-primary cursor-hover text-lg px-8 py-4 h-auto"
            >
              <Search className="h-6 w-6 mr-3" />
              Explorar Música
            </Button>

            {!user && (
              <Button
                onClick={() => setAuthModalOpen(true)}
                variant="ghost"
                className="cursor-hover text-lg px-8 py-4 h-auto"
              >
                Criar Conta Grátis
              </Button>
            )}
          </div>
        </div>
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={Music}
            title="Catálogo Infinito"
            description="Milhões de músicas de todos os gêneros e épocas, sempre em alta qualidade"
            accent="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={Users}
            title="Artistas Verificados"
            description="Siga seus artistas favoritos e descubra novos talentos com facilidade"
            accent="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Trending & Descobertas"
            description="Fique por dentro das músicas do momento e receba recomendações personalizadas"
            accent="from-orange-500 to-red-500"
          />
        </div>
        {/* Stats Section */}
        <div className="glass-card p-8 md:p-12 text-center rounded-3xl mb-20">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Junte-se à nossa comunidade musical
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">10M+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Músicas disponíveis
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">500K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Usuários ativos
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Playlists criadas
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Junte-se à nossa comunidade e compartilhe sua música com o mundo.
            </p>
            {!user && (
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="btn-primary text-lg px-8 py-4 h-auto"
              >
                <Heart className="h-5 w-5 mr-2" />
                Comece sua jornada musical hoje
              </Button>
            )}
          </div>
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
  accent,
}: {
  icon: any;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="glass-card p-8 rounded-2xl group hover:scale-105 transition-all duration-300 relative overflow-hidden cursor-hover">
      {/* Background accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${accent} opacity-10 rounded-full -translate-y-8 translate-x-8`}
      ></div>

      <div
        className={`w-14 h-14 bg-gradient-to-br ${accent} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
