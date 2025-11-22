import React from 'react';
import type { BrandTabProps } from './types';

export const BrandTab: React.FC<BrandTabProps> = ({ logoSuggestion }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-bold text-gray-900">Identidade Visual</h2>
        <p className="text-gray-500">Conceito de marca, logo e paleta de cores.</p>
      </div>

      {logoSuggestion && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-200 shadow-inner break-inside-avoid">
            {logoSuggestion.base64Image ? (
              <img
                src={`data:image/jpeg;base64,${logoSuggestion.base64Image}`}
                alt="Logo"
                className="max-w-full max-h-80 object-contain drop-shadow-lg"
              />
            ) : logoSuggestion.svgCode ? (
              <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: logoSuggestion.svgCode }} />
            ) : (
              <span className="text-gray-400">Sem imagem</span>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Conceito da Marca</h3>
              <p className="text-blue-800 text-sm leading-relaxed italic">
                "{logoSuggestion.description}"
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Paleta de Cores</h3>
              <div className="grid grid-cols-2 gap-4">
                {logoSuggestion.palette?.map((color, idx) => (
                  <div key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-lg shadow-sm border border-gray-100 mr-3 flex-shrink-0" style={{ backgroundColor: color.hex, printColorAdjust: 'exact' }}></div>
                    <div className="overflow-hidden">
                      <p className="font-mono text-sm font-bold text-gray-800 truncate">{color.hex}</p>
                      <p className="text-xs text-gray-500 truncate" title={color.name}>{color.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
