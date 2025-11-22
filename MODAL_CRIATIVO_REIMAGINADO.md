# 🎨 Modal "Direção Criativa Avançada" - Proposta Reimaginada

## 📍 Visão Geral Estratégica

O novo modal deve ser uma **experiência de co-criação guiada**, onde o usuário conversa visualmente com a IA para definir o logo perfeito.

**Filosofia**:
- ✨ Do caótico ao claro (simplificar 20+ opções em categorizações temáticas)
- 👁️ Visual-first (nunca só texto)
- 🎯 Progressive disclosure (mostrar o essencial primeiro)
- 🔄 Real-time feedback (preview atualiza tudo)
- 💬 Conversational (guiar o usuário com perguntas, não listas)

---

## 🏗️ Nova Arquitetura (5 → 3 Passos)

### **Mudança Radical**: De Linear para Exploratório

Em vez de "Passo 1 → Passo 2 → Passo 3", vamos usar:

```
┌─────────────────────────────────────────────┐
│ CANVAS CRIATIVO: Sua Identidade Visual      │
├─────────────────────────────────────────────┤
│                                             │
│ [LEFT: Wizard/Questions]  [RIGHT: Live Preview]
│                                             │
│ 1. ❓ Qual é a Essência?    │ [Logo Preview] │
│ 2. 🎨 Qual é a Personalidade?│ [Colors]     │
│ 3. ✏️ Qual é a Voz?         │ [Typography]  │
│                             │ [Mood Board]  │
└─────────────────────────────────────────────┘
```

---

## 📐 Layout Detalhado - Versão Reimaginada

### **Dimensões Gerais**
- **Max Width**: 7xl (80rem) - mais amplo para aproveitar espaço
- **Altura**: 80vh
- **Layout Principal**: 50/50 (Left Input | Right Preview)
- **Tema**: Modern + Playful (gradients, smooth animations)

---

## 🎯 SEÇÃO ESQUERDA: Wizard Interativo (50%)

### **Header do Wizard**
```
┌────────────────────────────────────┐
│ ✨ Crie Seu Logo Perfeito          │
│ Guia a IA com detalhes visuais     │
│                                    │
│ [Progress Indicator: 1/3 | 2/3 | 3/3]
│ ═════════════════════════════════  │
└────────────────────────────────────┘
```

**Componente**:
- Título atraente + subtítulo
- Progress bar animada (0% → 100%)
- Indica o passo atual com visual

---

### **Passo 1️⃣: Qual é a Essência?** (Vision + Identity)

**Pergunta guia**: "O que seu logo deve comunicar em uma palavra?"

**Layout**:
```
┌─────────────────────────────────────┐
│ 1. QUAL É A ESSÊNCIA?               │
│    [Help Icon] Ajuda: Identidade... │
├─────────────────────────────────────┤
│                                     │
│ [Emotion Grid - 6 cards clicáveis]  │
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │🚀 BOLD│ │🧘 CALM│ │💎 LUX │      │
│ │Forte  │ │Calmo  │ │Premium│      │
│ └───────┘ └───────┘ └───────┘      │
│                                     │
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │🎨 PLAY│ │⚡ENERGY│ │🏛️TRUST│      │
│ │Criativo│ │Dinâmico│ │Confiável│   │
│ └───────┘ └───────┘ └───────┘      │
│                                     │
│ [Texto adicional]                   │
│ Ou descreva com palavras-chave:    │
│ ┌──────────────────────────────┐    │
│ │ [Placeholder: minimalista,   │    │
│ │  moderno, corporativo...]    │    │
│ └──────────────────────────────┘    │
│                                     │
│ ⚡ Dica: Escolha a emoção primeira  │
└─────────────────────────────────────┘
```

**Elementos**:
1. **Emotion Grid** (6 cards pré-definidos):
   - BOLD (Forte, Impactante) → ícone 🚀
   - CALM (Calmo, Sereno) → ícone 🧘
   - LUXE (Premium, Elegante) → ícone 💎
   - PLAYFUL (Criativo, Divertido) → ícone 🎨
   - ENERGETIC (Dinâmico, Rápido) → ícone ⚡
   - TRUSTWORTHY (Seguro, Confiável) → ícone 🏛️

2. **Texto Custom** (opcional):
   - Input com placeholder de exemplos
   - Tags auto-geradas com sugestões IA

**State**:
```typescript
selectedEmotion: string | null              // Single select
customEmotionKeywords: string[]             // Multiple text inputs
```

---

### **Passo 2️⃣: Qual é a Personalidade?** (Style + Visual Language)

