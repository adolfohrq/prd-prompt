
# Plano de Implementação Técnica: Identidade Visual v2.0

Este documento detalha a arquitetura de dados, lógica e passos de codificação para implementar a nova experiência de geração de logotipos no PRD-Prompt.ai.

## 1. Definição de Dados e Constantes

Para evitar *hardcoding* espalhado pela View, criaremos constantes ricas em `views/GeneratePrd.tsx` (ou em um arquivo separado `constants/design.ts` se crescer muito).

### A. Estilos Visuais (Cards)
Cada estilo terá um ID, Label, Descrição e uma representação visual CSS (para não depender de imagens externas).

```typescript
const LOGO_STYLES = [
  { 
    id: 'minimalist', 
    label: 'Minimalista', 
    desc: 'Menos é mais. Linhas limpas e simples.',
    visualClass: 'border-2 border-gray-800 bg-white' // Exemplo simplificado
  },
  { 
    id: 'tech', 
    label: 'Tech / Futurista', 
    desc: 'Neon, gradientes e formas geométricas.',
    visualClass: 'bg-gray-900 border-cyan-500 border' 
  },
  { 
    id: 'vintage', 
    label: 'Vintage / Retrô', 
    desc: 'Estilo nostálgico, texturas e selos.',
    visualClass: 'bg-orange-50 border-orange-200'
  },
  { 
    id: 'luxury', 
    label: 'Luxo / Premium', 
    desc: 'Elegante, preto e dourado, serifado.',
    visualClass: 'bg-black border-yellow-600'
  },
  { 
    id: 'playful', 
    label: 'Divertido', 
    desc: 'Cores vivas, formas arredondadas.',
    visualClass: 'bg-yellow-100 border-pink-300'
  },
  { 
    id: 'abstract', 
    label: 'Abstrato', 
    desc: 'Conceitual e artístico.',
    visualClass: 'bg-purple-50 border-purple-200'
  }
];
```

### B. Paletas de Cores
Botões que renderizam as cores reais para o usuário escolher.

```typescript
const COLOR_PALETTES = [
  { id: 'vibrant', label: 'Vibrante', colors: ['#FF5733', '#33FF57', '#3357FF'] },
  { id: 'corporate', label: 'Corporativo', colors: ['#0F172A', '#3B82F6', '#94A3B8'] },
  { id: 'pastel', label: 'Pastel', colors: ['#FBCFE8', '#A5F3FC', '#DDD6FE'] },
  { id: 'monochrome', label: 'Monocromático', colors: ['#000000', '#4B5563', '#E5E7EB'] },
  { id: 'warm', label: 'Quente', colors: ['#B45309', '#F59E0B', '#FEF3C7'] },
  { id: 'forest', label: 'Natureza', colors: ['#14532D', '#16A34A', '#DCFCE7'] }
];
```

### C. Tipografia
Seleção baseada em "Vibe" e não apenas nome da fonte.

```typescript
const TYPOGRAPHY_STYLES = [
  { id: 'sans', label: 'Sans Serif (Moderno)', example: 'Google, Spotify' },
  { id: 'serif', label: 'Serif (Clássico/Luxo)', example: 'Vogue, Rolex' },
  { id: 'slab', label: 'Slab (Robusto)', example: 'Sony, Volvo' },
  { id: 'script', label: 'Manuscrito (Pessoal)', example: 'Assinaturas, Instagram' },
  { id: 'mono', label: 'Monospace (Tech)', example: 'Coding, Terminals' }
];
```

---

## 2. Atualização do Serviço (`geminiService.ts`)

O método `generateLogo` precisa ser refatorado para aceitar um objeto de opções complexo e construir um prompt de engenharia reversa.

**Assinatura Atual:**
```typescript
generateLogo(title: string, industry: string, style?: string)
```

**Nova Assinatura:**
```typescript
interface LogoOptions {
  style: string;
  colors: string; // ID da paleta ou descrição
  typography: string;
  customPrompt?: string; // Modo Expert
}

generateLogo(title: string, industry: string, options: LogoOptions)
```

**Lógica de Construção do Prompt:**
1.  **Base:** "Create a professional vector logo design for a product named '{title}' in the '{industry}' industry."
2.  **Estilo:** "The visual style should be {style_desc}. Isolate on white background."
3.  **Cores:** "Use a color palette based on: {colors}."
4.  **Tipografia:** "The typography should be {typography_desc}."
5.  **Expert Override:** Se `customPrompt` existir, ele é anexado com alta prioridade: "ADDITIONAL USER INSTRUCTIONS: {customPrompt}".

---

## 3. Alterações na View (`GeneratePrd.tsx`)

### A. Novo Estado
Substituir estados simples por estados de seleção:
```typescript
const [logoStyle, setLogoStyle] = useState('minimalist');
const [logoColor, setLogoColor] = useState('corporate');
const [logoFont, setLogoFont] = useState('sans');
const [isExpertMode, setIsExpertMode] = useState(false);
const [expertPrompt, setExpertPrompt] = useState('');
```

### B. UI da Galeria Visual
*   Substituir o `<Select>` de Estilo por um `div.grid` contendo botões renderizados a partir de `LOGO_STYLES`.
*   Cada botão deve ter estado `active` visualmente distinto (borda grossa colorida).

### C. UI de Mockups (Pós-Geração)
Criar um componente simples de visualização que pega a imagem Base64 gerada e a aplica via CSS:
1.  **App Icon:** `border-radius: 22%`, sombra suave.
2.  **Cartão:** Retângulo branco com o logo centralizado e texto simulado abaixo.

---

## 4. Passo a Passo da Implementação

### Passo 1: Preparação
- [x] Criar as constantes (`STYLES`, `PALETTES`, `TYPO`) no topo de `GeneratePrd.tsx`.
- [x] Atualizar a interface do `geminiService.ts` para aceitar o objeto `options`.

### Passo 2: Construção da UI de Entrada
- [x] Criar o Grid de Estilos Visuais (substituindo o dropdown antigo).
- [x] Criar o Grid de Cores (bolinhas coloridas).
- [x] Criar o Seletor de Tipografia.
- [x] Implementar o Toggle "Modo Expert" e o `Textarea` condicional.

### Passo 3: Integração com Backend (Service)
- [x] Atualizar a chamada `handleGenerateLogo` em `GeneratePrd.tsx` para coletar todos os novos estados.
- [x] Refatorar a construção da string de prompt dentro de `geminiService.ts` para incorporar as novas variáveis.

### Passo 4: Visualização do Resultado
- [x] Manter a exibição da imagem principal grande.
- [ ] Adicionar abas ou miniaturas abaixo para "Preview Contextual" (Ícone de App, Header de Site).
- [ ] Adicionar exibição dos metadados gerados (Cores Hex, Fonte sugerida).

---

## 5. Exemplo de Prompt Final (Simulação)

Se o usuário selecionar:
*   **Estilo:** Minimalista
*   **Cor:** Vibrante
*   **Fonte:** Sans Serif
*   **Expert:** "Adicione um foguete sutil"

**O Prompt enviado ao Gemini Imagem será:**
> "Create a professional vector logo design for a product named 'RocketLaunch' in the 'SaaS' industry.
> The visual style should be Minimalist, clean lines, less is more. Isolate on white background.
> Use a color palette based on: Vibrant (Bright Red, Neon Green, Electric Blue).
> The typography should be Sans Serif (Modern, Geometric).
> ADDITIONAL INSTRUCTIONS: Adicione um foguete sutil."
