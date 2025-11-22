# Plano de Implementação v1: Melhorias de Usabilidade para o Gerador de PRD

Este documento detalha o plano técnico para implementar as melhorias de usabilidade sugeridas para a funcionalidade "Gerador de PRD".

## 1. Feedback Visual Durante o "Preenchimento Mágico"

**Objetivo:** Fornecer feedback claro ao usuário de que a geração de conteúdo via "Preenchimento Mágico" está em andamento, prevenindo cliques múltiplos e confusão.

**Arquivos a Modificar:**
- `components/GeneratePrd/steps/DocumentStep.tsx`

**Plano de Ação:**

1.  **Adicionar Estado de Carregamento:**
    - No componente `DocumentStep`, introduzir um novo estado para controlar o carregamento.
      ```typescript
      const [isMagicFillLoading, setIsMagicFillLoading] = useState(false);
      ```

2.  **Atualizar a Função `handleMagicFill`:**
    - Envolver a lógica de chamada da IA com o novo estado de carregamento.
      ```typescript
      const handleMagicFill = async () => {
        if (isMagicFillLoading) return;
        setIsMagicFillLoading(true);
        // ... lógica existente da chamada para a API geminiService
        // dentro de um bloco try...finally para garantir que o estado seja resetado
        try {
          // ... chamada IA
        } finally {
          setIsMagicFillLoading(false);
        }
      };
      ```

3.  **Modificar o Componente do Botão:**
    - Adicionar lógica condicional para alterar o texto, o ícone e o estado `disabled` do botão.
      ```jsx
      <Button 
        onClick={handleMagicFill} 
        disabled={isMagicFillLoading || !magicIdea.trim()}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isMagicFillLoading ? (
          <>
            <SpinnerIcon className="animate-spin mr-2" />
            Gerando...
          </>
        ) : (
          <>
            <MagicWandIcon className="mr-2" />
            Mágica
          </>
        )}
      </Button>
      ```

4.  **Desabilitar Campos do Formulário:**
    - Adicionar a propriedade `disabled={isMagicFillLoading}` a todos os campos de input e select da primeira etapa (`Input`, `Textarea`, `Select`).
      ```jsx
      <Input
        label="Título do Produto/Projeto"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        disabled={isMagicFillLoading}
        // ...
      />
      
      <Textarea
        label="Refinar Descrição (Detalhada)"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        disabled={isMagicFillLoading}
        // ...
      />
      ```

**Validação:**
- Clicar no botão "Mágica".
- Verificar se o botão exibe "Gerando...", um ícone de spinner, e fica desabilitado.
- Verificar se todos os campos do formulário (Título, Descrição, Indústria, etc.) estão desabilitados.
- Após a conclusão da geração, verificar se o botão e os campos voltam ao estado normal.

---

## 2. Exemplos e Placeholders nos Campos

**Objetivo:** Guiar o usuário sobre o tipo de informação esperada em cada campo, melhorando a qualidade dos dados de entrada para a IA.

**Arquivos a Modificar:**
- `components/GeneratePrd/steps/DocumentStep.tsx`

**Plano de Ação:**

1.  **Atualizar Propriedade `placeholder`:**
    - Modificar os componentes `Input` e `Textarea` para incluir placeholders mais descritivos.

      ```jsx
      // Em DocumentStep.tsx

      <Input
        label="Título do Produto/Projeto"
        placeholder="Ex: Plataforma de gestão de projetos para freelancers"
        // ...
      />

      <Textarea
        label="Refinar Descrição (Detalhada)"
        placeholder="Ex: Uma solução SaaS que centraliza o fluxo de trabalho de freelancers, desde a prospecção de clientes até o faturamento, utilizando IA para automatizar tarefas repetitivas..."
        // ...
      />
      
      <Input
        label="Indústria / Mercado"
        placeholder="Ex: Software, Finanças, Saúde"
        // ...
      />
      
      <Input
        label="Público-alvo"
        placeholder="Ex: Pequenas e médias empresas de tecnologia"
        // ...
      />
      ```

**Validação:**
- Acessar a página "Gerador de PRD".
- Verificar se os novos placeholders são exibidos corretamente nos campos correspondentes quando estão vazios.

---

## 3. Contador de Caracteres e Validação na Descrição

**Objetivo:** Incentivar o usuário a escrever descrições mais completas, o que melhora significativamente a qualidade do PRD gerado pela IA.

**Arquivos a Modificar:**
- `components/GeneratePrd/steps/DocumentStep.tsx`

**Plano de Ação:**

