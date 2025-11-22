import React from 'react';
import { Button } from '../../Button';
import { DatabaseIcon, WandIcon } from '../../icons/Icons';
import type { DatabaseStepProps } from './types';

export const DatabaseStep: React.FC<DatabaseStepProps> = ({
  dbTables,
  isReviewMode = false,
  onRegenerate,
  onExportSQL,
  onExportPrisma
}) => {
  if (!dbTables) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border-2 border-dashed border-gray-200 rounded-xl animate-fade-in text-center transition-all">
        <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
          <DatabaseIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Banco de Dados</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          Modele a estrutura de dados do seu sistema, incluindo tabelas, colunas e relacionamentos.
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
          <p className="text-gray-600">Modelo sugerido para o Banco de Dados Relacional.</p>
          <Button size="sm" variant="secondary" onClick={onRegenerate}>Regenerar</Button>
        </div>
      )}

      {dbTables && Array.isArray(dbTables) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {dbTables.map((table, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-gray-800 flex justify-between items-center">
                  <span>{table.name}</span>
                </div>
                <div className="p-4 bg-white">
                  <ul className="space-y-2">
                    {table.columns?.map((col, cIdx) => (
                      <li key={cIdx} className="text-sm flex flex-col pb-2 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between">
                          <span className="font-mono font-semibold text-indigo-700">{col.name}</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">{col.type}</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-0.5">{col.description}</span>
                      </li>
                    ))}
                  </ul>
                  {table.relations && Array.isArray(table.relations) && table.relations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Relacionamentos</p>
                      {table.relations.map((rel, rIdx) => (
                        <div key={rIdx} className="text-xs text-gray-600">
                          ➜ {rel.toTable} ({rel.type})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Export Code Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="text-lg mr-2">🛠️</span>
              Exportar Schema Técnico
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Gere e baixe o código SQL ou Prisma Schema pronto para uso em produção.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onExportSQL}
                className="border border-gray-300 bg-white hover:bg-gray-50"
              >
                ⚡ Gerar & Baixar SQL
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onExportPrisma}
                className="border border-gray-300 bg-white hover:bg-gray-50"
              >
                ⚡ Gerar & Baixar Prisma
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
