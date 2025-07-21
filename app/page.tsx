import { Music, Users, Star, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
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
            <Link href="/search" className="text-text-secondary hover:text-primary transition-colors">
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
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Sua música,
            <span className="text-primary block">sua comunidade</span>
          </h2>
          
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto animate-slide-up">
            Descubra novos artistas, crie playlists incríveis e conecte-se com uma comunidade apaixonada por música.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link href="/auth/register" className="glass-button text-lg px-8 py-4">
              Começar agora
            </Link>
            <Link href="/search" className="glass-button-secondary text-lg px-8 py-4">
              Explorar música
            </Link>
          </div>
        </div>

        {/* Background decorativo */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-16">
            Funcionalidades que você vai amar
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Headphones className="w-8 h-8" />}
              title="Streaming de Qualidade"
              description="Ouça suas músicas favoritas com qualidade superior e sem interrupções."
            />
            
            <FeatureCard
              icon={<Music className="w-8 h-8" />}
              title="Playlists Personalizadas"
              description="Crie e organize suas playlists do seu jeito. Compartilhe com amigos."
            />
            
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Comunidade Musical"
              description="Conecte-se com artistas e outros amantes da música. Descubra novos sons."
            />
            
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Avalie e Critique"
              description="Compartilhe suas opiniões sobre músicas e álbuns. Leia críticas da comunidade."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para começar sua jornada musical?
          </h3>
          <p className="text-xl text-text-secondary mb-8">
            Junte-se a milhares de usuários que já descobriram sua nova música favorita no ISPmedia.
          </p>
          <Link href="/auth/register" className="glass-button text-lg px-8 py-4">
            Criar conta gratuita
          </Link>
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
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
