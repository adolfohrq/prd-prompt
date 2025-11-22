# 🚀 Guia de Implementação - Modal Reimaginado

## 📋 Visão Geral

Este guia detalha como implementar o modal "Direção Criativa Avançada" reimaginado no projeto.

---

## 🏗️ Arquitetura de Componentes

### Hierarquia de Componentes

```
CreativeDirectionModalReimaginado (Main Container)
├── Header (Progress Bar)
├── Content Grid (50/50)
│   ├── Left (Input Section)
│   │   ├── Step1: EmotionGrid
│   │   │   ├── EmotionCard (×6)
│   │   │   └── CustomKeywordsInput
│   │   ├── Step2: StyleCategoryTabs
│   │   │   ├── CategoryTab (×4)
│   │   │   └── StyleGrid
│   │   │       └── StyleCard (×4)
│   │   └── Step3: VoiceConfiguration
│   │       ├── ColorPaletteSelector
│   │       │   ├── PresetPalette (×6)
│   │       │   └── CustomColorPicker
│   │       ├── TypographySelector
│   │       │   └── TypographyCard (×3)
│   │       ├── ElementsInput
│   │       └── AdvancedOptionsToggle
│   │           ├── SymbolTypeSelector
│   │           ├── ComplexitySlider
│   │           └── AudienceSelector
│   └── Right (Preview Section)
│       ├── LogoCanvas (Placeholder/Generated)
│       ├── ColorPaletteDisplay
│       ├── TypographyDisplay
│       └── PromptPreview
└── Footer
    ├── ResetButton
    ├── NavigationButtons
    │   ├── PrevButton
    │   └── NextButton / GenerateButton
    └── PromptFinalPreview
```

---

## 📁 Arquivos a Criar

### 1. **Componentes Auxiliares**

```
components/
├── CreativeDirectionModal/
│   ├── CreativeDirectionModalReimaginado.tsx (main)
│   ├── EmotionGrid.tsx
│   ├── StyleCategoryTabs.tsx
│   ├── ColorPaletteSelector.tsx
│   ├── TypographySelector.tsx
│   ├── PromptPreview.tsx
│   └── PreviewCanvas.tsx
└── (outros componentes já existentes)
```

### 2. **Tipos e Constantes**

```
types.ts (adicionar tipos)
├── CreativeDirectionState
├── Emotion
├── StyleCategory
├── ColorPalette
└── Typography

constants.ts (adicionar/atualizar)
├── EMOTIONS
├── STYLE_CATEGORIES
├── COLOR_PALETTES
├── TYPOGRAPHY_OPTIONS
├── SYMBOL_TYPES
└── TARGET_AUDIENCES
```

---

## 🔧 Implementação Passo a Passo

### Passo 1: Definir Tipos e Constantes

#### `types.ts` - Adicionar tipos

```typescript
// Creative Direction State
export interface CreativeDirectionState {
  // Passo 1: Essência
  selectedEmotion: string | null;
  customEmotionKeywords: string;

  // Passo 2: Personalidade
  styleCategory: 'modern' | 'classic' | 'creative' | 'tech';
  selectedStyles: string[];

  // Passo 3: Voz
  colorMode: 'preset' | 'custom';
  colorPreset: string;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  selectedTypography: string;
  mandatoryElements: string;
  forbiddenElements: string;

  // Avançado
  showAdvanced: boolean;
  symbolType: 'abstrato' | 'figurativo' | 'tipográfico' | 'mascote' | null;
  visualComplexity: number;
  targetAudience: string[];
}

export interface Emotion {
  id: string;
  label: string;
  emoji: string;
  subtitle: string;
  keywords: string[];
}

export interface StyleCategory {
  label: string;
  icon: string;
  styles: Array<{ id: string; label: string }>;
}

export interface ColorPalette {
  id: string;
  label: string;
  colors: string[];
}

export interface Typography {
  id: string;
  label: string;
  example: string;
  description: string;
}
```

