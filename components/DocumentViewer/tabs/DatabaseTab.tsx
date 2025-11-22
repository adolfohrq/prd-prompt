import React from 'react';
import type { DatabaseTabProps } from './types';

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ dbSchema, dbSql, dbPrisma, onCopy }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-bold text-gray-900">Esquema de Dados</h2>
        <p className="text-gray-500">Modelagem do banco de dados relacional.</p>
      </div>

      {dbSchema && Array.isArray(dbSchema) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dbSchema.map((table, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm break-inside-avoid bg-white">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-800 font-mono text-sm">📦 {table.name}</span>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  {table.columns?.map((col, cIdx) => (
                    <li key={cIdx} className="flex flex-col text-sm pb-2 border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono font-semibold text-purple-700">{col.name}</span>
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{col.type}</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-0.5">{col.description}</span>
                    </li>
                  ))}
                </ul>
                {table.relations && Array.isArray(table.relations) && table.relations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 bg-yellow-50/30 -mx-5 -mb-5 px-5 pb-4">
                    <p className="text-xs font-bold text-yellow-700 uppercase mb-2">Relacionamentos</p>
                    {table.relations.map((rel, rIdx) => (
                      <div key={rIdx} className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="text-gray-400">↳</span>
                        <span className="font-medium">{rel.type}</span>
                        <span className="text-gray-400">com</span>
                        <span className="font-mono bg-white px-1 border rounded">{rel.toTable}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Code Snippets - Print Hidden */}
      {(dbSql || dbPrisma) && (
        <div className="mt-8 print:hidden">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recursos Técnicos</h3>
          <div className="grid grid-cols-1 gap-4">
            {dbSql && (
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                  <span className="text-xs font-bold text-gray-400">SQL Schema</span>
                  <button onClick={() => onCopy(dbSql)} className="text-xs text-white hover:text-primary transition-colors">Copiar</button>
                </div>
                <pre className="p-4 text-xs text-green-400 font-mono overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-700">
                  {dbSql}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