**Pergunta guia**: "Como seu logo deve se parecer?"

**Layout**:
```
┌──────────────────────────────────────┐
│ 2. QUAL É A PERSONALIDADE?           │
│    [Help Icon] Ajuda: Visual Style   │
├──────────────────────────────────────┤
│                                      │
│ [Style Category Tabs]                │
│ ┌──────┬──────┬──────┬──────┐       │
│ │MODERN│CLASSIC│CREATIVE│TECH│       │
│ └──────┴──────┴──────┴──────┘       │
│                                      │
│ [MODERN Tab Content - Grid]          │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │MIN. │ │FLAT │ │CLEAN│ │GEOMET│  │
│ │░░░░░│ │░░░░░│ │░░░░░│ │░░░░░│  │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                      │
│ [CLASSIC Tab Content - Grid]         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │SERIF│ │BADGE│ │VINTAGE│EMBLEM│  │
│ │░░░░░│ │░░░░░│ │░░░░░│ │░░░░░│  │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                      │
│ [CREATIVE Tab Content - Grid]        │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │HAND │ │3D   │ │ABSTRACT│CUSTOM│ │
│ │░░░░░│ │░░░░░│ │░░░░░│ │░░░░░│  │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                      │
│ [TECH Tab Content - Grid]            │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │FUTUR│ │NEON │ │CIRCUIT│SCAN  │   │
│ │░░░░░│ │░░░░░│ │░░░░░│ │░░░░░│   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                      │
│ ⚡ Dica: Selecione até 3 estilos    │
│ Você selecionou: Minimalista, Flat  │
│ [Remove]                             │
└──────────────────────────────────────┘
```

**Elementos**:
1. **Style Categories** (4 tabs com submenu):
   - **MODERN**: Minimalista, Flat, Clean, Geométrico
   - **CLASSIC**: Serif, Badge, Vintage, Emblema
   - **CREATIVE**: Hand-drawn, 3D, Abstrato, Custom
   - **TECH**: Futurista, Neon, Circuit, Scan

2. **Grid de Seleção**:
   - Cada estilo tem visual preview pequeno (ícone SVG)
   - Max 3 seleções (multi-select com badges)
   - Remove com "x" ao lado do badge

**State**:
```typescript
styleCategory: 'modern' | 'classic' | 'creative' | 'tech'
selectedStyles: string[]                // Max 3
```

---

### **Passo 3️⃣: Qual é a Voz?** (Colors + Typography + Elements)

**Pergunta guia**: "Quais cores e tipografia definem sua marca?"

**Layout (Três Sub-seções)**:

```
┌──────────────────────────────────────┐
│ 3. QUAL É A VOZ?                     │
│    [Help Icon] Ajuda: Cores, Fontes  │
├──────────────────────────────────────┤
│                                      │
│ 📍 SUB-PASSO 3A: Paleta de Cores    │
│ ─────────────────────────────────    │
│ [Seleção rápida de paletas]         │
│ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│ │●●●Quente │ │●●●Frio   │ │●●●   │ │
│ │#EF4444   │ │#10B981   │ │Custom│ │
│ └──────────┘ └──────────┘ └──────┘ │
│                                      │
│ Ou customize:                        │
│ ┌──────────────────────────────┐    │
│ │ Cor Primária:  [#EF4444]    │    │
│ │ Cor Secundária:[#FCD34D]    │    │
│ │ Cor Acentuada: [#10B981]    │    │
│ └──────────────────────────────┘    │
│                                      │
│ 📍 SUB-PASSO 3B: Tipografia        │
│ ─────────────────────────────────    │
│ [Grid 3 opções - single select]     │
│ ┌────────┐ ┌────────┐ ┌────────┐   │
│ │Sans Serif│ │Serif    │ │Display  │ │
│ │Ag modern  │ │Ag elegant│ │Ag Bold │ │
│ └────────┘ └────────┘ └────────┘   │
│                                      │
│ 📍 SUB-PASSO 3C: Elementos Adicionais
│ ─────────────────────────────────    │
│ [Multi-input para elementos]         │
│ ┌─────────────────────────────┐     │
│ │ Deve incluir:               │     │
│ │ [x] Shield  [x] Star       │     │
│ │ [+] Adicionar             │     │
│ └─────────────────────────────┘     │
│                                      │
│ [x] Adicionar elementos proibidos:  │
│ ┌─────────────────────────────┐     │
│ │ Evitar:                     │     │
│ │ [-] Animais  [-] Escuro     │     │
│ │ [+] Adicionar              │     │
│ └─────────────────────────────┘     │
└──────────────────────────────────────┘
```