#### `constants.ts` - Adicionar constantes

```typescript
export const EMOTIONS: Emotion[] = [
  {
    id: 'bold',
    label: 'BOLD',
    emoji: '🚀',
    subtitle: 'Forte, Impactante',
    keywords: ['potência', 'força', 'impacto', 'destaque'],
  },
  // ... 5 mais (vide arquivo do componente)
];

export const STYLE_CATEGORIES: Record<string, StyleCategory> = {
  modern: {
    label: 'MODERNO',
    icon: '✨',
    styles: [
      { id: 'minimalista', label: 'Minimalista' },
      { id: 'flat', label: 'Flat Design' },
      { id: 'clean', label: 'Clean' },
      { id: 'geometrico', label: 'Geométrico' },
    ],
  },
  // ... 3 mais (classic, creative, tech)
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'quente',
    label: 'Quente',
    colors: ['#EF4444', '#F97316', '#FCD34D'],
  },
  // ... 5 mais
];

export const TYPOGRAPHY_OPTIONS: Typography[] = [
  { id: 'sans', label: 'Sans-Serif', example: 'Ag', description: 'Moderno' },
  { id: 'serif', label: 'Serif', example: 'Ag', description: 'Elegante' },
  { id: 'display', label: 'Display', example: 'Ag', description: 'Impactante' },
];

export const SYMBOL_TYPES = ['abstrato', 'figurativo', 'tipográfico', 'mascote'];

export const TARGET_AUDIENCES = [
  'Corporativo',
  'Startup',
  'Criativo',
  'Infantil',
  'Premium',
  'Popular',
];
```

---

### Passo 2: Criar Componentes Auxiliares

#### `components/CreativeDirectionModal/EmotionGrid.tsx`

```typescript
import React from 'react';
import { Emotion } from '../../types';

interface EmotionGridProps {
  emotions: Emotion[];
  selected: string | null;
  onSelect: (emotionId: string) => void;
}

export const EmotionGrid: React.FC<EmotionGridProps> = ({
  emotions,
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {emotions.map(emotion => (
        <button
          key={emotion.id}
          onClick={() => onSelect(emotion.id)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            selected === emotion.id
              ? 'border-primary bg-primary/5 ring-2 ring-primary/30 scale-105'
              : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
          }`}
        >
          <div className="text-3xl mb-2">{emotion.emoji}</div>
          <div className="font-bold text-sm text-gray-900">{emotion.label}</div>
          <div className="text-xs text-gray-500 mt-1">{emotion.subtitle}</div>
        </button>
      ))}
    </div>
  );
};
```

#### `components/CreativeDirectionModal/StyleCategoryTabs.tsx`

```typescript
import React from 'react';
import { StyleCategory } from '../../types';

interface StyleCategoryTabsProps {
  categories: Record<string, StyleCategory>;
  selectedCategory: string;
  selectedStyles: string[];
  onSelectCategory: (categoryKey: string) => void;
  onSelectStyle: (styleId: string) => void;
}

