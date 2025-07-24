# 🎵 Playlists Dashboard Tab

Esta seção implementa a aba "Playlists" como uma sessão interna da dashboard (drawer), permitindo ao usuário visualizar, criar, editar e remover playlists diretamente do painel lateral.

## 📁 Estrutura de Arquivos

```
components/dashboard-tabs/playlists/
├── index.ts                 # Exportações centralizadas
├── playlist-section.tsx     # Componente principal da seção
├── playlist-list.tsx        # Lista de playlists do usuário
├── playlist-item.tsx        # Item individual de playlist
└── README.md               # Esta documentação
```

## 🧩 Componentes

### `playlist-section.tsx`
- Componente principal da aba
- Contém o cabeçalho com botão "Nova Playlist"
- Renderiza a lista de playlists
- Gerencia o modal de criação

### `playlist-list.tsx`
- Lista todas as playlists do usuário logado
- Gerencia estados de loading e empty state
- Integra com Firestore para dados em tempo real
- Controla modais de edição e exclusão

### `playlist-item.tsx`
- Renderiza cada playlist individual
- Mostra informações básicas (nome, visibilidade, total de faixas)
- Permite expandir para ver faixas da playlist
- Ações: visualizar, editar, excluir
- Integração com player global para tocar faixas

## 🎨 Funcionalidades

### ✅ Implementadas
- [x] Listar playlists do usuário
- [x] Criar nova playlist
- [x] Editar playlist existente
- [x] Excluir playlist
- [x] Visualizar faixas da playlist (expandir/recolher)
- [x] Tocar faixas diretamente da playlist
- [x] Indicador de visibilidade (pública/privada)
- [x] Loading states e empty states
- [x] Integração com design system
- [x] Responsividade no drawer

### 🔄 Em Desenvolvimento
- [ ] Adicionar faixas à playlist
- [ ] Remover faixas da playlist
- [ ] Reordenar faixas
- [ ] Compartilhar playlist pública
- [ ] Duplicar playlist

## 🔐 Firestore: Estrutura da Coleção

```typescript
// Coleção: playlists
interface Playlist {
  id: string;                    // ID do documento
  title: string;                 // Nome da playlist
  description?: string;          // Descrição opcional
  visibility: 'public' | 'private'; // Visibilidade
  tracks: string[];              // Array de IDs das faixas
  createdBy: string;             // UID do usuário criador
  createdAt: Timestamp;          // Data de criação
  updatedAt?: Timestamp;         // Data da última atualização
}
```

## 🎨 Design System

### Estilo e Layout
- Layout em cards com glassmorphism
- Bordas suaves e efeitos de blur
- Tipografia leve e hierarquia clara
- Cores seguindo o design system do projeto
- Responsivo dentro do drawer

### Componentes UI Utilizados
- `Button` - Ações e navegação
- `Modal` - Criação, edição e confirmações
- `Input` / `Textarea` - Formulários
- Ícones Lucide React
- Sistema de cores personalizado

## 🔗 Integrações

### Dashboard Drawer
- Aba "Playlists" selecionável via tabs na dashboard
- Estado gerenciado por `useDashboardDrawer` hook
- Navegação entre seções preservada

### Global Audio Player
- Integração com `useGlobalAudio` context
- Reprodução de faixas diretamente da playlist
- Controles de playback sincronizados

### Autenticação
- Utiliza `useAuth` context
- Filtragem automática por usuário logado
- Controle de permissões

## 📱 Responsividade

- Mobile-first design
- Adaptação de layout para diferentes tamanhos
- Drawer responsivo
- Touch-friendly para dispositivos móveis

## ⚡ Performance

### Otimizações Implementadas
- Lazy loading de faixas da playlist (só carrega ao expandir)
- Limite de 10 faixas por consulta para performance
- Snapshots em tempo real otimizados
- Estados de loading apropriados

### Considerações Futuras
- Paginação para playlists com muitas faixas
- Cache local para dados frequentemente acessados
- Debounce em buscas (quando implementado)

## 🚀 Como Usar

1. **Navegar para Playlists**: Clique na aba "Minhas Playlists" no dashboard drawer
2. **Criar Playlist**: Clique no botão "+ Nova Playlist"
3. **Visualizar Faixas**: Clique na seta para expandir uma playlist
4. **Tocar Música**: Clique no botão play ao lado de uma faixa
5. **Editar**: Hover sobre uma playlist e clique no ícone de edição
6. **Excluir**: Hover sobre uma playlist e clique no ícone de lixeira

## 🔧 Desenvolvimento

### Adicionando Novas Funcionalidades
1. Implemente a lógica no componente apropriado
2. Atualize as interfaces TypeScript se necessário
3. Adicione testes se aplicável
4. Atualize esta documentação

### Debugging
- Use as ferramentas de dev do Firebase para monitorar consultas
- Console logs estão implementados para debugging
- Estados de erro são tratados com toasts informativos
