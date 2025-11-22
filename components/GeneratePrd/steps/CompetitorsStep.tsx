import React from 'react';
import { Button } from '../../Button';
import { GlobeIcon, CheckCircleIcon, InfoIcon, WandIcon } from '../../icons/Icons';
import type { CompetitorsStepProps } from './types';

export const CompetitorsStep: React.FC<CompetitorsStepProps> = ({
  competitors,
  isReviewMode = false,
  onRegenerate,
  onCompetitorClick
}) => {
  if (!competitors) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border-2 border-dashed border-gray-200 rounded-xl animate-fade-in text-center transition-all">
        <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
          <GlobeIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Análise de Concorrentes</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          A IA irá pesquisar o mercado e identificar os principais competidores do seu produto.
        </p>
        <Button onClick={onRegenerate} size="lg" className="shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-105 transition-transform mt-4">
          <WandIcon className="w-5 h-5 mr-2" />
          Gerar Agora com IA
        </Button>
      </div>
    );
  }

  return (
    <>
      {!isReviewMode && (
        <div className="flex justify-between items-center mb-4 animate-fade-in">
          <p className="text-gray-600">A IA analisou o mercado. Clique em um concorrente para ver a análise profunda.</p>
          <Button size="sm" variant="secondary" onClick={onRegenerate}>Regenerar</Button>
        </div>
      )}
      <div className="mt-4 overflow-x-auto border rounded-lg shadow-sm animate-fade-in">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Análise Breve</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {competitors.map((c, i) => (
              <tr
                key={i}
                onClick={() => onCompetitorClick(c, i)}
                className="hover:bg-blue-50 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{c.name}</span>
                    {c.details && (
                      <div title="Análise detalhada carregada">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">{c.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-white transition-all"
                    title="Ver detalhes completos"
                  >
                    <InfoIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