export const StyleCategoryTabs: React.FC<StyleCategoryTabsProps> = ({
  categories,
  selectedCategory,
  selectedStyles,
  onSelectCategory,
  onSelectStyle,
}) => {
  const currentCategory = categories[selectedCategory];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => onSelectCategory(key)}
            className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-all ${
              selectedCategory === key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {currentCategory.styles.map(style => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
              selectedStyles.includes(style.id)
                ? 'border-primary bg-primary/5 ring-2 ring-primary/30 scale-105'
                : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
            }`}
          >
            <div className="font-semibold text-sm text-gray-900">
              {style.label}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Count */}
      {selectedStyles.length > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          <strong>Selecionado:</strong>{' '}
          <span className="text-primary">{selectedStyles.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
```

#### `components/CreativeDirectionModal/ColorPaletteSelector.tsx`

```typescript
import React from 'react';
import { ColorPalette } from '../../types';

interface ColorPaletteSelectorProps {
  palettes: ColorPalette[];
  selected: string;
  onSelect: (paletteId: string) => void;
}

export const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({
  palettes,
  selected,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Paleta de Cores</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {palettes.map(palette => (
          <button
            key={palette.id}
            onClick={() => onSelect(palette.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selected === palette.id
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex gap-1.5 mb-2">
              {palette.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              {palette.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### `components/CreativeDirectionModal/TypographySelector.tsx`

```typescript
import React from 'react';
import { Typography } from '../../types';

interface TypographySelectorProps {
  options: Typography[];
  selected: string;
  onSelect: (typographyId: string) => void;
}

export const TypographySelector: React.FC<TypographySelectorProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Tipografia</h4>
      <div className="grid grid-cols-3 gap-2">
        {options.map(typo => (
          <button
            key={typo.id}
            onClick={() => onSelect(typo.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selected === typo.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="text-xl font-bold mb-1">{typo.example}</div>
            <div className="text-xs font-semibold text-gray-700">
              {typo.label}
            </div>
            <div className="text-xs text-gray-500">{typo.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### `components/CreativeDirectionModal/PromptPreview.tsx`

```typescript
import React from 'react';
import Button from '../Button';

interface PromptPreviewProps {
  prompt: string;
  isReady: boolean;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({
  prompt,
  isReady,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">
        Seu Prompt para a IA
      </h4>
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 italic">
        {prompt || 'Preencha os campos para gerar o prompt...'}
      </div>
      {isReady && (
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Copiar
          </button>
        </div>
      )}
    </div>
  );
};
```

---

### Passo 3: Integrar no GeneratePrd.tsx

#### Substituir a função `renderCreativeDirectionModal`

```typescript
import { CreativeDirectionModalReimaginado } from '../components/CreativeDirectionModal/CreativeDirectionModalReimaginado';

// No componente GeneratePrd:

// State adicional para o novo modal
const [currentStep, setCurrentStep] = useState(1);

// Handler para geração
const handleGenerateLogoFromCreative = (creativeOptions: any) => {
  // Construir prompt final
  const finalPrompt = buildFinalPrompt(creativeOptions);

  // Fechar modal
  setIsCreativeDirectionModalOpen(false);

  // Gerar logo
  handleGenerateLogo(finalPrompt);
};

// Helper para construir prompt
const buildFinalPrompt = (state: CreativeDirectionState): string => {
  const parts: string[] = [];

  const emotion = EMOTIONS.find(e => e.id === state.selectedEmotion);
  if (emotion) {
    parts.push(`Crie um logo que comunica "${emotion.label}"`);
  }

  if (state.customEmotionKeywords) {
    parts.push(`com sentimento de: ${state.customEmotionKeywords}`);
  }

  if (state.selectedStyles.length > 0) {
    parts.push(`Estilos: ${state.selectedStyles.join(', ')}`);
  }

  const palette = COLOR_PALETTES.find(p => p.id === state.colorPreset);
  if (palette) {
    parts.push(`Cores: ${palette.label}`);
  }

  const typo = TYPOGRAPHY_OPTIONS.find(t => t.id === state.selectedTypography);
  if (typo) {
    parts.push(`Tipografia: ${typo.label}`);
  }

  if (state.mandatoryElements) {
    parts.push(`Deve incluir: ${state.mandatoryElements}`);
  }

  if (state.forbiddenElements) {
    parts.push(`Evite: ${state.forbiddenElements}`);
  }

  if (state.symbolType) {
    parts.push(`Tipo de símbolo: ${state.symbolType}`);
  }

  if (state.targetAudience.length > 0) {
    parts.push(`Público-alvo: ${state.targetAudience.join(', ')}`);
  }

  return parts.join(' | ');
};

// Renderizar novo modal
return (
  <>
    {/* Outros componentes... */}

    <CreativeDirectionModalReimaginado
      isOpen={isCreativeDirectionModalOpen}
      onClose={() => setIsCreativeDirectionModalOpen(false)}
      onGenerate={handleGenerateLogoFromCreative}
    />
  </>
);
```

---

### Passo 4: Atualizar Constantes

Adicionar/atualizar em `constants.ts`:

```typescript
export const EMOTIONS = [...]; // Vide acima
export const STYLE_CATEGORIES = {...}; // Vide acima
export const COLOR_PALETTES = [...]; // Vide acima
export const TYPOGRAPHY_OPTIONS = [...]; // Vide acima
```

---

## 🎨 Customizações Visuais

### Tailwind Classes Necessárias

O projeto já usa Tailwind, então todas as classes devem funcionar. Se necessário, adicione em `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)', // Ajustar conforme projeto
      },
    },
  },
};
```

### Animações

Adicionar em `globals.css` ou `tailwind.config.js`:

```css
@keyframes bounce-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-bounce-scale {
  animation: bounce-scale 0.3s ease-in-out;
}
```

---

## 📱 Responsiveness

Breakpoints Tailwind padrão:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

O layout é responsivo:
- **Mobile**: Stack vertical (full width)
- **Tablet**: 50/50 grid
- **Desktop**: Full 50/50 com preview ao vivo

---

## 🧪 Testes Recomendados

### Unit Tests
```typescript
// test/CreativeDirectionModal.test.tsx

describe('CreativeDirectionModalReimaginado', () => {
  test('renders emotion grid on step 1', () => {});
  test('selects emotion and updates preview', () => {});
  test('validates max 3 styles selection', () => {});
  test('generates correct prompt', () => {});
  test('progresses through steps', () => {});
});
```

### E2E Tests
```typescript
// test/e2e/creative-direction.e2e.ts

describe('Creative Direction Flow', () => {
  test('user can complete full flow', () => {});
  test('generates logo with selected options', () => {});
  test('prompt matches selections', () => {});
});
```

---

## 🚀 Checklist de Implementação

- [ ] Adicionar tipos em `types.ts`
- [ ] Adicionar constantes em `constants.ts`
- [ ] Criar componente `EmotionGrid.tsx`
- [ ] Criar componente `StyleCategoryTabs.tsx`
- [ ] Criar componente `ColorPaletteSelector.tsx`
- [ ] Criar componente `TypographySelector.tsx`
- [ ] Criar componente `PromptPreview.tsx`
- [ ] Criar componente `CreativeDirectionModalReimaginado.tsx`
- [ ] Integrar no `GeneratePrd.tsx`
- [ ] Testes de progresso visual
- [ ] Testes de validação
- [ ] Testes de geração de prompt
- [ ] Testes de responsiveness
- [ ] Testes de acessibilidade
- [ ] Ajustes de UX baseados em feedback
- [ ] Deploy

---

## 🔗 Referências de Integração

### Como substituir o modal antigo

```typescript
// ANTES (remover)
const renderCreativeDirectionModal = () => { ... };

// DEPOIS (usar novo)
import { CreativeDirectionModalReimaginado } from '../components/CreativeDirectionModal/CreativeDirectionModalReimaginado';
```

### Como ligar no botão existente

```typescript
// O botão "Usar Editor Criativo" já chama setIsCreativeDirectionModalOpen(true)
// Só precisa renderizar o novo modal em seu lugar
```

---

## 📝 Notas de Desenvolvimento

1. **State Management**: O novo modal usa seu próprio estado interno, não precisa mudar GeneratePrd
2. **Compatibilidade**: Mantém a mesma função `handleGenerateLogo`
3. **Tipo de Validação**: Validação é feita no componente
4. **Performance**: Usa `useMemo` para computar prompt final
5. **Acessibilidade**: Inclui labels, títulos e hints

---

