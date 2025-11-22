# Plano de Melhorias v2 - GeneratePrd

Este documento detalha o plano de implementação para a segunda leva de melhorias na view `GeneratePrd`, com base nas sugestões e seguindo as diretrizes do `regra.md`.

---

## 1. Tooltips de Ajuda Contextual

**Objetivo:** Educar o usuário sobre como fornecer a melhor informação possível, resultando em um PRD de maior qualidade, sem poluir a interface.

### Onde Implementar

1.  **`components/Tooltip.tsx`**: Criar um novo componente reutilizável para exibir tooltips.
2.  **`components/icons/Icons.tsx`**: Garantir que existe um ícone de informação (`InfoIcon`).
3.  **`components/Input.tsx`, `components/Textarea.tsx`, `components/Select.tsx`**: Modificar os componentes de formulário base para aceitarem uma prop `tooltipText`.
4.  **`components/GeneratePrd/steps/DocumentStep.tsx`**: Adicionar o texto dos tooltips nos campos relevantes.

### Como Implementar

1.  **Criar `Tooltip.tsx`**:
    -   Será um componente que recebe `content` (o texto) e `children` (o ícone que aciona o tooltip).
    -   Usará CSS (Tailwind) para posicionamento e visibilidade `on:hover`.
2.  **Atualizar Componentes de Formulário**:
    -   Adicionar a prop `tooltipText?: string`.
    -   No `label` do campo, renderizar condicionalmente o `Tooltip` com o `InfoIcon` se `tooltipText` for fornecido.
3.  **Aplicar em `DocumentStep.tsx`**:
    ```tsx
    <Input
      label="Público-alvo"
      tooltipText="Descreva quem usará o produto. Ex: 'Profissionais de marketing digital em startups' ou 'Estudantes universitários'."
      // ...
    />
    ```

---

## 2. Input de Tags para "Indústria / Mercado"

**Objetivo:** Estruturar melhor os dados para a IA, permitir uma análise de mercado mais precisa e melhorar a busca/categorização de documentos.

### Onde Implementar

1.  **`types.ts`**: Atualizar a interface `PRD` para que `industry` seja um array de strings.
2.  **`components/TagInput.tsx`**: Criar um novo componente customizado para gerenciamento de tags.
3.  **`views/GeneratePrd.tsx`**: Ajustar o estado `prdData` para lidar com `industry` como array.
4.  **`components/GeneratePrd/steps/DocumentStep.tsx`**: Substituir o `Input` de indústria pelo novo `TagInput`.
5.  **`components/GeneratePrd/hooks/usePrdGeneration.ts`**:
    -   Ajustar os prompts que usam `industry` para formatar o array de tags em uma string compreensível pela IA (ex: "tags: SaaS, Logística, IA").
    -   (Opcional - v2.1) Criar uma nova função `handleSuggestTags` que usa a IA para sugerir tags com base na descrição da ideia.

### Como Implementar

1.  **Atualizar Tipo:** Em `types.ts`, mudar `industry: string;` para `industry: string[];`.
2.  **Criar `TagInput.tsx`**:
    -   Componente com um input de texto. Ao pressionar "Enter" ou "vírgula", o texto vira uma tag.
    -   Permitir remover tags clicando em um "x".
    -   Receberá `tags: string[]` e um callback `onTagsChange: (tags: string[]) => void`.
3.  **Integrar no Formulário:**
    -   Em `DocumentStep.tsx`, remover o `<Input id="industry" ... />`.
    -   Adicionar `<TagInput label="Indústria / Mercado" tags={prdData.industry || []} onTagsChange={handleIndustryChange} />`.
    -   A função `handleIndustryChange` será criada em `GeneratePrd.tsx` e passada via props para atualizar o estado.

---

## 3. Salvar como Rascunho

**Objetivo:** Oferecer flexibilidade para usuários que ainda estão maturando a ideia e não querem se comprometer com o processo completo de geração.

### Onde Implementar

1.  **`types.ts`**: Adicionar um campo `status: 'draft' | 'completed'` na interface `PRD`.
2.  **`services/databaseService.ts`**: Modificar as funções `createPrd` e `updatePrd` para lidar com o novo status. Potencialmente criar uma função `savePrdDraft`.
3.  **`components/GeneratePrd/hooks/useFormHandlers.ts`**: Criar uma nova função `handleSaveDraft`.
4.  **`views/GeneratePrd.tsx`**: Adicionar um botão "Salvar Rascunho" e conectar o novo handler.
5.  **`views/MyDocuments.tsx`**: Atualizar a view para diferenciar rascunhos de documentos completos e permitir que o usuário continue a edição de um rascunho.
6.  **`App.tsx`**: Adicionar lógica para carregar um PRD em estado de rascunho na view `GeneratePrd`.

### Como Implementar

1.  **Atualizar Tipo:** Adicionar `status: 'draft' | 'completed';` em `PRD` na `types.ts`.
2.  **Lógica do Serviço:** Em `databaseService.ts`, `createPrd` e `updatePrd` devem agora salvar o campo `status`. Um PRD é criado inicialmente como 'draft'. Ele só se torna 'completed' quando o usuário salva na etapa final.
3.  **Novo Handler:** Em `useFormHandlers.ts`, `handleSaveDraft` irá chamar `databaseService.createPrd` ou `updatePrd` com os dados atuais e o status 'draft', e depois navegar o usuário para 'Meus Documentos'.
4.  **Botão na UI:** Adicionar o botão "Salvar Rascunho" em `DocumentStep.tsx`, possivelmente ao lado do botão "Próximo Passo".
5.  **Listagem em `MyDocuments.tsx`**:
    -   Exibir um badge "Rascunho" nos PRDs com `status === 'draft'`.
    -   O botão "Ver" deve se tornar "Continuar Editando". Ao clicar, o usuário é levado para `GeneratePrd` com os dados do rascunho carregados.
6.  **Carregar Rascunho:**
    -   `App.tsx` precisará de um estado para `editingPrdId`.
    -   Quando o usuário clica em "Continuar Editando", o `editingPrdId` é setado.
    -   `GeneratePrd` receberá esse ID, carregará os dados do `databaseService` em um `useEffect` e populará seu estado interno.
