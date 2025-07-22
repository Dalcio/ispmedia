'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Music, Play, Heart, TrendingUp, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, userProfile, loading, isAuthenticated } = useRequireAuth();
  const { signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      router.push('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-200 dark:from-background-900 dark:via-background-800 dark:to-background-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-center text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-200 dark:from-background-900 dark:via-background-800 dark:to-background-900">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50 px-6 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ISP<span className="text-gradient">media</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-900 dark:text-white font-medium">
                {userProfile?.name || user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="cursor-hover"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo de volta, {userProfile?.name?.split(' ')[0] || 'Usuário'}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Pronto para descobrir novas músicas hoje?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl cursor-hover hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Continuar Ouvindo
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Retome suas músicas favoritas
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl cursor-hover hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Suas Curtidas
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Músicas que você adorou
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl cursor-hover hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Descobrir
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Novas músicas para você
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Atividade Recente
          </h3>
          
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Você ainda não tem atividade recente
            </p>
            <Button className="cursor-hover">
              <Play className="h-5 w-5 mr-2" />
              Explorar Músicas
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="glass-card p-6 rounded-2xl mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informações da Conta
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Nome:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {userProfile?.name || 'Não informado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Email:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {user?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Membro desde:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {userProfile?.createdAt ? 
                  new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('pt-BR') 
                  : 'Recente'
                }
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-white/10">
            <Button variant="outline" className="cursor-hover">
              <Settings className="h-5 w-5 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
