# Painel de Comandos - ISPmedia

O Painel de Comandos é uma funcionalidade que permite acesso rápido às principais ações da plataforma ISPmedia através de atalhos de teclado e uma interface centralizada.

## 🚀 Como Acessar

### Atalhos de Teclado

- **`Ctrl + K`** (Windows/Linux) ou **`Cmd + K`** (Mac) - Abre o painel de comandos
- Disponível em qualquer página da aplicação quando logado

### Interface

- **Dropdown do usuário** - Opção "Painel de Comandos" no menu do avatar do usuário

## 🎯 Funcionalidades Disponíveis

### Ações Principais

- **Upload de música** (tecla `U`) - Abre o modal de upload
- **Criar playlist** (tecla `P`) - Abre o modal de criação de playlist

### Navegação

- **Abrir dashboard** (tecla `D`) - Abre o painel do usuário
- **Buscar músicas e artistas** (tecla `/`) - Abre o modal de busca
- **Ir para perfil** - Navega para o perfil do usuário

### Atalhos Úteis

- **Fechar modais** (tecla `Esc`) - Fecha todos os modais abertos

## 🔍 Busca no Painel

O painel inclui um campo de busca que permite:

- Filtrar comandos por nome
- Filtrar por descrição
- Filtrar por tecla de atalho

## ⌨️ Navegação por Teclado

- **`↑` / `↓`** - Navegar entre os comandos
- **`Enter`** - Executar o comando selecionado
- **`Esc`** - Fechar o painel
- **Digitação** - Filtrar comandos em tempo real

## 🎨 Interface

- **Design**: Modal centralizado com efeito de vidro fosco
- **Categorização**: Comandos organizados por categorias (Ações, Navegação, Atalhos)
- **Ícones**: Cada comando possui um ícone representativo
- **Responsivo**: Interface adaptada para diferentes tamanhos de tela

## 🔧 Implementação Técnica

### Componentes

- `CommandPalette` - Componente principal do modal
- `useCommandPalette` - Hook para gerenciar o estado do painel
- `shortcuts.ts` - Definições dos comandos e ações

### Integração

- Integrado ao `GlobalKeyboardShortcuts` para atalhos globais
- Conectado ao `Header` através do dropdown do usuário
- Utiliza hooks existentes da aplicação (upload, dashboard, busca)

### Estrutura de Dados

```typescript
interface ShortcutAction {
  key: string; // Tecla de atalho
  label: string; // Nome do comando
  description: string; // Descrição detalhada
  icon: LucideIcon; // Ícone do comando
  action: () => void; // Função a ser executada
  category: string; // Categoria do comando
}
```

## 🚀 Próximos Passos

- [ ] Adicionar mais comandos conforme novas funcionalidades
- [ ] Implementar histórico de comandos utilizados
- [ ] Adicionar comandos personalizáveis pelo usuário
- [ ] Incluir atalhos para navegação direta entre páginas
- [ ] Integrar com sistema de busca global