1.  **Renderizar Contador e Mensagem:**
    - Abaixo do componente `Textarea` da descrição, adicionar um elemento para exibir a contagem de caracteres e a mensagem de dica.

      ```jsx
      // Em DocumentStep.tsx, abaixo do <Textarea>
      <div className="text-right text-sm text-gray-500 mt-1">
        <span>{formData.description.length} caracteres</span>
        {formData.description.length > 0 && formData.description.length < 150 && (
          <p className="text-blue-500 text-xs text-left mt-1">
            Dica: Quanto mais detalhes você fornecer, melhor será o PRD gerado. Tente atingir pelo menos 150 caracteres.
          </p>
        )}
      </div>
      ```

**Validação:**
- Digitar no campo "Refinar Descrição".
- O contador de caracteres deve ser atualizado em tempo real.
- A mensagem de dica deve aparecer quando o texto tiver entre 1 e 149 caracteres.
- A mensagem deve desaparecer quando o campo estiver vazio ou atingir 150 caracteres.

---

## 4. Indicadores de Complexidade e Qualidade da Ideia

**Objetivo:** Fornecer um feedback dinâmico e visual sobre a qualidade da ideia inserida pelo usuário, ajudando-o a refinar o conceito antes de prosseguir.

**Arquivos a Modificar:**
- **(Novo)** `components/GeneratePrd/hooks/useIdeaQuality.ts`
- **(Novo)** `components/GeneratePrd/IdeaQualityMeter.tsx`
- `components/GeneratePrd/steps/DocumentStep.tsx`

**Plano de Ação:**

1.  **Criar o Hook `useIdeaQuality.ts`:**
    - Este hook conterá a lógica para calcular a "pontuação" da ideia.

      ```typescript
      // components/GeneratePrd/hooks/useIdeaQuality.ts
      import { useState, useEffect } from 'react';

      type FormData = { title: string; description: string; targetAudience: string; industry: string; };
      type QualityLevel = 'Fraca' | 'Razoável' | 'Boa' | 'Excelente';

      const calculateQuality = (data: FormData): { level: QualityLevel, message: string } => {
        let score = 0;
        if (data.title.length > 10) score++;
        if (data.description.length > 150) score += 2;
        else if (data.description.length > 50) score++;
        if (data.targetAudience.length > 10) score++;
        if (data.industry.length > 5) score++;

        if (score <= 1) return { level: 'Fraca', message: 'Adicione mais detalhes para refinar sua ideia.' };
        if (score <= 3) return { level: 'Razoável', message: 'Bom começo! Detalhar o público-alvo pode ajudar.' };
        if (score === 4) return { level: 'Boa', message: 'Ideia bem descrita. Pronto para avançar!' };
        return { level: 'Excelente', message: 'Sua ideia está muito bem detalhada!' };
      };

      export const useIdeaQuality = (formData: FormData) => {
        const [quality, setQuality] = useState(calculateQuality(formData));

        useEffect(() => {
          setQuality(calculateQuality(formData));
        }, [formData]);

        return quality;
      };
      ```

2.  **Criar o Componente `IdeaQualityMeter.tsx`:**
    - Componente visual para exibir a barra de qualidade.

      ```jsx
      // components/GeneratePrd/IdeaQualityMeter.tsx
      import React from 'react';

      interface Props {
        level: 'Fraca' | 'Razoável' | 'Boa' | 'Excelente';
        message: string;
      }

      const qualityConfig = {
        Fraca: { width: '25%', color: 'bg-red-500' },
        Razoável: { width: '50%', color: 'bg-yellow-500' },
        Boa: { width: '75%', color: 'bg-blue-500' },
        Excelente: { width: '100%', color: 'bg-green-500' },
      };

      export const IdeaQualityMeter: React.FC<Props> = ({ level, message }) => {
        const config = qualityConfig[level];
        return (
          <div className="my-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-2">Qualidade da Ideia: {level}</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${config.color} h-2.5 rounded-full transition-all duration-500`} 
                style={{ width: config.width }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
          </div>
        );
      };
      ```

3.  **Integrar no `DocumentStep.tsx`:**
    - Utilizar o hook e renderizar o novo componente.

      ```jsx
      // Em DocumentStep.tsx
      import { useIdeaQuality } from '../hooks/useIdeaQuality';
      import { IdeaQualityMeter } from '../IdeaQualityMeter';

      // ... dentro do componente
      const formDataForQuality = { 
        title: formData.title, 
        description: formData.description,
        targetAudience: formData.targetAudience,
        industry: formData.industry 
      };
      const ideaQuality = useIdeaQuality(formDataForQuality);

      return (
        // ...
        <IdeaQualityMeter level={ideaQuality.level} message={ideaQuality.message} />
        // ... resto do formulário
      );
      ```

**Validação:**
- Conforme o usuário preenche os campos do formulário na primeira etapa, o medidor de qualidade deve se atualizar dinamicamente.
- A cor da barra, o nível de qualidade e a mensagem de dica devem corresponder à lógica definida no hook `useIdeaQuality`.
