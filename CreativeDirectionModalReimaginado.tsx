/**
 * 🎨 MODAL: Direção Criativa Avançada - VERSÃO REIMAGINADA
 *
 * Uma experiência de co-criação guiada para o usuário definir
 * logos perfeitos com feedback visual em tempo real.
 *
 * Estrutura:
 * - 3 Passos Intuitivos (Em vez de 5 lineares)
 * - 50/50 Layout (Input | Live Preview)
 * - Validação em Tempo Real
 * - Prompt Final Visualizável
 */

import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import { ChevronDownIcon, WandIcon } from './icons/Icons';

// ============================================================================
// TIPOS E CONSTANTES
// ============================================================================

interface CreativeDirectionState {
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

// EMOTIONS - Passo 1
const EMOTIONS = [
  {
    id: 'bold',
    label: 'BOLD',
    emoji: '🚀',
    subtitle: 'Forte, Impactante',
    keywords: ['potência', 'força', 'impacto', 'destaque'],
  },
  {
    id: 'calm',
    label: 'CALM',
    emoji: '🧘',
    subtitle: 'Sereno, Tranquilo',
    keywords: ['paz', 'confiança', 'serenidade', 'estabilidade'],
  },
  {
    id: 'luxe',
    label: 'LUXE',
    emoji: '💎',
    subtitle: 'Premium, Elegante',
    keywords: ['sofisticado', 'luxo', 'elegância', 'refinamento'],
  },
  {
    id: 'playful',
    label: 'PLAYFUL',
    emoji: '🎨',
    subtitle: 'Criativo, Divertido',
    keywords: ['inovação', 'criatividade', 'dinamismo', 'modernidade'],
  },
  {
    id: 'energetic',
    label: 'ENERGETIC',
    emoji: '⚡',
    subtitle: 'Dinâmico, Rápido',
    keywords: ['velocidade', 'energia', 'movimento', 'progresso'],
  },
  {
    id: 'trustworthy',
    label: 'TRUSTWORTHY',
    emoji: '🏛️',
    subtitle: 'Seguro, Confiável',
    keywords: ['confiança', 'segurança', 'autoridade', 'profissionalismo'],
  },
];

// STYLE CATEGORIES - Passo 2
const STYLE_CATEGORIES = {
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
  classic: {
    label: 'CLÁSSICO',
    icon: '🎭',
    styles: [
      { id: 'serif', label: 'Serif' },
      { id: 'badge', label: 'Badge' },
      { id: 'vintage', label: 'Vintage' },
      { id: 'emblema', label: 'Emblema' },
    ],
  },
  creative: {
    label: 'CRIATIVO',
    icon: '🎨',
    styles: [
      { id: 'handdrawn', label: 'Hand-Drawn' },
      { id: '3d', label: '3D' },
      { id: 'abstrato', label: 'Abstrato' },
      { id: 'organic', label: 'Orgânico' },
    ],
  },
  tech: {
    label: 'TECH',
    icon: '🔮',
    styles: [
      { id: 'futurista', label: 'Futurista' },
      { id: 'neon', label: 'Neon' },
      { id: 'circuit', label: 'Circuit' },
      { id: 'gradient', label: 'Gradient' },
    ],
  },
};

// TIPOGRAFIAS - Passo 3
const TYPOGRAPHY_OPTIONS = [
  { id: 'sans', label: 'Sans-Serif', example: 'Ag', description: 'Moderno' },
  { id: 'serif', label: 'Serif', example: 'Ag', description: 'Elegante' },
  { id: 'display', label: 'Display', example: 'Ag', description: 'Impactante' },
];

// PALETAS DE CORES - Passo 3
const COLOR_PALETTES = [
  {
    id: 'quente',
    label: 'Quente',
    colors: ['#EF4444', '#F97316', '#FCD34D'],
  },
  {
    id: 'frio',
    label: 'Frio',
    colors: ['#10B981', '#06B6D4', '#3B82F6'],
  },
  {
    id: 'pastel',
    label: 'Pastel',
    colors: ['#FBCFE8', '#FCD34D', '#A5F3FC'],
  },
  {
    id: 'vibrante',
    label: 'Vibrante',
    colors: ['#FF006E', '#FFBE0B', '#8338EC'],
  },
  {
    id: 'luxo',
    label: 'Luxo',
    colors: ['#1F2937', '#D4AF37', '#EC4899'],
  },
  {
    id: 'terra',
    label: 'Terra',
    colors: ['#92400E', '#78350F', '#B45309'],
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface CreativeDirectionModalReimagiadoProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (creativeOptions: any) => void;
}

export const CreativeDirectionModalReimaginado: React.FC<
  CreativeDirectionModalReimagiadoProps
> = ({ isOpen, onClose, onGenerate }) => {
  const [state, setState] = useState<CreativeDirectionState>({
    selectedEmotion: null,
    customEmotionKeywords: '',
    styleCategory: 'modern',
    selectedStyles: [],
    colorMode: 'preset',
    colorPreset: 'quente',
    customColors: { primary: '#EF4444', secondary: '#FCD34D', accent: '#3B82F6' },
    selectedTypography: 'sans',
    mandatoryElements: '',
    forbiddenElements: '',
    showAdvanced: false,
    symbolType: null,
    visualComplexity: 5,
    targetAudience: [],
  });

  const [currentStep, setCurrentStep] = useState(1);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleSelectEmotion = (emotionId: string) => {
    setState(prev => ({
      ...prev,
      selectedEmotion: prev.selectedEmotion === emotionId ? null : emotionId,
    }));
  };

  const handleToggleStyle = (styleId: string) => {
    setState(prev => {
      const isSelected = prev.selectedStyles.includes(styleId);
      if (isSelected) {
        return {
          ...prev,
          selectedStyles: prev.selectedStyles.filter(s => s !== styleId),
        };
      } else if (prev.selectedStyles.length < 3) {
        return {
          ...prev,
          selectedStyles: [...prev.selectedStyles, styleId],
        };
      }
      return prev;
    });
  };

  const handleSelectColorPalette = (paletteId: string) => {
    setState(prev => ({
      ...prev,
      colorPreset: paletteId,
    }));
  };

  const handleSelectTypography = (typographyId: string) => {
    setState(prev => ({
      ...prev,
      selectedTypography: typographyId,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setState({
      selectedEmotion: null,
      customEmotionKeywords: '',
      styleCategory: 'modern',
      selectedStyles: [],
      colorMode: 'preset',
      colorPreset: 'quente',
      customColors: { primary: '#EF4444', secondary: '#FCD34D', accent: '#3B82F6' },
      selectedTypography: 'sans',
      mandatoryElements: '',
      forbiddenElements: '',
      showAdvanced: false,
      symbolType: null,
      visualComplexity: 5,
      targetAudience: [],
    });
    setCurrentStep(1);
  };

  // =========================================================================
  // COMPUTED VALUES
  // =========================================================================

  const selectedColorPalette = useMemo(() => {
    return COLOR_PALETTES.find(p => p.id === state.colorPreset);
  }, [state.colorPreset]);

  const selectedEmotionData = useMemo(() => {
    return EMOTIONS.find(e => e.id === state.selectedEmotion);
  }, [state.selectedEmotion]);

  const selectedTypographyData = useMemo(() => {
    return TYPOGRAPHY_OPTIONS.find(t => t.id === state.selectedTypography);
  }, [state.selectedTypography]);

  const generatedPrompt = useMemo(() => {
    const parts: string[] = [];

    if (selectedEmotionData) {
      parts.push(`Crie um logo que comunica "${selectedEmotionData.label}"`);
    }

    if (state.customEmotionKeywords) {
      parts.push(`com sentimento de: ${state.customEmotionKeywords}`);
    }

    if (state.selectedStyles.length > 0) {
      parts.push(`Estilos: ${state.selectedStyles.join(', ')}`);
    }

    if (selectedColorPalette) {
      parts.push(`Cores: ${selectedColorPalette.label}`);
    }

    if (selectedTypographyData) {
      parts.push(`Tipografia: ${selectedTypographyData.label}`);
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

    return parts.filter(Boolean).join(' | ');
  }, [
    selectedEmotionData,
    state.customEmotionKeywords,
    state.selectedStyles,
    selectedColorPalette,
    selectedTypographyData,
    state.mandatoryElements,
    state.forbiddenElements,
    state.symbolType,
    state.targetAudience,
  ]);

  const isReadyToGenerate =
    state.selectedEmotion !== null || state.customEmotionKeywords.trim() !== '';

  // =========================================================================
  // RENDERS: STEPS
  // =========================================================================

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          1. Qual é a Essência?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          O que seu logo deve comunicar? Escolha uma emoção ou descreva com
          palavras-chave.
        </p>
      </div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EMOTIONS.map(emotion => (
          <button
            key={emotion.id}
            onClick={() => handleSelectEmotion(emotion.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              state.selectedEmotion === emotion.id
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

      {/* Custom Keywords */}
      <div className="pt-4 border-t border-gray-200">
        <Textarea
          id="customKeywords"
          label="Ou descreva com suas palavras"
          placeholder="Ex: minimalista, moderno, confiável, inovador..."
          value={state.customEmotionKeywords}
          onChange={e =>
            setState(prev => ({
              ...prev,
              customEmotionKeywords: e.target.value,
            }))
          }
          rows={3}
          className="border-2"
        />
      </div>

      {/* Helper */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
        ⚡ Dica: A emoção é a base. Escolha uma para inspirar os próximos
        passos.
      </div>
    </div>
  );

  const renderStep2 = () => {
    const currentCategory = STYLE_CATEGORIES[state.styleCategory];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            2. Qual é a Personalidade?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Como seu logo deve se parecer visualmente? Escolha até 3 estilos.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {Object.entries(STYLE_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() =>
                setState(prev => ({
                  ...prev,
                  styleCategory: key as typeof state.styleCategory,
                }))
              }
              className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-all ${
                state.styleCategory === key
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
              onClick={() => handleToggleStyle(style.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                state.selectedStyles.includes(style.id)
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
        {state.selectedStyles.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <strong>Selecionado:</strong>{' '}
            <span className="text-primary">{state.selectedStyles.join(', ')}</span>
          </div>
        )}

        {/* Helper */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
          ⚡ Dica: Combine estilos diferentes para um logo único. Máximo 3.
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">3. Qual é a Voz?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Cores, tipografia e elementos que definem sua marca.
        </p>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Paleta de Cores</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_PALETTES.map(palette => (
            <button
              key={palette.id}
              onClick={() => handleSelectColorPalette(palette.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                state.colorPreset === palette.id
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

      {/* Typography */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Tipografia</h4>
        <div className="grid grid-cols-3 gap-2">
          {TYPOGRAPHY_OPTIONS.map(typo => (
            <button
              key={typo.id}
              onClick={() => handleSelectTypography(typo.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                state.selectedTypography === typo.id
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

      {/* Mandatory Elements */}
      <div>
        <Input
          id="mandatoryElements"
          label="Deve Incluir (Opcional)"
          placeholder="Ex: escudo, estrela, coroa"
          value={state.mandatoryElements}
          onChange={e =>
            setState(prev => ({
              ...prev,
              mandatoryElements: e.target.value,
            }))
          }
        />
      </div>

      {/* Forbidden Elements */}
      <div>
        <Input
          id="forbiddenElements"
          label="Evitar (Prompt Negativo)"
          placeholder="Ex: animais, cores escuras, muito detalhe"
          value={state.forbiddenElements}
          onChange={e =>
            setState(prev => ({
              ...prev,
              forbiddenElements: e.target.value,
            }))
          }
        />
      </div>

      {/* Advanced */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <button
          onClick={() =>
            setState(prev => ({
              ...prev,
              showAdvanced: !prev.showAdvanced,
            }))
          }
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <span>{state.showAdvanced ? '▼' : '▶'}</span>
          Modo Avançado
        </button>

        {state.showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Símbolo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['abstrato', 'figurativo', 'tipográfico', 'mascote'].map(
                  type => (
                    <button
                      key={type}
                      onClick={() =>
                        setState(prev => ({
                          ...prev,
                          symbolType:
                            prev.symbolType === type ? null : (type as any),
                        }))
                      }
                      className={`p-2 rounded border-2 text-sm font-semibold ${
                        state.symbolType === type
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complexidade Visual: {state.visualComplexity}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={state.visualComplexity}
                onChange={e =>
                  setState(prev => ({
                    ...prev,
                    visualComplexity: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================================
  // RENDER PREVIEW SECTION
  // =========================================================================

  const renderPreview = () => (
    <div className="space-y-6 h-full flex flex-col">
      {/* Logo Canvas Placeholder */}
      <div className="flex-1 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-4xl mb-4 opacity-50">🎨</div>
          <p className="text-gray-600 text-sm">
            {isReadyToGenerate
              ? 'Preview aparecerá aqui'
              : 'Complete o passo 1 para ver preview'}
          </p>
        </div>
      </div>

      {/* Color Palette Display */}
      {selectedColorPalette && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Paleta</h4>
          <div className="flex gap-2">
            {selectedColorPalette.colors.map((color, idx) => (
              <div
                key={idx}
                className="flex-1 h-12 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Typography Display */}
      {selectedTypographyData && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Tipografia</h4>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-2xl font-bold mb-1">ABCDEabcde 123456</p>
            <p className="text-xs text-gray-500">{selectedTypographyData.label}</p>
          </div>
        </div>
      )}

      {/* Prompt Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Seu Prompt para a IA</h4>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 italic">
          {generatedPrompt || 'Preencha os campos para gerar o prompt...'}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // RENDER MAIN
  // =========================================================================

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ Direção Criativa Avançada"
      maxWidth="7xl"
    >
      {/* Header com Progress */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-200">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Passo {currentStep} de 3 • Crie seu logo perfeito
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content: 50/50 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 h-[60vh] overflow-hidden">
        {/* LEFT: Input */}
        <div className="overflow-y-auto pr-4">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* RIGHT: Preview */}
        <div className="hidden lg:flex flex-col bg-gray-50 -m-8 p-8 rounded-r-xl overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">🎯 Seu Logo</h3>
            <p className="text-sm text-gray-600">Preview em Tempo Real</p>
          </div>
          {renderPreview()}
        </div>
      </div>

      {/* Footer: Navigation + Prompt */}
      <div className="space-y-4 px-8 py-6 bg-gray-50 border-t border-gray-200">
        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Limpar Tudo
        </button>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentStep > 1) {
                handlePrevStep();
              } else {
                onClose();
              }
            }}
          >
            <ChevronDownIcon className="w-4 h-4 mr-2 rotate-90" />
            {currentStep === 1 ? 'Voltar' : 'Anterior'}
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNextStep} className="ml-auto">
              Próximo
            </Button>
          ) : (
            <Button
              onClick={() => onGenerate(state)}
              disabled={!isReadyToGenerate}
              className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-transform"
              size="lg"
            >
              <WandIcon className="w-5 h-5 mr-2" />
              Gerar Logo
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreativeDirectionModalReimaginado;
