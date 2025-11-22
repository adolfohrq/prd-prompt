import React from 'react';
import { Modal } from '../../Modal';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Textarea } from '../../Textarea';
import { ChevronDownIcon, WandIcon } from '../../icons/Icons';
import { LOGO_STYLES, CREATIVE_COLORS, TYPOGRAPHY_OPTIONS } from '../../../constants/logoStyles.tsx';
import type { CreativeDirectionModalProps } from '../types';

export const CreativeDirectionModal: React.FC<CreativeDirectionModalProps> = ({
  isOpen,
  onClose,
  onGenerateLogo,
  onBackToMagicMatch,
  logoInspiration,
  setLogoInspiration,
  creativeStyle,
  setCreativeStyle,
  creativeColors,
  setCreativeColors,
  creativeTypography,
  setCreativeTypography,
  creativeElements,
  setCreativeElements,
  creativeNegative,
  setCreativeNegative
}) => {
  // Helper function for multi-select state
  const handleMultiSelect = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const MAX_SELECTIONS = 3;
    if (state.includes(value)) {
      setter(state.filter(item => item !== value));
    } else {
      if (state.length < MAX_SELECTIONS) {
        setter([...state, value]);
      }
    }
  };

  const generatedPromptPreview = [
    logoInspiration,
    creativeStyle.length > 0 ? `Estilos: ${creativeStyle.join(', ')}.` : '',
    creativeColors.length > 0 ? `Cores: ${creativeColors.join(', ')}.` : '',
    creativeTypography ? `Tipografia: ${creativeTypography}.` : '',
    creativeElements ? `Deve incluir: ${creativeElements}.` : '',
    creativeNegative ? `Não deve incluir: ${creativeNegative}.` : ''
  ].filter(Boolean).join(' ');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direção Criativa Avançada"
      maxWidth="5xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[75vh]">
        {/* LEFT: Inputs */}
        <div className="p-8 space-y-6 bg-white overflow-y-auto">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Passo 1: Descreva sua Visão</h3>
            <p className="text-sm text-gray-500 mb-4">Qual é a ideia central ou sentimento que o logo deve transmitir?</p>
            <Textarea
              id="logoInspiration"
              placeholder="Ex: Um tigre forte e minimalista para uma marca de café..."
              value={logoInspiration}
              onChange={(e) => setLogoInspiration(e.target.value)}
              rows={5}
              className="border-2 focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Passo 2: Especifique os Detalhes</h3>
            <p className="text-sm text-gray-500 mb-4">Seja específico para refinar o resultado da IA.</p>
            <div className="space-y-4">
              <Input
                id="creativeElements"
                label="Elementos Obrigatórios (Opcional)"
                placeholder="Ex: um escudo, uma coroa, um livro"
                value={creativeElements}
                onChange={e => setCreativeElements(e.target.value)}
              />
              <Input
                id="creativeNegative"
                label="O que Evitar (Prompt Negativo)"
                placeholder="Ex: sem animais, cores escuras, muito detalhe"
                value={creativeNegative}
                onChange={e => setCreativeNegative(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Visual Choices & Preview */}
        <div className="p-8 space-y-6 bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto">
          {/* Visual Styles */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Passo 3: Escolha até 3 Estilos</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {LOGO_STYLES.slice(0, 12).map(style => {
                const isSelected = creativeStyle.includes(style.id);
                return (
                  <button
                    key={style.id}
                    onClick={() => handleMultiSelect(style.id, creativeStyle, setCreativeStyle)}
                    title={style.label}
                    className={`group relative flex flex-col items-center text-center rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                      isSelected ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
                    }`}
                  >
                    <div className="w-full h-16 bg-white flex items-center justify-center">{style.renderVisual()}</div>
                    <div className={`w-full p-2 text-xs font-semibold border-t ${isSelected ? 'bg-primary/5 text-primary' : 'bg-gray-100 text-gray-700'}`}>{style.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Passo 4: Escolha até 3 Paletas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CREATIVE_COLORS.map(palette => {
                const isSelected = creativeColors.includes(palette.id);
                return (
                  <button
                    key={palette.id}
                    onClick={() => handleMultiSelect(palette.id, creativeColors, setCreativeColors)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all ${
                      isSelected ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex -space-x-1.5">
                      {palette.colors.map(c => <div key={c} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{palette.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Typography */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Passo 5: Escolha a Tipografia</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TYPOGRAPHY_OPTIONS.map((type) => {
                const isSelected = creativeTypography === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setCreativeTypography(type.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                      isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30 scale-105' : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <span className="text-sm font-semibold">{type.label.split('(')[0]}</span>
                    <span className={`text-xl ${type.font || ''} opacity-80`}>{type.example}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Prompt Preview */}
          <div className="mt-auto pt-6 border-t border-gray-200 flex-shrink-0">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Seu Prompt para a IA</h4>
            <div className="p-4 rounded-lg bg-gray-200 text-gray-700 text-sm min-h-[80px] italic">
              {generatedPromptPreview || <span className="text-gray-400">Comece a preencher para ver a mágica...</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onBackToMagicMatch}
        >
          <ChevronDownIcon className="w-4 h-4 mr-2 rotate-90" />
          Voltar
        </Button>
        <Button
          onClick={onGenerateLogo}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-transform"
          size="lg"
          disabled={!logoInspiration}
        >
          <WandIcon className="w-5 h-5 mr-2" />
          Gerar Logo com Direção Criativa
        </Button>
      </div>
    </Modal>
  );
};
