import React from 'react';
import { Button } from '../../Button';
import { LogoIcon, WandIcon } from '../../icons/Icons';
import type { LogoStepProps } from './types';

export const LogoStep: React.FC<LogoStepProps> = ({
  logoSuggestion,
  isReviewMode = false,
  onOpenMagicMatch,
  onRefineStyle,
  onRegenerate,
  onDownload
}) => {
  if (!logoSuggestion) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border-2 border-dashed border-gray-200 rounded-xl animate-fade-in text-center transition-all">
        <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
          <LogoIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Identidade Visual</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          A IA criará um conceito de marca, paleta de cores e uma sugestão visual de logotipo baseada no seu produto.
        </p>
        <Button onClick={onOpenMagicMatch} size="lg" className="shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-105 transition-transform">
          <WandIcon className="w-5 h-5 mr-2" />
          Criar Identidade Visual
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {!isReviewMode && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Conceito visual e Logo profissional gerado pelo modelo de imagem.</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onRefineStyle}>
              Refinar Estilo
            </Button>
            <Button size="sm" variant="secondary" onClick={onRegenerate}>Regenerar</Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Logo Display */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-64 h-64 bg-white border-2 border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-4">
            {logoSuggestion.base64Image ? (
              <img
                src={`data:image/jpeg;base64,${logoSuggestion.base64Image}`}
                alt="Generated Logo"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-center text-sm">
                Erro ao carregar imagem.<br />Tente regenerar.
              </span>
            )}
          </div>
          {logoSuggestion.base64Image && (
            <Button size="sm" variant="secondary" onClick={onDownload}>
              Download JPG
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Conceito da Marca</h4>
            <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg border border-gray-100">
              "{logoSuggestion.description}"
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Paleta de Cores</h4>
            <div className="grid grid-cols-2 gap-3">
              {logoSuggestion.palette?.map((color, i) => (
                <div key={i} className="flex items-center p-2 border rounded-lg">
                  <div className="w-8 h-8 rounded-md mr-3 shadow-sm" style={{ backgroundColor: color.hex }} />
                  <div>
                    <p className="font-mono text-xs font-bold text-gray-800">{color.hex}</p>
                    <p className="text-xs text-gray-500">{color.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