**Elementos**:
1. **Paleta de Cores** (2 formas):
   - Quick presets (Quente, Frio, Vibrante, Pastel, Luxo, Terra)
   - Custom color pickers (3 cores)

2. **Tipografia** (3 opções com preview):
   - Sans-Serif (Modern)
   - Serif (Elegant)
   - Display (Bold)

3. **Elementos Adicionais**:
   - Checklist: Shield, Star, Circle, Diamond, Arrow, etc.
   - Proibições: Animais, Escuro, Detalhe, etc.

**State**:
```typescript
colorPalette: 'preset' | 'custom'
colorPreset: string                     // Quente, Frio, etc.
customColors: { primary: string, secondary: string, accent: string }
selectedTypography: string
mandatoryElements: string[]
forbiddenElements: string[]
```

---

### **Sub-seção: Modo Avançado (Colapsável)**

```
┌──────────────────────────────────────┐
│ [▼] Modo Avançado: Refinamentos      │
├──────────────────────────────────────┤
│                                      │
│ Complexidade Visual:                 │
│ [Simples ──●────── Complexo]        │
│                                      │
│ Tipo de Símbolo:                     │
│ ○ Abstrato   ○ Figurativo            │
│ ○ Tipográfico ○ Mascote              │
│                                      │
│ Público-alvo:                        │
│ [Corporate] [Startup] [Criativo]    │
│ [Infantil] [Premium] [Popular]      │
│                                      │
│ Inspirações (URLs para referências): │
│ ┌──────────────────────────────┐    │
│ │ [Paste URLs de logos aqui]   │    │
│ └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

---

## 🎨 SEÇÃO DIREITA: Canvas de Preview (50%)

### **Header do Preview**
```
┌────────────────────────────────────┐
│ 🎯 SEU LOGO PERFEITO                │
│    Preview em Tempo Real             │
└────────────────────────────────────┘
```

### **Live Preview Sections**

#### **1. Logo Canvas** (Central)
```
┌─────────────────────────────┐
│                             │
│          [LOGO PREVIEW]     │
│       (Animated SVG)        │
│                             │
│   Gerado pela IA conforme   │
│   você seleciona opções     │
│                             │
└─────────────────────────────┘
```

**Comportamento**:
- Atualiza em tempo real com cada mudança
- Mostra o logo sendo "pintado" (animation)
- Fallback: Placeholder até gerar primeira versão

#### **2. Color Palette Preview**
```
┌─────────────────────────────┐
│ PALETA GERADA               │
│ ┌──┐ ┌──┐ ┌──┐              │
│ │PA│ │SA│ │AC│              │
│ │#E│ │#F│ │#1│              │
│ └──┘ └──┘ └──┘              │
│                             │
│ Harmonia: ████████░░        │
│ Contraste: ██████░░░░       │
│ Acessibilidade: ██████████ ✓│
└─────────────────────────────┘
```

#### **3. Typography Preview**
```
┌─────────────────────────────┐
│ TIPOGRAFIA                  │
│                             │
│ AaBbCc 123456 !@#           │
│ [Font Name] [Weight]        │
│                             │
│ Legibilidade: ████████░░ ✓  │
└─────────────────────────────┘
```

#### **4. Mood Board / Referências**
```
┌─────────────────────────────┐
│ ATMOSFERA                   │
│                             │
│ [Amostra de elementos       │
│  combinados visualmente]    │
│                             │
│ Ícones: ✓ (Viável)          │
│ Balanceado: ✓ (Ótimo)       │
└─────────────────────────────┘
```

---

## ⚙️ Footer: Ações e Prompt Preview

### **Layout**
```
┌──────────────────────────────────────┐
│                                      │
│ [Toggle] Modo Avançado               │
│ [Reset] Limpar Tudo                  │
│                                      │
│ ════════════════════════════════════ │
│                                      │
│ 📝 SEU PROMPT FINAL PARA A IA        │
│                                      │
│ ┌──────────────────────────────┐    │
│ │ "Crie um logo que comunica   │    │
│ │ inovação. Minimalista e Flat │    │
│ │ com cores quentes. Geométrico│    │
│ │ com foco em simplicidade.    │    │
│ │ Evite animais e cores escuras│    │
│ │ Inclua elementos de escudo.  │    │
│ │ Tipografia sans-serif moderna│    │
│ │ Público: Startups inovadoras."   │    │
│ │                              │    │
│ │ [Copy] [Edit] [Expand]       │    │
│ └──────────────────────────────┘    │
│                                      │
│ ════════════════════════════════════ │
│                                      │
│ [Voltar]           [Gerar Logo ➜]   │
│ (com preview        (gradient,       │
│  com Piloto Auto)   lg, disabled     │
│                     if !essência)    │
└──────────────────────────────────────┘
```

**Elementos**:
1. **Toggle + Reset Buttons**
2. **Prompt Preview**:
   - Texto completo gerado dinamicamente
   - Botões: Copy, Edit, Expand
3. **Action Buttons**:
   - Voltar (ghost)
   - Gerar Logo (gradient, primary)

---

## 🎬 Animações e Interações

### **1. Transições**
- **Passo → Passo**: Fade out + Slide up
- **Seleção**: Bounce animation (scale 1 → 1.05 → 1)
- **Preview Update**: Smooth transition com loading pulse

### **2. Validação Interativa**
- ✓ Logo gerado → Green check
- ⚠️ Muitas opções → Toast warning + subtle shake
- ✅ Pronto para gerar → Button glow

### **3. Loading States**
```
Gerando logo...
[████░░░░░░░░░░░░░░] 20%

