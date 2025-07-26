# Sistema de Registro de Atividades do Usuário

Este sistema permite registrar e consultar as atividades dos usuários com as mídias da plataforma, criando um histórico detalhado de reprodução e interações.

## 📋 Funcionalidades

- Registro de atividades (reprodução, pausa, curtidas, etc.)
- Consulta de histórico por usuário
- Filtros por tipo de ação
- Paginação de resultados
- Validação de dados
- Tratamento de erros

## 🛠 APIs Disponíveis

### POST /api/atividade

Registra uma nova atividade do usuário.

**Corpo da requisição:**

```json
{
  "userId": "string",
  "midiaId": "string",
  "acao": "ouviu" | "pausou" | "pulou" | "curtiu" | "descurtiu" | "adicionou_playlist",
  "timestamp": "2024-07-25T10:30:00.000Z"
}
```

**Resposta de sucesso (201):**

```json
{
  "success": true,
  "id": "documento_id",
  "message": "Atividade registrada com sucesso"
}
```

### GET /api/atividade/[userId]

Lista todas as atividades de um usuário específico.

**Parâmetros de query (opcionais):**

- `limit`: número máximo de resultados (1-100, padrão: 50)
- `acao`: filtrar por tipo de ação específica
- `startAfter`: ID do documento para paginação

**Exemplo de URL:**

```
GET /api/atividade/user123?limit=20&acao=ouviu&startAfter=doc_id
```

**Resposta de sucesso (200):**

```json
{
  "atividades": [
    {
      "id": "doc_id",
      "userId": "user123",
      "midiaId": "music456",
      "acao": "ouviu",
      "timestamp": "2024-07-25T10:30:00.000Z",
      "createdAt": "2024-07-25T10:30:01.000Z"
    }
  ],
  "total": 1,
  "hasMore": false,
  "lastDocumentId": "doc_id",
  "filtros": {
    "limit": 20,
    "acao": "ouviu",
    "startAfter": "doc_id"
  }
}
```

## 🎯 Tipos de Ações Suportadas

| Ação                 | Descrição                                 |
| -------------------- | ----------------------------------------- |
| `ouviu`              | Usuário reproduziu a música completamente |
| `pausou`             | Usuário pausou a reprodução               |
| `pulou`              | Usuário pulou para próxima música         |
| `curtiu`             | Usuário curtiu a música                   |
| `descurtiu`          | Usuário descurtiu a música                |
| `adicionou_playlist` | Usuário adicionou música a uma playlist   |

## 🧩 Uso no Frontend

### Usando o AtividadeService

```typescript
import { atividadeService } from "@/lib/atividade-service";

// Registrar que o usuário ouviu uma música
await atividadeService.registrarReproducao("user123", "music456");

// Registrar curtida
await atividadeService.registrarCurtida("user123", "music456");

// Listar atividades do usuário
const atividades = await atividadeService.listarAtividades("user123", {
  limit: 20,
  acao: "ouviu",
});

// Registrar atividade customizada
await atividadeService.registrarAtividade({
  userId: "user123",
  midiaId: "music456",
  acao: "pausou",
  timestamp: new Date().toISOString(),
});
```

### Integração com Player de Áudio

```typescript
// No componente do player
const handlePlayStart = async (musicId: string) => {
  if (user?.id) {
    try {
      await atividadeService.registrarReproducao(user.id, musicId);
    } catch (error) {
      console.error("Erro ao registrar reprodução:", error);
    }
  }
};

const handlePause = async (musicId: string) => {
  if (user?.id) {
    try {
      await atividadeService.registrarPausa(user.id, musicId);
    } catch (error) {
      console.error("Erro ao registrar pausa:", error);
    }
  }
};
```

## 🗄️ Estrutura no Firestore

Os dados são organizados da seguinte forma:

```
atividades/
  └── {userId}/
      └── historico/
          ├── {documentId1}
          ├── {documentId2}
          └── ...
```

**Estrutura do documento:**

```typescript
{
  userId: string;
  midiaId: string;
  acao: TipoAcao;
  timestamp: Timestamp; // Momento da ação
  createdAt: Timestamp; // Momento do registro
}
```

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias

Para o Firebase Admin SDK funcionar, adicione ao `.env.local`:

```env
# Firebase Admin SDK
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@project-id.iam.gserviceaccount.com"

# Firebase Client (já configurado)
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
```

### Como obter as credenciais:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Vá em **Configurações do projeto** > **Contas de serviço**
3. Clique em **Gerar nova chave privada**
4. Baixe o arquivo JSON e extraia as informações necessárias

## 🔒 Segurança

- As APIs validam todos os dados obrigatórios
- Timestamps são validados no formato ISO 8601
- Tipos de ação são validados contra lista permitida
- Limite máximo de 100 resultados por consulta
- Tratamento de erros para IDs inválidos

## 🚀 Exemplo de Uso Completo

```typescript
import { useAuth } from "@/contexts/auth-context";
import { atividadeService } from "@/lib/atividade-service";
import { useEffect, useState } from "react";

export function HistoricoUsuario() {
  const { user } = useAuth();
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (user?.id) {
        try {
          const resultado = await atividadeService.listarAtividades(user.id, {
            limit: 50,
          });
          setAtividades(resultado.atividades);
        } catch (error) {
          console.error("Erro ao carregar histórico:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    carregarHistorico();
  }, [user]);

  const handleCurtir = async (musicId: string) => {
    if (user?.id) {
      try {
        await atividadeService.registrarCurtida(user.id, musicId);
        // Atualizar UI conforme necessário
      } catch (error) {
        console.error("Erro ao curtir música:", error);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Histórico de Atividades</h2>
      {atividades.map((atividade) => (
        <div key={atividade.id}>
          <p>
            {atividade.acao} - {atividade.midiaId}
          </p>
          <small>{new Date(atividade.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
```

## 📊 Análise de Dados

Com este sistema, você pode facilmente:

- Identificar as músicas mais ouvidas
- Analisar padrões de escuta dos usuários
- Criar recomendações baseadas no histórico
- Gerar relatórios de engajamento
- Implementar funcionalidades de "Recently Played"
