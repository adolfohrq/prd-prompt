
# Regras de Desenvolvimento - PRD-Prompt.ai

Este documento define os padrões, regras e diretrizes que **devem** ser seguidos em todas as futuras interações e desenvolvimentos neste projeto.

## ⚠️ LEITURA OBRIGATÓRIA

**ANTES de fazer qualquer modificação no código, você DEVE:**

1. ✅ **LER completamente este arquivo** (`regra.md`)
2. ✅ **SEGUIR todas as regras** definidas aqui (não são sugestões, são obrigatórias)
3. ✅ **VERIFICAR o arquivo** `CLAUDE.md` para contexto adicional em inglês
4. ✅ **ATUALIZAR esta documentação** quando fizer mudanças arquiteturais significativas

**Este documento é a FONTE DA VERDADE para padrões de desenvolvimento neste projeto.**

## 1. Stack e Tecnologias

*   **Framework:** React 19 (via ES Modules/CDN através do importmap em `index.html`).
*   **Build Tool:** Vite 6 - Usado para desenvolvimento local (hot reload) e build de produção. O output final é otimizado para deployment em AI Studio via CDN.
*   **Estilização:** Tailwind CSS (via CDN). Arquivos CSS customizados devem ser mínimos e apenas para estilos que não podem ser expressos com Tailwind. Evitar `style={{}}` inline, exceto para propriedades dinâmicas (como cores vindas da API).
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
*   **Execução Paralela Resiliente (Turbo Mode):** Ao gerar múltiplas seções de conteúdo independentes (ex: Texto, DB, UI), utilizar `Promise.allSettled` para execução resiliente.
    *   **Regra:** Usar `Promise.allSettled` ao invés de `Promise.all` para que a falha de uma seção (ex: Logo) não cancele as outras (ex: DB Schema). O sistema deve ser capaz de entregar resultados parciais.
    *   **Exemplo de implementação:**
    ```typescript
    // ❌ Evitar: Promise.all cancela tudo se uma falhar
    const [section1, section2, section3] = await Promise.all([
      generateSection1(),
      generateSection2(),
      generateSection3()
    ]);

    // ✅ Correto: Promise.allSettled retorna todas com status
    const results = await Promise.allSettled([
      generateSection1(),
      generateSection2(),
      generateSection3()
    ]);

    // Extrair resultados com tratamento de falhas
    const section1 = results[0].status === 'fulfilled' ? results[0].value : 'Falha ao gerar';
    const section2 = results[1].status === 'fulfilled' ? results[1].value : 'Falha ao gerar';
    const section3 = results[2].status === 'fulfilled' ? results[2].value : 'Falha ao gerar';
    ```

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
*   **Documentação Viva (CRÍTICO):**
    *   Este arquivo `regra.md` e o `CLAUDE.md` são documentos vivos e **DEVEM** ser atualizados sempre que houver mudanças arquiteturais significativas.
    *   **Quando atualizar:**
        - Novos padrões arquiteturais (ex: novo service, novo pattern)
        - Mudanças no processo de build/deploy
        - Adição de novos modelos de IA ou provedores
        - Modificação de regras críticas (ex: Facade pattern, Promise handling)
        - Novos scripts npm ou comandos de desenvolvimento
    *   **Como atualizar:**
        - `regra.md`: Atualizar com regras técnicas detalhadas e exemplos de código
        - `CLAUDE.md`: Atualizar a seção "CRITICAL: Development Rules" e arquitetura relevante
        - Sempre atualizar **ambos os arquivos** juntos para manter consistência
    *   **Hierarquia:** `regra.md` (PT-BR) é a fonte da verdade → `CLAUDE.md` (EN) é a referência para IA → `updates/updates.md` é o changelog cronológico

## 7. Arquitetura de Componentes Modulares (GeneratePrd Pattern)

**Contexto:** Em novembro de 2025, o componente `GeneratePrd.tsx` foi refatorado de 1.200 linhas para 393 linhas (-67.3%), seguindo o princípio da **Responsabilidade Única**. Este padrão deve ser aplicado em futuros componentes complexos.

### 7.1 Estrutura de Componentização

Componentes grandes (>500 linhas) devem ser quebrados em:

```
components/[NomeDoComponente]/
├── modals/           (componentes de modal)
│   ├── types.ts     (interfaces dos modals)
│   └── index.ts     (barrel export)
├── steps/           (componentes de etapas/seções)
│   ├── types.ts     (interfaces dos steps)
│   └── index.ts     (barrel export)
└── hooks/           (lógica de negócio extraída)
    └── index.ts     (barrel export)
```

### 7.2 Princípios de Separação

*   **UI (Steps/Modals):** Componentes focados apenas em renderização
    *   Recebem dados via props
    *   Emitem eventos via callbacks
    *   Não contêm lógica de negócio