Analisando paleta...
[██████████░░░░░░░░] 50%

Refinando tipografia...
[██████████████████] 100%
```

---

## 📊 Mapeamento de Estados

```typescript
// Passo 1: Essência
selectedEmotion: string | null
customEmotionKeywords: string[]

// Passo 2: Personalidade
styleCategory: 'modern' | 'classic' | 'creative' | 'tech'
selectedStyles: string[]                  // max 3

// Passo 3: Voz
colorMode: 'preset' | 'custom'
colorPreset: string                       // Quente, Frio, etc.
customColors: { primary, secondary, accent }
selectedTypography: string
mandatoryElements: string[]
forbiddenElements: string[]

// Avançado
symbolType: 'abstrato' | 'figurativo' | 'tipográfico' | 'mascote'
visualComplexity: number                  // 1-10 slider
targetAudience: string[]
inspirationUrls: string[]

// Display
currentStep: 1 | 2 | 3
logoPreview: string | null                // Base64 image
generatedPrompt: string                   // Computed
```

---

## 🔄 Fluxo de Dados

```
[User Input: Emotion]
    ↓
emotionPreset → customKeywords → generatedPrompt preview
    ↓
[User Input: Style]
    ↓
selectedStyles → visual preview → prompt update
    ↓
[User Input: Colors/Typography/Elements]
    ↓
customColors + typography + elements → palette preview
    ↓
[User clicks "Gerar Logo"]
    ↓
Final Prompt Construction
    ├─ "Crie um logo que comunica: [emotion]"
    ├─ "Estilos: [styles]"
    ├─ "Cores: [colorPalette]"
    ├─ "Tipografia: [typography]"
    ├─ "Inclua: [mandatoryElements]"
    ├─ "Evite: [forbiddenElements]"
    ├─ "Público: [targetAudience]"
    └─ "Símbolos: [symbolType]"
    ↓
geminiService.generateLogo(finalPrompt)
```

---

## 🎯 Diferenciais da Versão Reimaginada

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Estrutura** | 5 passos lineares | 3 passos + sub-passos intuitivos |
| **Layout** | 2 colunas fixo | 50/50 dinâmico com preview ao vivo |
| **Opções** | 20+ opções soltas | Categorizadas em temas |
| **Navegação** | Scroll infinito | Categorizado em abas |
| **Validação** | Apenas campo vazio | Feedback visual em tempo real |
| **Preview** | Apenas texto | Multimodal (logo + cores + tipos) |
| **Guidance** | Nenhuma | Perguntas guia + dicas contextuais |
| **Acessibilidade** | Botões pequenos | Cards maiores + emoticons |
| **Progresso** | Nenhuma indicação | Progress bar animada |
| **Modo Avançado** | Tudo misturado | Colapsável, para expert users |

---

## 🚀 Implementação: Próximos Passos

1. **Criar componentes auxiliares**:
   - `EmotionGrid.tsx`
   - `StyleCategoryTabs.tsx`
   - `ColorPaletteSelector.tsx`
   - `PreviewCanvas.tsx`
   - `PromptPreview.tsx`

2. **Refatorar estado** no GeneratePrd.tsx

3. **Atualizar constantes**:
   - EMOTIONS (6 emoções com ícones)
   - STYLE_CATEGORIES (4 categorias × múltiplos estilos)
   - TYPOGRAPHY_OPTIONS (3 opções)

4. **Integrar com Gemini**:
   - Suportar múltiplos prompts
   - Live preview updates

5. **Testes**:
   - UX flow testing
   - Visual regression tests
   - Accessibility audit

---

