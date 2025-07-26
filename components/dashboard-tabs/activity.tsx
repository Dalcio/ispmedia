"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useAtividade } from "@/hooks/use-atividade";
import { Atividade, TipoAcao } from "@/lib/types/atividade";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Play,
  Pause,
  SkipForward,
  Heart,
  HeartOff,
  ListPlus,
  Calendar,
  Filter,
  RefreshCw,
  Upload,
} from "lucide-react";

/**
 * Componente para exibir atividades do usuário no dashboard
 * Segue os padrões de design e estrutura das outras seções
 */

export function ActivitySection() {
  const { user } = useAuth();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [filtroAcao, setFiltroAcao] = useState<TipoAcao | "todas">("todas");
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [lastDocumentId, setLastDocumentId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  // Track title mapping state (must be after atividades is declared)
  const [trackTitles, setTrackTitles] = useState<Record<string, string | null>>(
    {}
  );
  const prevIdsRef = useRef<string[]>([]);
  useEffect(() => {
    const uniqueIds = Array.from(new Set(atividades.map((a) => a.midiaId)));
    // Only fetch if IDs changed
    if (JSON.stringify(prevIdsRef.current) === JSON.stringify(uniqueIds))
      return;
    prevIdsRef.current = uniqueIds;
    let cancelled = false;
    async function fetchAllTitles() {
      const { getTrackTitleById } = await import("@/lib/get-track-title");
      const entries = await Promise.all(
        uniqueIds.map(async (id) => [id, await getTrackTitleById(id)])
      );
      if (!cancelled) {
        setTrackTitles(Object.fromEntries(entries));
      }
    }
    if (uniqueIds.length > 0) fetchAllTitles();
    return () => {
      cancelled = true;
    };
  }, [atividades]);

  const {
    loading,
    error,
    buscarAtividades,
    registrarReproducao,
    registrarCurtida,
  } = useAtividade();

  // Carregar atividades quando o componente montar ou filtro mudar
  useEffect(() => {
    const carregarAtividades = async () => {
      if (!user?.uid) return;

      try {
        const filtros = filtroAcao !== "todas" ? { acao: filtroAcao } : {};
        const resultado = await buscarAtividades(user.uid, {
          limit: 20,
          ...filtros,
        });

        setAtividades(resultado.atividades);
        setLastDocumentId(resultado.lastDocumentId);
        setHasMore(resultado.hasMore);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    };

    carregarAtividades();
  }, [user?.uid, filtroAcao, buscarAtividades]);

  // Carregar mais atividades (paginação)
  const carregarMaisAtividades = async () => {
    if (!user?.uid || !lastDocumentId || carregandoMais) return;

    setCarregandoMais(true);
    try {
      const filtros = filtroAcao !== "todas" ? { acao: filtroAcao } : {};
      const resultado = await buscarAtividades(user.uid, {
        limit: 20,
        startAfter: lastDocumentId,
        ...filtros,
      });

      setAtividades((prev) => [...prev, ...resultado.atividades]);
      setLastDocumentId(resultado.lastDocumentId);
      setHasMore(resultado.hasMore);
    } catch (error) {
      console.error("Erro ao carregar mais atividades:", error);
    } finally {
      setCarregandoMais(false);
    }
  };

  // Exemplo de ação rápida - registrar uma reprodução de exemplo
  const handleExemploReproducao = async () => {
    if (!user?.uid) return;

    try {
      await registrarReproducao(user.uid, `exemplo-music-${Date.now()}`);
      // Recarregar atividades
      const resultado = await buscarAtividades(user.uid, { limit: 20 });
      setAtividades(resultado.atividades);
      setLastDocumentId(resultado.lastDocumentId);
      setHasMore(resultado.hasMore);
    } catch (error) {
      console.error("Erro ao registrar exemplo:", error);
    }
  };
  // Formatação da ação para exibição
  const formatarAcao = (acao: TipoAcao) => {
    const acoes: Record<TipoAcao, { label: string; icon: any; color: string }> =
      {
        ouviu: { label: "Reproduziu", icon: Play, color: "text-green-600" },
        pausou: { label: "Pausou", icon: Pause, color: "text-yellow-600" },
        pulou: { label: "Pulou", icon: SkipForward, color: "text-blue-600" },
        curtiu: { label: "Curtiu", icon: Heart, color: "text-red-600" },
        descurtiu: {
          label: "Descurtiu",
          icon: HeartOff,
          color: "text-gray-600",
        },
        adicionou_playlist: {
          label: "Adicionou à playlist",
          icon: ListPlus,
          color: "text-purple-600",
        },
        upload: { label: "Fez upload", icon: Upload, color: "text-green-500" },
        editou: { label: "Editou", icon: Activity, color: "text-blue-500" },
        deletou: { label: "Deletou", icon: Activity, color: "text-red-500" },
      };
    return acoes[acao];
  };

  // Formatação de data relativa
  const formatarDataRelativa = (timestamp: string) => {
    const agora = new Date();
    const data = new Date(timestamp);
    const diffMs = agora.getTime() - data.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMinutos < 1) return "Agora";
    if (diffMinutos < 60) return `${diffMinutos}m atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias < 7) return `${diffDias}d atrás`;

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };
  const filtrosDisponiveis: Array<{
    value: TipoAcao | "todas";
    label: string;
  }> = [
    { value: "todas", label: "Todas" },
    { value: "ouviu", label: "Reproduções" },
    { value: "curtiu", label: "Curtidas" },
    { value: "pausou", label: "Pausas" },
    { value: "pulou", label: "Pulos" },
    { value: "adicionou_playlist", label: "Playlists" },
    { value: "upload", label: "Uploads" },
  ];

  if (!user) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
        <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Faça login para ver suas atividades
        </h3>
        <p className="text-neutral-500 text-sm">
          Suas interações com músicas aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-700">
        <Activity className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        <div>
          <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            Histórico de Atividades
          </h3>
          <p className="text-sm text-neutral-500">
            Suas interações recentes com músicas
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="space-y-3">
        {/* Filtros */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={filtroAcao}
            onChange={(e) =>
              setFiltroAcao(e.target.value as TipoAcao | "todas")
            }
            className="text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {filtrosDisponiveis.map((filtro) => (
              <option key={filtro.value} value={filtro.value}>
                {filtro.label}
              </option>
            ))}
          </select>
        </div>

        {/* Card de exemplo removido */}
      </div>

      {/* Lista de atividades */}
      <div className="space-y-2">
        {loading && atividades.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 animate-spin text-neutral-400 mr-2" />
            <span className="text-sm text-neutral-500">
              Carregando atividades...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-sm mb-2">❌ {error}</div>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="ghost"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Tentar novamente
            </Button>
          </div>
        ) : atividades.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            <h4 className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Nenhuma atividade encontrada
            </h4>
            <p className="text-sm text-neutral-500">
              Suas interações com músicas aparecerão aqui
            </p>
          </div>
        ) : (
          <>
            {/* Títulos das músicas por ID - hooks no topo do componente */}
            {/* useState/useEffect moved to top-level to follow Rules of Hooks */}
            {atividades.map((atividade) => {
              const acaoInfo = formatarAcao(atividade.acao);
              const IconeAcao = acaoInfo.icon;
              const trackTitle = trackTitles[atividade.midiaId];
              return (
                <div
                  key={atividade.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full bg-white dark:bg-neutral-900 ${acaoInfo.color}`}
                  >
                    <IconeAcao className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {acaoInfo.label}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {formatarDataRelativa(atividade.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      Mídia: {trackTitle ? trackTitle : atividade.midiaId}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Botão carregar mais */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  onClick={carregarMaisAtividades}
                  disabled={carregandoMais}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-600 dark:text-neutral-400"
                >
                  {carregandoMais ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Carregar mais"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Informações da seção */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 text-center">
          Total de atividades: {atividades.length}
          {filtroAcao !== "todas" &&
            ` (filtrado por ${filtrosDisponiveis
              .find((f) => f.value === filtroAcao)
              ?.label.toLowerCase()})`}
        </p>
      </div>
    </div>
  );
}
