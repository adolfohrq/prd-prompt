
# Regras de Desenvolvimento - PRD-Prompt.ai

Este documento define os padrões, regras e diretrizes que **devem** ser seguidos em todas as futuras interações e desenvolvimentos neste projeto.

## 1. Stack e Tecnologias

*   **Framework:** React 19 (via ES Modules/CDN). Não utilizar sintaxe que dependa de build steps complexos (como Webpack/Vite loaders específicos) que não funcionem nativamente no browser via importmap.
*   **Estilização:** **Apenas Tailwind CSS**. Não criar arquivos CSS separados nem usar `style={{}}` inline, exceto para propriedades dinâmicas (como cores vindas da API).
*   **Linguagem:** TypeScript (TSX). Manter tipagem estrita sempre que possível.
*   **Gerenciamento de Estado:** `useState`, `useContext` (para globais simples como Toast/Auth) e `databaseService` para persistência.
*   **Ícones:** SVG Inline (componentes funcionais) dentro de `components/icons/Icons.tsx`. Não instalar bibliotecas de ícones externas.

## 2. Estrutura de Arquivos

*   **Raiz:** O projeto não possui pasta `src`. Tratar a raiz como a fonte.
*   **`components/`:** Componentes visuais reutilizáveis e "burros" (Button, Card, Input, Chat).
*   **`views/`:** Componentes de página/tela que contém a lógica de negócio e estado local.
*   **`services/`:** Camada de infraestrutura.
    *   `geminiService.ts`: **Orquestrador (Facade)** que decide qual IA usar.
    *   `groqService.ts`: Cliente específico para API Groq.
    *   `databaseService.ts`: Abstração do banco de dados local.
*   **`types.ts`:** Todas as interfaces e tipos compartilhados.

## 3. Integração com IA (Multi-Provedor)

*   **Arquitetura Facade:** Toda chamada da UI deve ser feita exclusivamente para `services/geminiService.ts`. Este serviço atua como um orquestrador que roteia a requisição para o Google (Gemini) ou Groq (Llama/DeepSeek) baseado na configuração do usuário.
*   **Modelos Suportados:**
    *   **Google:** `gemini-2.5-flash` (Padrão), `gemini-2.0-flash`.
    *   **Groq:** `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `deepseek-r1-distill-llama-70b`, `mixtral-8x7b`, `gemma2-9b`.
*   **Geração de Imagens (Híbrida):** Modelos de texto Open Source (Llama/DeepSeek) não geram imagens. O orquestrador deve usar a IA de texto para criar o prompt criativo e forçar o uso do `gemini-2.5-flash-image` para a geração visual (Base64).
*   **Sanitização de Dados (Crítico):** Modelos Open Source podem retornar JSONs mal formatados ou encapsulados incorretamente.
    *   O `service` **DEVE** validar e limpar a resposta antes de retornar à View.
    *   Nunca confiar que o retorno é um Array. Usar `Array.isArray()` e tratamentos defensivos.
    *   Remover tags de "pensamento" (ex: `<think>`) de modelos como DeepSeek.
*   **Structured Output:** Sempre forçar retorno em JSON via Prompt Engineering ("Output strictly in JSON...") para modelos que não suportam schema nativo rigoroso.
*   **Execução Paralela Resiliente (Turbo Mode):** Ao gerar múltiplas seções de conteúdo independentes (ex: Texto, DB, UI), utilizar `Promise.all`.
    *   **Regra:** Envolver cada promessa individual em um tratador de erro (wrapper) para que a falha de uma seção (ex: Logo) não cancele as outras (ex: DB Schema). O sistema deve ser capaz de entregar resultados parciais.

## 4. Design e UI/UX

*   **Idioma:** Interface 100% em **Português do Brasil (PT-BR)**.
*   **Identidade:** Roxo/Violeta (`violet-600` ou `primary`).
*   **Feedback:** `isLoading` em botões e `Toast` para todas as ações assíncronas.
*   **Responsividade:** Mobile First.
*   **Chat Contextual:** Interfaces complexas devem oferecer suporte a agentes de chat especializados (Personas) usando os componentes em `components/Chat/`.
*   **Renderização de Texto:** **Obrigatório** utilizar o componente `MarkdownRenderer` (`components/MarkdownRenderer.tsx`) para exibir qualquer resposta textual da IA. Isso garante suporte a formatação (negrito, listas) e blocos de código (SQL, Prisma, TypeScript). Nunca renderizar texto cru (`{text}`) se ele vier de um LLM.

## 5. Persistência e Dados (Database Service)

*   **Abstração:** **NUNCA** acessar `localStorage` diretamente nas Views (`App.tsx`, `Dashboard.tsx`, etc.).
*   **Uso Obrigatório:** Todas as operações de leitura/escrita devem passar por `services/databaseService.ts`.
*   **Segregação:** Os dados (PRDs, Prompts) devem ser salvos vinculados ao `userId` do usuário logado.
*   **Simulação:** O serviço simula latência de rede (`delay`). A UI deve tratar esses estados de carregamento (`await`).

## 6. Manutenibilidade

*   **Código Limpo:** Extrair lógica complexa para funções utilitárias.
*   **Tipagem:** Manter `types.ts` atualizado. Se adicionar um campo no PRD, atualizar a interface lá primeiro.
*   **Regras Vivas:** Se houver mudança arquitetural, este arquivo `regra.md` deve ser atualizado.

## 7. Fluxo de Desenvolvimento

1.  Analisar arquivos existentes.
2.  Atualizar `types.ts` se houver mudança de dados.
3.  Implementar lógica no `service` correspondente.
4.  Atualizar a View.
5.  Registrar mudanças no `updates/updates.md`.

## 8. Documentação de Atualizações (Log)

*   **Obrigatoriedade:** Registrar novas features, correções ou refatorações no topo de `updates/updates.md` seguindo o padrão de Data/Hora.
