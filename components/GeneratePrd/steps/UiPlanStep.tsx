import React from 'react';
import { Button } from '../../Button';
import { LayoutIcon, WandIcon } from '../../icons/Icons';
import type { UiPlanStepProps } from './types';

export const UiPlanStep: React.FC<UiPlanStepProps> = ({
  uiFlows,
  isReviewMode = false,
  onRegenerate
}) => {
  if (!uiFlows) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border-2 border-dashed border-gray-200 rounded-xl animate-fade-in text-center transition-all">
        <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
          <LayoutIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Arquitetura de Interface</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          Gere um plano visual com fluxo de navegação (Flowchart) e detalhamento das principais telas.
        </p>
        <Button onClick={onRegenerate} size="lg" className="shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-105 transition-transform mt-4">
          <WandIcon className="w-5 h-5 mr-2" />
          Gerar Agora com IA
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {!isReviewMode && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Especificação visual e técnica das telas principais do produto.</p>
          <Button size="sm" variant="secondary" onClick={onRegenerate}>Regenerar</Button>
        </div>
      )}

      {/* Flowchart Section */}
      {uiFlows.flowchartSvg && (
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Fluxo de Navegação</h4>
          <div
            className="p-6 border border-gray-200 rounded-lg bg-gray-50/50 shadow-sm flex justify-center overflow-hidden hover:bg-gray-50 transition-colors"
            dangerouslySetInnerHTML={{ __html: uiFlows.flowchartSvg }}
          />
        </div>
      )}

      {/* Screen Details Grid */}
      {uiFlows.screens && Array.isArray(uiFlows.screens) && (
        <div>
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Especificação de Telas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uiFlows.screens.map((screen, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                  <h5 className="font-bold text-lg text-gray-800">{screen.name}</h5>
                  <span className="text-xs font-mono text-gray-400">#{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{screen.description}</p>
                <div>
                  <span className="text-xs font-semibold text-primary mb-2 block">Componentes Chave:</span>
                  <div className="flex flex-wrap gap-2">
                    {screen.components?.map((comp, cIdx) => (
                      <span key={cIdx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
