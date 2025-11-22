
# Plano de Implementação: Hub de Agentes v2.0 (UX & Usabilidade)

Este documento descreve o roteiro técnico para implementar as 10 melhorias de usabilidade sugeridas para o módulo "Agentes de IA", transformando-o em uma ferramenta de produtividade robusta e persistente.

## Status: CONCLUÍDO (Todas as Fases)

---

## 1. Arquitetura de Dados e Persistência

Antes de melhorar a UI, precisamos garantir que os dados sobrevivam ao refresh da página.

### A. Atualização de Tipos (`types.ts`)
Precisamos modelar sessões de chat e preferncias de usuário.

```typescript
// Histórico persistente
export interface ChatSession {
  id: string;
  userId: string;
  agentId: string;
  title: string; // Ex: "Dúvida sobre SEO" (Gerado ou 1ª mensagem)
  messages: ChatMessage[];
  lastUpdated: Date;
  attachedContextId?: string; // ID de um PRD vinculado
}

// Preferências do Usuário para Agentes
export interface UserAgentPrefs {
  favorites: string[]; // IDs dos agentes
  recents: string[];   // IDs dos últimos agentes usados
}
```

### B. Atualização do Database Service (`databaseService.ts`)
Adicionar métodos para lidar com sessões de chat.
*   `saveChatSession(session: ChatSession)`
*   `getChatSessions(userId: string, agentId?: string)`
*   `toggleFavoriteAgent(userId: string, agentId: string)`

---

## 2. Detalhamento das Fases de Implementação

### Fase 1: Persistência e Histórico (Core) - [FEITO]
**Objetivo:** Permitir que conversas sejam salvas e retomadas.
*   **Backend Simulado:** Implementar métodos CRUD para `ChatSession` no `databaseService`.
*   **UI (AgentHub):** Ao abrir um agente, carregar o histórico do banco em vez de iniciar vazio.
*   **UI (Sidebar do Chat):** Adicionar um menu lateral dentro do Chat para "Histórico de Conversas" deste agente.

### Fase 2: Integração de Contexto ("Attach Document") - [FEITO]
**Objetivo:** Permitir que o agente "leia" um PRD existente.
*   **UI (ChatDrawer):** Adicionar botão "clip" (📎) ao lado do input.
*   **Fluxo:**
    1.  Ao clicar, abre um modal listando os PRDs do usuário.
    2.  Ao selecionar, o conteúdo do PRD é injetado como "Contexto de Sistema" oculto na próxima mensagem.
    3.  Exibir um "Chip" visual: `[Doc: Uber para Pets] x`.

### Fase 3: UX do Chat (Imersão e Produtividade) - [FEITO]
**Objetivo:** Melhorar a experiência de digitação e leitura.
*   **Full Screen:** Adicionar botão de expansão no header do ChatDrawer.
*   **Image Upload:**
    *   Adicionar suporte a drag-and-drop ou colar (Ctrl+V) imagens.
    *   *Lógica:* Se a imagem for enviada, forçar o uso do modelo `gemini-2.5-flash-image` no backend, independente da configuração de texto, ou usar LLama se suportar multimodal no futuro.
*   **Exportação:**
    *   Adicionar botão "Salvar como Nota" na bolha de resposta da IA.
    *   Isso cria um novo item em "Meus Documentos" (tipo: Snippet/Idea).

### Fase 4: Descoberta e Recomendação (Hub View) - [FEITO]
**Objetivo:** Ajudar o usuário a escolher o agente certo.
*   **Magic Match (Wizard):**
    *   Adicionar botão "Ajude-me a escolher" no topo do Hub.
    *   Modal simples: "O que você precisa fazer?".
    *   Lógica: Enviar input para `geminiService` classificar qual `agentId` é mais adequado e abrir o chat automaticamente.
*   **Favoritos e Recentes:**
    *   Adicionar ícone de estrela (⭐) nos cards.
    *   Criar seção "Acesso Rápido" no topo do grid com os favoritos e os 3 últimos usados.

### Fase 5: Polimento e Micro-interações - [FEITO]
*   **Quick Prompts:**
    *   Melhorar a tela de "Empty State" do chat com um carrossel horizontal de sugestões (Pills).
*   **Status:**
    *   Adicionar "Digitando..." realístico (fake delay ou stream real se possível).
*   **Atalhos:**
    *   `ESC` fecha chat.
    *   `/` foca no input.
    *   `Ctrl+Enter` envia mensagem.

---

## 3. Roteiro Técnico (Tasks)

### Sprint 1: Dados e Chat Básico
1.  [x] Atualizar `types.ts` e `databaseService.ts`.
2.  [x] Refatorar `AgentHub.tsx` para ler/gravar histórico no DB.
3.  [x] Implementar lógica de "Favoritar" no `AgentCard`.

### Sprint 2: Contexto e Arquivos
4.  [x] Criar componente `DocumentSelectorModal`.
5.  [x] Atualizar `ChatDrawer` para gerenciar estado de `selectedDocument`.
6.  [x] Atualizar `geminiService.chatWithSpecialist` para aceitar contexto extra de documentos.

### Sprint 3: Recursos Avançados de UI
7.  [x] Implementar toggle de Full Screen no `ChatDrawer`.
8.  [x] Implementar "Magic Match" (chamada simples de classificação de texto).
9.  [x] Adicionar suporte a paste de imagens (Clipboard API) e conversão Base64.

### Sprint 4: Finalização
10. [x] Adicionar atalhos de teclado (`useEffect` global no Drawer).
11. [x] Implementar botão de Exportar Resposta.
12. [x] Revisão de Design (Tailwind, Sombras, Transições).
