import React from 'react';
import { MarkdownRenderer } from '../../MarkdownRenderer';
import type { OverviewTabProps } from './types';

export const OverviewTab: React.FC<OverviewTabProps> = ({ document, onCopy }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              Resumo Executivo
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <MarkdownRenderer
                content={document.content.executiveSummary || 'N/A'}
                className="text-gray-600 leading-relaxed"
              />
            </div>
          </section>
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Visão Geral do Produto</h3>
            <MarkdownRenderer
              content={document.content.productOverview || 'N/A'}
              className="text-gray-600 leading-relaxed"
            />
          </section>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Metadados</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-gray-500">Indústria</dt>
                <dd className="font-medium text-gray-900">{document.industry}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Público-Alvo</dt>
                <dd className="font-medium text-gray-900">{document.targetAudience}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Complexidade</dt>
                <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {document.complexity}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Data de Criação</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Requisitos Funcionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {document.content.functionalRequirements?.map((req, i) => (
            <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold mr-3 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700">{req}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
