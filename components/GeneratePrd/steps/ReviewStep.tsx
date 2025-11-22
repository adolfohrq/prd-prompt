import React, { useState } from 'react';
import { Button } from '../../Button';
import { Textarea } from '../../Textarea';
import { CompetitorsStep } from './CompetitorsStep';
import { UiPlanStep } from './UiPlanStep';
import { DatabaseStep } from './DatabaseStep';
import { LogoStep } from './LogoStep';
import type { ReviewStepProps } from './types';

const reviewTabs = [
  { id: 'text', label: 'Detalhes e Texto' },
  { id: 'competitors', label: 'Concorrentes' },
  { id: 'ui', label: 'Interface (UI)' },
  { id: 'db', label: 'Banco de Dados' },
  { id: 'logo', label: 'Identidade Visual' },
];

export const ReviewStep: React.FC<ReviewStepProps> = ({
  prdData,
  onContentChange,
  onRegenerateCompetitors,
  onCompetitorClick,
  onRegenerateUi,
  onRegenerateDb,
  onExportSQL,
  onExportPrisma,
  onOpenMagicMatch,
  onRefineLogoStyle,
  onRegenerateLogo,
  onDownloadLogo,
  onSave
}) => {
  const [activeReviewTab, setActiveReviewTab] = useState('text');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">6. Revisão Final</h2>
        <p className="text-gray-600">Revise, edite e exporte o documento final.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Review Tabs Header */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {reviewTabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveReviewTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors rounded-none h-auto
                  ${activeReviewTab === tab.id
                    ? 'border-primary text-primary bg-white hover:bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100'}
                `}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[400px]">
          {activeReviewTab === 'text' && (
            <div className="space-y-6 animate-fade-in">
              <Textarea
                label="Resumo Executivo"
                id="executiveSummary"
                rows={6}
                value={prdData.content?.executiveSummary || ''}
                onChange={(e) => onContentChange('executiveSummary', e.target.value)}
              />
              <Textarea
                label="Visão Geral do Produto"
                id="productOverview"
                rows={6}
                value={prdData.content?.productOverview || ''}
                onChange={(e) => onContentChange('productOverview', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos Funcionais</label>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {prdData.content?.functionalRequirements?.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-2 italic">* Para editar requisitos individuais, use o chat ou gere novamente.</p>
                </div>
              </div>
            </div>
          )}

          {activeReviewTab === 'competitors' && (
            <div className="animate-fade-in">
              <CompetitorsStep
                competitors={prdData.content?.competitors}
                isReviewMode={true}
                onRegenerate={onRegenerateCompetitors}
                onCompetitorClick={onCompetitorClick}
              />
            </div>
          )}

          {activeReviewTab === 'ui' && (
            <div className="animate-fade-in">
              <UiPlanStep
                uiFlows={prdData.content?.uiPlan}
                isReviewMode={true}
                onRegenerate={onRegenerateUi}
              />
            </div>
          )}

          {activeReviewTab === 'db' && (
            <div className="animate-fade-in">
              <DatabaseStep
                dbTables={prdData.content?.dbSchema}
                isReviewMode={true}
                onRegenerate={onRegenerateDb}
                onExportSQL={onExportSQL}
                onExportPrisma={onExportPrisma}
              />
            </div>
          )}

          {activeReviewTab === 'logo' && (
            <div className="animate-fade-in">
              <LogoStep
                logoSuggestion={prdData.content?.logoSuggestion}
                isReviewMode={true}
                onOpenMagicMatch={onOpenMagicMatch}
                onRefineStyle={onRefineLogoStyle}
                onRegenerate={onRegenerateLogo}
                onDownload={onDownloadLogo}
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button onClick={onSave} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:scale-105 transition-transform">
          💾 Salvar PRD Completo
        </Button>
      </div>
    </div>
  );
};
