import { HistoricoAtividade } from "../../components/debug/historico-atividade";
import { ExemploPlayerComAtividades } from "../../components/player/player-atividade-integration";

/**
 * Página de teste para o sistema de atividades
 * Acesse em: /test-atividade
 */
export default function TestAtividadePage() {
  // ID de usuário de exemplo para teste
  // Em produção, isso viria do contexto de autenticação
  const userIdTeste = "usuario-teste-123";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Atividades - Teste
            </h1>
            <div className="prose text-gray-600">
              <p>
                Esta página demonstra o funcionamento do sistema de registro de
                atividades do usuário. O sistema permite rastrear todas as
                interações dos usuários com as mídias da plataforma.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Funcionalidades demonstradas:
                </h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>Registro de atividades (reprodução, curtida, etc.)</li>
                  <li>Consulta de histórico por usuário</li>
                  <li>Filtros por tipo de ação</li>
                  <li>Interface responsiva e amigável</li>
                  <li>Tratamento de estados de carregamento e erro</li>
                </ul>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  <strong>Nota:</strong> Esta é uma página de teste. O ID do
                  usuário usado é fictício:
                  <code className="bg-yellow-200 px-2 py-1 rounded">
                    {userIdTeste}
                  </code>
                </p>
              </div>
            </div>
          </div>{" "}
          {/* Componente de histórico de atividades */}
          <HistoricoAtividade userId={userIdTeste} />
          {/* Exemplo de player com rastreamento */}
          <div className="mt-8">
            <ExemploPlayerComAtividades />
          </div>
          {/* Informações técnicas */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informações Técnicas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  APIs Implementadas
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <code>POST /api/atividade</code> - Registra atividade
                  </li>
                  <li>
                    • <code>GET /api/atividade/[userId]</code> - Lista
                    atividades
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Armazenamento
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Firestore (Firebase)</li>
                  <li>
                    • Coleção: <code>atividades/[userId]/historico</code>
                  </li>
                  <li>• Firebase Admin SDK</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Tipos de Ação
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ouviu, pausou, pulou</li>
                  <li>• curtiu, descurtiu</li>
                  <li>• adicionou_playlist</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recursos</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Validação de dados</li>
                  <li>• Paginação</li>
                  <li>• Filtros por ação</li>
                  <li>• Tratamento de erros</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
