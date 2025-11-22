# Plano de Melhorias v1 - GeneratePrd

Este documento detalha o plano de implementação para as melhorias sugeridas na view `GeneratePrd`, seguindo as diretrizes do `regra.md`.

---

## 1. Feedback Visual Durante o "Preenchimento Mágico"

**Objetivo:** Informar visualmente ao usuário quais campos estão sendo preenchidos pela IA em tempo real, melhorando a percepção de atividade do sistema.

### Onde Implementar

1.  **`components/Input.tsx` e `components/Textarea.tsx`**: Adicionar suporte para um estado de "carregamento mágico".
2.  **`components/GeneratePrd/hooks/usePrdGeneration.ts`**: Controlar o estado de carregamento durante a execução do `handleSmartFill`.
3.  **`views/GeneratePrd.tsx`**: Gerenciar o estado que indica quais campos estão sendo preenchidos.
4.  **`components/GeneratePrd/steps/DocumentStep.tsx`**: Repassar a propriedade de carregamento para os componentes de input.

### Como Implementar

1.  **Estado Centralizado:** Em `GeneratePrd.tsx`, criar um novo estado para rastrear os campos em preenchimento:
    ```typescript
    const [smartFillingFields, setSmartFillingFields] = useState<string[]>([]);
    ```
2.  **Lógica no Hook:** Em `usePrdGeneration.ts`, dentro de `handleSmartFill`, modificar o estado. É preciso passar a função `setSmartFillingFields` para o hook.
    -   Antes da chamada da IA, popular o array: `setSmartFillingFields(['productName', 'targetAudience', 'problem'])`.
    -   Após a conclusão, limpar o array: `setSmartFillingFields([])`.
3.  **Componentes de UI:** Em `Input.tsx` e `Textarea.tsx`, adicionar uma nova prop `isMagicFilling?: boolean`.
    -   Aplicar um estilo condicional quando `isMagicFilling` for `true`, por exemplo, um anel de foco pulsante com as cores da identidade visual.
    ```css
    // Exemplo de classe a ser aplicada com Tailwind
    'focus:ring-violet-500 focus:border-violet-500 ring-2 ring-violet-300 animate-pulse'
    ```
4.  **Conexão:** Em `DocumentStep.tsx`, passar a prop para os componentes, recebendo o state e o handler de `GeneratePrd.tsx`.
    ```tsx
    <Input
      // ...
      isMagicFilling={smartFillingFields.includes('productName')}
    />
    ```

### Regras a Seguir

-   **Feedback de UI (`regra.md #4`):** A mudança fornece feedback claro para uma ação assíncrona.
-   **Componentização (`regra.md #7`):** A lógica de UI fica contida nos componentes base, tornando-os mais capazes e reutilizáveis.

---

## 2. Exemplos e Placeholders nos Campos

**Objetivo:** Guiar o usuário a fornecer informações de melhor qualidade através de exemplos claros diretamente nos campos do formulário.

### Onde Implementar

1.  **`components/GeneratePrd/steps/DocumentStep.tsx`**: Arquivo onde os campos de formulário da primeira etapa são renderizados.

### Como Implementar

-   Atualizar a prop `placeholder` dos componentes `Input` e `Textarea` com exemplos práticos e diretos.
    ```tsx
    // Em DocumentStep.tsx

    <Input
      label="Nome do Produto/Feature"
      value={prdData.productName || ''}
      onChange={(e) => onInputChange('productName', e.target.value)}
      placeholder="Ex: 'Plataforma de IA para otimizar logística de e-commerces'"
    />

    <Textarea
      label="Descrição Detalhada da Ideia"
      value={prdData.idea || ''}
      onChange={(e) => onInputChange('idea', e.target.value)}
      placeholder="Descreva o que o produto faz, para quem se destina, e qual problema resolve. Ex: 'Uma plataforma SaaS que usa IA para analisar rotas de entrega em tempo real, sugerindo o caminho mais eficiente (custo/tempo) para transportadoras...'"
      rows={6}
    />
    ```

### Regras a Seguir

-   **Idioma (`regra.md #4`):** Todo o texto deve estar em Português (PT-BR).
-   **Clareza de UI/UX:** A melhoria visa facilitar o uso e melhorar a qualidade dos dados de entrada do usuário.

---

## 3. Contador de Caracteres e Validação na Descrição

**Objetivo:** Incentivar o usuário a escrever descrições mais completas, o que resulta em melhores gerações de IA, e fornecer feedback sobre a quantidade de texto.

### Onde Implementar

1.  **`components/Textarea.tsx`**: Adicionar a lógica para exibir um contador de caracteres.
2.  **`components/GeneratePrd/steps/DocumentStep.tsx`**: Ativar e configurar o contador para o campo de descrição.
3.  **`components/GeneratePrd/hooks/useFormHandlers.ts`**: Adicionar a lógica de validação no `handleNextStep`.
4.  **`contexts/AppContext.ts`**: Utilizar o `showToast` para exibir mensagens de erro, que já é injetado nos hooks.

