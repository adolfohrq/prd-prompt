# Plano de Implementação: Hub de Agentes de IA

Este documento detalha o roteiro técnico para a criação da nova página "Agentes de IA" (Agents Hub), integrando-a ao sistema existente `PRD-Prompt.ai`.

## 1. Visão Geral e Arquitetura

O objetivo é criar uma biblioteca visual de agentes especializados, onde o usuário possa navegar, filtrar e iniciar sessões de chat com personas específicas (Landing Page Expert, SEO Expert, etc.).

### Mudanças Arquiteturais Necessárias
1.  **Generalização do Chat:** O sistema de chat atual (`ChatDrawer`/`geminiService`) é fortemente acoplado às personas do PRD (`pm`, `ux`, `db`). Precisaremos refatorar levemente para aceitar uma "Persona Dinâmica" ou "Custom Agent".
2.  **Estrutura de Dados:** Criação de um catálogo estático (em `constants.ts`) contendo as definições, competências e instruções de sistema de cada agente listado em `pageagents.md`.
3.  **Nova View:** Criação de `views/AgentHub.tsx`.

---

## 2. Fases de Implementação

### Fase 1: Modelagem de Dados e Tipagem
**Objetivo:** Definir a estrutura dos agentes e popular o catálogo.

1.  **Atualizar `types.ts`:**
    *   Adicionar interface `SpecialistAgent`:
        ```typescript
        export interface SpecialistAgent {
            id: string;
            name: string;
            role: string; // Ex: "Especialista em Copywriting"
            category: 'Marketing' | 'Dev' | 'Design' | 'Data' | 'Product';
            shortDescription: string;
            fullDescription: {
                whatIDo: string[];
                whatIDontDo: string[];
                howIWork: string[];
            };
            systemInstruction: string; // O prompt base do agente
        }
        ```
    *   Atualizar o tipo `View` para incluir `'ai-agents'`.

2.  **Atualizar `constants.ts`:**
    *   Criar o array `SPECIALIST_AGENTS` com os 6 agentes definidos em `pageagents.md`.
    *   Transformar os textos descritivos do markdown em instruções de sistema (prompts) eficientes para a IA.

### Fase 2: Refatoração do Serviço de IA (Facade)
**Objetivo:** Permitir que o `geminiService` aceite instruções de sistema arbitrárias, não apenas as hardcoded.

1.  **Atualizar `services/geminiService.ts`:**
    *   Criar método `startCustomChat(systemInstruction: string, initialMessage?: string)`.
    *   O método `chatWithAgent` atual pode ser adaptado ou sobrecarregado para aceitar um objeto de configuração de persona em vez de apenas uma string `'pm' | 'ux'`.
    *   Garantir que o `groqService` também suporte essa injeção dinâmica de contexto.

### Fase 3: Componentes de UI
**Objetivo:** Criar os blocos visuais da página.

1.  **Novo Componente `components/AgentCard.tsx`:**
    *   Props: `agent: SpecialistAgent`, `onChat: (agent: SpecialistAgent) => void`, `onDetails: (agent: SpecialistAgent) => void`.
    *   Layout: Card com ícone (gerado dinamicamente ou fixo por categoria), Nome, Categoria (badge), Resumo e Botão de Ação.
    *   Estilo: Tailwind CSS, consistente com `components/Card.tsx`.

2.  **Novo Componente `components/AgentDetailsModal.tsx`:**
    *   Modal para exibir as seções "O que faço", "O que não faço" e "Como funciono".
    *   Botão "Iniciar Conversa" no rodapé.

### Fase 4: Implementação da View (Página)
**Objetivo:** Montar a tela principal.

1.  **Criar `views/AgentHub.tsx`:**
    *   **Estado:**
        *   `searchTerm` (string).
        *   `selectedCategory` (string | 'all').
        *   `selectedAgent` (para o modal de detalhes).
        *   `isChatOpen` (boolean).
        *   `activeChatAgent` (SpecialistAgent | null).
    *   **Layout:**
        *   Header com Título e Subtítulo.
        *   Barra de Ferramentas: Input de Busca + Filtros de Categoria (Pills/Tabs).
        *   Grid Responsivo (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) renderizando `AgentCard`s.
    *   **Lógica:** Filtragem do array `SPECIALIST_AGENTS` baseado na busca/categoria.

### Fase 5: Integração e Navegação
**Objetivo:** Conectar a nova página ao app.

1.  **Atualizar `components/Sidebar.tsx`:**
    *   Adicionar novo item de navegação "Agentes de IA" (Ícone: `UserGroupIcon` ou similar).
    *   Lógica de navegação para `setActiveView('ai-agents')`.

2.  **Atualizar `App.tsx`:**
    *   Adicionar case `'ai-agents'` no switch de renderização.

3.  **Atualizar `components/Chat/ChatDrawer.tsx` (Adaptação):**
    *   Atualmente o Drawer espera uma `AgentPersona` (string fixa).
    *   Refatorar props para aceitar `customAgentConfig?: { name: string, role: string }`.
    *   Se `customAgentConfig` for passado, usar esses dados no header do chat em vez de buscar no mapa estático `personaConfig`.

---

## 3. Detalhamento Técnico dos Prompts

Cada agente terá um `systemInstruction` otimizado. Exemplo para o **LandingPage Expert**:

```text
Você é o LandingPage Expert, um especialista em copywriting e arquitetura de conversão.
SUA MISSÃO: Planejar e escrever conteúdo para landing pages de alta conversão.
REGRAS:
1. Não escreva código HTML/CSS, foque no TEXTO e ESTRUTURA.
2. Use gatilhos mentais (Escassez, Prova Social, Autoridade).
3. Estruture a resposta em seções: Header, Benefícios, Prova Social, CTA.
CONTEXTO: O usuário fornecerá o produto/serviço.
```

## 4. Checklist de Entrega

- [ ] `types.ts` atualizado com `SpecialistAgent`.
- [ ] `constants.ts` populado com os 6 agentes.
- [ ] `geminiService.ts` capaz de lidar com chats customizados.
- [ ] `AgentCard.tsx` e `AgentDetailsModal.tsx` criados.
- [ ] `AgentHub.tsx` implementado com busca e filtros.
- [ ] `ChatDrawer.tsx` refatorado para aceitar configurações dinâmicas.
- [ ] Sidebar e App roteando corretamente.
- [ ] Teste de chat com pelo menos 2 agentes diferentes (ex: SEO vs Supabase) para garantir isolamento de contexto.