*   **Lógica (Hooks):** Custom hooks para handlers e lógica complexa
    *   `usePrdGeneration` - Geração de IA
    *   `useChatHandlers` - Lógica de chat
    *   `useFormHandlers` - Formulários e navegação
    *   Retornam objetos com handlers

*   **Estado (Componente Principal):** Orquestrador centralizado
    *   Mantém todo o estado local
    *   Instancia os hooks
    *   Passa handlers via props (props drilling)
    *   **NÃO** usa Context para estado local (apenas para estado global)

### 7.3 Regras de Type Safety

*   **SEMPRE** criar arquivo `types.ts` em cada pasta (`modals/`, `steps/`)
*   **TODAS** as props devem ter interfaces explícitas
*   **EVITAR** `any` - usar tipos específicos ou `unknown` com validação
*   **USAR** barrel exports (`index.ts`) para imports limpos

### 7.4 Exemplo de Implementação

```typescript
// ❌ Evitar: Componente monolítico
export const MyView = () => {
  // 50+ linhas de estado
  // 20+ handlers inline
  // 500+ linhas de JSX
  // Difícil de testar e manter
};

// ✅ Correto: Componente modular
// components/MyView/hooks/useMyLogic.ts
export const useMyLogic = ({...}) => {
  const handleAction = async () => { /* lógica */ };
  return { handleAction };
};

// components/MyView/steps/StepOne.tsx
export const StepOne: React.FC<StepOneProps> = ({ data, onAction }) => {
  return <div>{/* UI pura */}</div>;
};

// views/MyView.tsx (orquestrador)
export const MyView = () => {
  const [state, setState] = useState(/* */);
  const { handleAction } = useMyLogic({ state, setState });

  return <StepOne data={state} onAction={handleAction} />;
};
```

### 7.5 Quando Aplicar Este Padrão

*   **Componente >500 linhas:** Considerar refatoração
*   **Componente >800 linhas:** Refatoração obrigatória
*   **Múltiplos modais inline:** Extrair para pasta `modals/`
*   **Renderização condicional complexa:** Extrair para components `steps/`
*   **Muitos handlers (>10):** Extrair para custom hooks

### 7.6 Benefícios Comprovados (Caso GeneratePrd)

*   ✅ **Redução de código:** 67% menor no arquivo principal
*   ✅ **Testabilidade:** Cada componente pode ser testado isoladamente
*   ✅ **Manutenibilidade:** Fácil localizar e modificar funcionalidades
*   ✅ **Reutilização:** Componentes e hooks podem ser usados em outros contextos
*   ✅ **Type Safety:** 100% TypeScript, zero erros
*   ✅ **Performance:** Sem regressão (build em 2.10s)

## 8. Fluxo de Desenvolvimento

1.  **Ler e compreender** `regra.md` antes de qualquer mudança de código.
2.  Analisar arquivos existentes.
3.  Atualizar `types.ts` se houver mudança de dados.
4.  Implementar lógica no `service` correspondente.
5.  Atualizar a View.
6.  **Se componente >500 linhas:** Considerar aplicar padrão de componentização modular (seção 7).
7.  **Se for mudança arquitetural significativa:** Atualizar `regra.md` e `CLAUDE.md`.
8.  Registrar mudanças no `updates/updates.md`.

## 9. Documentação de Atualizações (Log)

*   **Obrigatoriedade:** Registrar novas features, correções ou refatorações no topo de `updates/updates.md` seguindo o padrão de Data/Hora.

## 10. Build e Deploy

*   **Ambiente Local:**
    *   Vite dev server roda na porta 3000 (configurado em `vite.config.ts`)
    *   Hot Module Replacement (HMR) ativado para desenvolvimento rápido
    *   Comando: `npm run dev`
    *   Acesso: `http://localhost:3000`

*   **Build de Produção:**
    *   Comando: `npm run build`
    *   Output: Diretório `/dist` com bundle otimizado
    *   Vite realiza:
        - Code splitting automático
        - Tree shaking (remoção de código não usado)
        - Minificação de JS/CSS
        - Otimização de assets

*   **Preview Local:**
    *   Comando: `npm run preview`
    *   Testa o build de produção localmente antes do deploy

*   **Deployment (AI Studio):**
    *   Target: Google AI Studio CDN
    *   O conteúdo do `/dist` é enviado para AI Studio
    *   React 19 e @google/genai são carregados via importmap (CDN externo)
    *   Tailwind CSS carregado via CDN do Tailwind

*   **Variáveis de Ambiente:**
    *   `GEMINI_API_KEY` deve estar configurada em `.env.local` (não commitar)
    *   Vite injeta variáveis de ambiente no build via `vite.config.ts` (linhas 14-15)
    *   Acessadas via `process.env.API_KEY` ou `process.env.GEMINI_API_KEY`

*   **Scripts Disponíveis:**
    ```bash
    npm install  # Instalar dependências
    npm run dev  # Desenvolvimento (Vite dev server)
    npm run build  # Build de produção
    npm run preview  # Preview do build localmente
    ```
