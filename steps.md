# Plano de Implementação: Geração Manual por Etapa

## Objetivo
Desacoplar a navegação entre as abas da geração de conteúdo via IA. O botão "Próximo Passo" deve apenas avançar a tela. A geração do conteúdo (Concorrentes, UI, DB, Logo) deve ser disparada por um botão explícito dentro de cada aba.

## Estratégia de Mudança

### 1. Alterar Lógica de Navegação (`handleNextStep`)
**Arquivo:** `views/GeneratePrd.tsx`
- **Atual:** Verifica se o conteúdo da próxima etapa existe. Se não, gera automaticamente (`await generateSection...`) antes de mudar de passo.
- **Novo:** Remove as chamadas de `geminiService` dentro do `handleNextStep` para os passos 1, 2, 3 e 4. Apenas atualiza `maxStepReached` e `currentStep`.

### 2. Criar Interface de "Estado Vazio" (Empty State)
**Arquivo:** `views/GeneratePrd.tsx`
- Criar um componente visual ou função auxiliar (`renderEmptyState`) que será exibido quando não houver dados na aba atual.
- **Elementos:**
  - Ícone representativo da etapa.
  - Título e Descrição (ex: "Análise de Concorrentes Pendente").
  - Botão de Ação "Gerar Agora".

### 3. Adaptar Funções de Renderização
**Arquivo:** `views/GeneratePrd.tsx`
- **`renderCompetitorsContent`:** Verificar se `prdData.content.competitors` existe. Se não, renderizar o `Empty State` com callback para gerar concorrentes.
- **`renderUiContent`:** Verificar `uiPlan`. Se vazio, mostrar botão para gerar UI.
- **`renderDbContent`:** Verificar `dbSchema`. Se vazio, mostrar botão para gerar Banco de Dados.
- **`renderLogoContent`:** Verificar `logoSuggestion`. Se vazio, mostrar botão para gerar Logo.

### 4. Handlers de Geração Manual
**Arquivo:** `views/GeneratePrd.tsx`
- Criar ou adaptar funções para serem chamadas pelos botões dos Empty States.
- Estas funções devem:
  1. Ativar `setIsLoading(true)`.
  2. Definir `setLoadingMessage`.
  3. Chamar o `geminiService`.
  4. Atualizar o estado `prdData`.
  5. `setIsLoading(false)`.

## Atualização: Personalização de Logo
**Arquivo:** `views/GeneratePrd.tsx` e `services/geminiService.ts`
- Adicionar suporte opcional para definir "Estilo Visual" e "Paleta de Cores" antes de gerar o logo.
- Usuário pode optar pelo fluxo rápido (padrão) ou expandir opções de personalização.
