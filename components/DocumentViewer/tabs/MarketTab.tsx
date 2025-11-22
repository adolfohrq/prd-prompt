import React from 'react';
import type { MarketTabProps } from './types';

export const MarketTab: React.FC<MarketTabProps> = ({ competitors }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-bold text-gray-900">Análise de Mercado</h2>
        <p className="text-gray-500">Concorrentes diretos e indiretos identificados pela IA.</p>
      </div>

      {competitors && Array.isArray(competitors) ? (
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Concorrente</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Análise</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Website</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competitors.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors break-inside-avoid">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{c.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{c.notes}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center">
                      Visitar <span className="ml-1">↗</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">Nenhuma informação de mercado disponível.</p>
      )}
    </div>
  );
};