### Como Implementar

1.  **Evoluir `Textarea.tsx`:**
    -   Adicionar as props: `maxLength?: number` e `showCounter?: boolean`.
    -   Renderizar o contador condicionalmente:
    ```tsx
    // Dentro do componente Textarea
    {showCounter && maxLength && (
      <div className="text-right text-xs text-gray-400 mt-1">
        {value.length} / {maxLength}
      </div>
    )}
    ```
2.  **Ativar no `DocumentStep.tsx`:**
    ```tsx
    <Textarea
      // ...
      maxLength={1000}
      showCounter={true}
    />
    ```
3.  **Lógica de Validação:** Em `useFormHandlers.ts`, atualizar `handleNextStep`:
    ```typescript
    // No início de handleNextStep, para currentStep === 0
    if (currentStep === 0) {
        if (!prdData.idea || prdData.idea.length < 150) {
            // Supondo que appContext está disponível no hook
            appContext.showToast('Por favor, forneça uma descrição com pelo menos 150 caracteres para melhores resultados.', 'error');
            return; // Impede a transição
        }
    }
    ```

### Regras a Seguir

-   **Componentização (`regra.md #7`):** Melhorar o `Textarea` para que possa ser reutilizado com contador em outros lugares.
-   **Feedback ao Usuário (`regra.md #4`):** Usar `Toast` para feedback não-bloqueante, conforme o padrão do projeto.

---

## 4. Indicadores de Complexidade e Qualidade da Ideia

**Objetivo:** Fornecer um feedback rápido, gerado por IA, sobre a ideia do usuário, ajudando-o a refinar o conceito antes de gerar o PRD completo.

### Onde Implementar

1.  **`types.ts`**: Adicionar a tipagem para o resultado da análise.
2.  **`services/geminiService.ts`**: Usar a função `generateJSON` com um prompt de análise.
3.  **`components/GeneratePrd/hooks/usePrdGeneration.ts`**: Criar uma nova função `handleAnalyzeIdea`.
4.  **`views/GeneratePrd.tsx`**: Adicionar o estado para armazenar o resultado da análise e a função para atualizá-lo.
5.  **`components/GeneratePrd/steps/DocumentStep.tsx`**: Adicionar um botão para acionar a análise e uma área para exibir o resultado.

### Como Implementar

1.  **Tipagem em `types.ts`:**
    ```typescript
    export interface IdeaAnalysis {
      quality: 'Baixa' | 'Média' | 'Alta';
      complexity: 'Baixa' | 'Média' | 'Alta';
      feedback: string; // Um breve feedback textual
    }
    ```
2.  **Estado em `GeneratePrd.tsx`:**
    ```typescript
    const [ideaAnalysis, setIdeaAnalysis] = useState<IdeaAnalysis | null>(null);
    ```
3.  **Lógica no Hook `usePrdGeneration.ts`:**
    -   Criar `handleAnalyzeIdea` e injetar `setIdeaAnalysis` e `appContext`.
    ```typescript
    const handleAnalyzeIdea = async () => {
      if (!prdData.idea) return;
      setIsLoading(true); // Reutilizar estado de loading
      setLoadingMessage('Analisando ideia...');

      const prompt = `Analise a seguinte ideia de produto e retorne uma avaliação concisa. Ideia: "${prdData.idea}". Avalie a qualidade (potencial de mercado, clareza) e a complexidade de implementação. Forneça um feedback curto (1 frase).`;
      
      try {
        const analysis = await geminiService.generateJSON<IdeaAnalysis>(prompt);
        setIdeaAnalysis(analysis);
      } catch (error) {
        appContext.showToast('Erro ao analisar a ideia.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    ```
4.  **UI em `DocumentStep.tsx`:**
    -   Adicionar um botão "Analisar Ideia" ao lado do botão de "Preenchimento Mágico".
    -   Adicionar uma seção para renderizar o resultado:
    ```tsx
    // Exemplo de como renderizar o resultado
    {ideaAnalysis && (
      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 animate-fade-in">
        <h4 className="font-semibold text-sm text-gray-800">Análise Rápida da Ideia</h4>
        <div className="mt-2 text-sm space-y-1">
            <p><strong>Qualidade Potencial:</strong> {ideaAnalysis.quality}</p>
            <p><strong>Complexidade Estimada:</strong> {ideaAnalysis.complexity}</p>
            <p className="text-gray-600 italic">"{ideaAnalysis.feedback}"</p>
        </div>
      </div>
    )}
    ```

### Regras a Seguir

-   **Integração com IA (`regra.md #3`):** Usar `geminiService` como Facade e `generateJSON` para saídas estruturadas.
-   **Custom Hooks (`regra.md #7.2`):** Toda a lógica de negócio deve residir em hooks.
-   **Type Safety (`regra.md #6`):** Adicionar novos tipos em `types.ts`.
