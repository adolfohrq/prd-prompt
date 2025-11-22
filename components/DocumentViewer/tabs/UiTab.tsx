import React from 'react';
import type { UiTabProps } from './types';

export const UiTab: React.FC<UiTabProps> = ({ uiPlan, uiFlowchartSvg }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-bold text-gray-900">Arquitetura de Interface</h2>
        <p className="text-gray-500">Fluxogramas e especificações de telas.</p>
      </div>

      {(uiPlan?.flowchartSvg || uiFlowchartSvg) && (
        <div className="break-inside-avoid">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Fluxograma do Usuário</h3>
          <div
            className="p-8 border border-gray-200 rounded-xl bg-gray-50 flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: uiPlan?.flowchartSvg || uiFlowchartSvg || '' }}
          />
        </div>
      )}

      {uiPlan?.screens && Array.isArray(uiPlan.screens) && (
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Detalhamento das Telas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uiPlan.screens.map((screen, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow break-inside-avoid">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-lg text-gray-900">{screen.name}</h4>
                  <span className="text-xs font-mono text-gray-400">#{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-600 mb-5 min-h-[40px]">{screen.description}</p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Componentes</span>
                  <div className="flex flex-wrap gap-2">
                    {screen.components?.map((comp, cIdx) => (
                      <span key={cIdx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
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
