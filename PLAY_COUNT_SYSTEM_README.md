# Sistema de Contagem de Visualizações - ISPmedia

## ✅ Implementação Concluída

### Backend

- **API Route**: `/api/plays/[trackId]/route.ts`
  - `POST /api/plays/:trackId` - Incrementa contador de plays usando `increment(1)`
  - `GET /api/plays/:trackId` - Retorna contador atual de plays
  - Atualiza campo `lastPlayedAt` para tracking temporal
  - Validação de trackId e tratamento de erros

### Frontend

#### Hooks

- **`use-play-count.ts`** - Gerencia operações de contagem de plays
  - `incrementPlayCount()` - Chama API para incrementar contador
  - `getPlayCount()` - Busca contador atual
  - Tratamento de erros silencioso (não falha se API estiver indisponível)

#### Componentes

- **`PlayCountDisplay`** - Componente simples para exibir contagem

  - Formatação inteligente (K, M para números grandes)
  - Animação visual quando contador é atualizado
  - Tamanhos configuráveis (sm, md, lg)

- **`TrackStats`** - Componente avançado combinando plays + histórico
  - Contagem de plays com animação
  - Trend de plays recentes (últimas 24h)
  - Última reprodução (quando disponível)
  - Integração com sistema de atividades

#### Integração com Player

- **Contexto Global de Áudio** atualizado para usar nova API
- Incremento automático quando música começa a tocar
- Eventos globais (`playCountUpdated`) para atualização em tempo real
- Log detalhado para debug

### Funcionalidades

#### ✅ Contagem Automática

- Incremento quando música inicia reprodução
- API RESTful para operações de contagem
- Persistência no Firestore com transações atômicas

#### ✅ Exibição Visual

- Contador formatado (1K, 1.5M, etc.)
- Animação quando contador é atualizado
- Ícone de play consistente com design system

#### ✅ Integração com Histórico

- Combina contagem total com atividade recente
- Exibe trend de plays das últimas 24h
- Mostra tempo da última reprodução

#### ✅ Tempo Real

- Atualização imediata na UI quando música é tocada
- Eventos globais para sincronização entre componentes
- Fallback gracioso se API não responder

### Estrutura de Dados

```typescript
interface PlayCountResponse {
  trackId: string;
  playCount: number;
  success: boolean;
}

interface Track {
  id: string;
  title: string;
  // ...outros campos...
  playCount?: number;
  lastPlayedAt?: Date;
}
```

### Como Usar

#### Exibir Contador Simples

```tsx
<PlayCountDisplay
  trackId={track.id}
  initialCount={track.playCount || 0}
  size="sm"
/>
```

#### Exibir Estatísticas Completas

```tsx
<TrackStats
  trackId={track.id}
  initialPlayCount={track.playCount || 0}
  showTrend={true}
  showLastPlayed={true}
  size="md"
/>
```

### Performance

- Incremento não bloqueia reprodução da música
- Cache local para evitar requests desnecessários
- Formatação otimizada para números grandes
- Eventos globais evitam polling desnecessário

### Localizações no Código

- **API**: `app/api/plays/[trackId]/route.ts`
- **Hook**: `hooks/use-play-count.ts`
- **Componentes**: `components/ui/play-count-display.tsx`, `components/ui/track-stats.tsx`
- **Contexto**: `contexts/global-audio-context.tsx`
- **Integração**: `components/drawers/UserTrackList.tsx`

### Combinação com Sistema de Atividades

O contador de plays trabalha em conjunto com o sistema de atividades existente:

- **Atividade "ouviu"** é registrada quando música inicia
- **Contador de plays** é incrementado simultaneamente
- **TrackStats** combina ambos para estatísticas completas

### Próximos Passos (Sugestões)

- [ ] Analytics de plays por período (dia/semana/mês)
- [ ] Top tracks do usuário baseado em plays
- [ ] Gráficos de evolução de plays
- [ ] Comparação de performance entre tracks
- [ ] Notificações de marcos (100, 1K, 10K plays)
