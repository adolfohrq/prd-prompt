import React, { useState } from 'react';
import type { PRD, PromptDocument, AgentPersona } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CopyIcon, LayoutIcon, DatabaseIcon, GlobeIcon, FileTextIcon, LogoIcon } from '../components/icons/Icons';
import { ChatButton } from '../components/Chat/ChatButton';
import { ChatDrawer } from '../components/Chat/ChatDrawer';
import { OverviewTab, MarketTab, UiTab, DatabaseTab, BrandTab } from '../components/DocumentViewer';
import { useChatHandlers, useDocumentExport } from '../components/DocumentViewer/hooks';
import type { TabId } from '../components/DocumentViewer/types';

interface DocumentViewerProps {
  document: PRD | PromptDocument;
  onBack: () => void;
}

const isPrd = (doc: PRD | PromptDocument): doc is PRD => 'ideaDescription' in doc;

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Helper to map Tab to Persona
  const tabToPersona: Record<TabId, AgentPersona> = {
    overview: 'pm',
    market: 'market',
    ui: 'ux',
    db: 'db',
    brand: 'brand'
  };

  const activePersona = tabToPersona[activeTab];

  // Persona Styles for Button
  const personaStyles: Record<AgentPersona, { label: string; color: string }> = {
    pm: { label: 'Falar com PM', color: 'bg-purple-600 hover:bg-purple-700' },
    market: { label: 'Falar com Analista', color: 'bg-blue-600 hover:bg-blue-700' },
    ux: { label: 'Falar com Designer', color: 'bg-pink-600 hover:bg-pink-700' },
    db: { label: 'Falar com DBA', color: 'bg-emerald-600 hover:bg-emerald-700' },
    brand: { label: 'Falar com Criativo', color: 'bg-orange-600 hover:bg-orange-700' }
  };

  // Helper to get context data for the current tab
  const getContextData = () => {
    if (!isPrd(document)) return '';
    switch (activeTab) {
      case 'overview':
        return JSON.stringify({
          title: document.title,
          summary: document.content.executiveSummary,
          overview: document.content.productOverview,
          requirements: document.content.functionalRequirements
        });
      case 'market':
        return JSON.stringify(document.content.competitors);
      case 'ui':
        return JSON.stringify({
          screens: document.content.uiPlan?.screens,
          flowchart: document.content.uiPlan?.flowchartSvg
        });
      case 'db':
        return JSON.stringify(document.content.dbSchema);
      case 'brand':
        return JSON.stringify(document.content.logoSuggestion);
      default:
        return '';
    }
  };

  // Custom Hooks
  const { handleCopy, handlePrint } = useDocumentExport();
  const { isChatOpen, setIsChatOpen, isChatLoading, chatHistory, handleSendMessage } = useChatHandlers({
    getContextData,
    activePersona
  });

  if (isPrd(document)) {
    const tabs = [
      { id: 'overview' as TabId, label: 'Visão Geral', icon: <FileTextIcon className="w-4 h-4" /> },
      { id: 'market' as TabId, label: 'Mercado', icon: <GlobeIcon className="w-4 h-4" /> },
      { id: 'ui' as TabId, label: 'Interface', icon: <LayoutIcon className="w-4 h-4" /> },
      { id: 'db' as TabId, label: 'Banco de Dados', icon: <DatabaseIcon className="w-4 h-4" /> },
      { id: 'brand' as TabId, label: 'Marca', icon: <LogoIcon className="w-4 h-4" /> }
    ];

    return (
      <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:space-y-0 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden mb-6">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onBack} className="hover:bg-gray-200">
              <span className="text-lg leading-none pb-1">←</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{document.title}</h1>
              <p className="text-sm text-gray-500">{document.industry} • {document.targetAudience}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="bg-white border border-gray-300 shadow-sm">
              🖨️ Imprimir / PDF
            </Button>
            <Button size="sm" onClick={() => {}} className="opacity-50 cursor-not-allowed" disabled>
              📤 Exportar
            </Button>
          </div>
        </div>

        {/* Print Header only visible in print */}
        <div className="hidden print:block mb-8 text-center border-b pb-6">
          <h1 className="text-4xl font-bold text-black mb-2">{document.title}</h1>
          <p className="text-gray-600 text-lg">Documento de Requisitos do Produto (PRD)</p>
          <p className="text-gray-400 text-sm mt-2">Gerado por PRD-Prompt.ai</p>
        </div>

        {/* Tab Navigation - Hidden on Print */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:hidden">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex overflow-x-auto no-scrollbar" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-primary text-primary bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  <span className={`mr-2 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-8 min-h-[500px] bg-white relative">
            {/* OVERVIEW SECTION */}
            <div className={`${activeTab === 'overview' ? 'block' : 'hidden'} print:block`}>
              <OverviewTab document={document} onCopy={handleCopy} />
            </div>

            {/* MARKET SECTION */}
            <div className={`${activeTab === 'market' ? 'block' : 'hidden'} print:block`}>
              <MarketTab competitors={document.content.competitors} />
            </div>

            {/* UI SECTION */}
            <div className={`${activeTab === 'ui' ? 'block' : 'hidden'} print:block`}>
              <UiTab uiPlan={document.content.uiPlan} uiFlowchartSvg={document.content.uiFlowchartSvg} />
            </div>

            {/* DATABASE SECTION */}
            <div className={`${activeTab === 'db' ? 'block' : 'hidden'} print:block`}>
              <DatabaseTab
                dbSchema={document.content.dbSchema}
                dbSql={document.content.dbSql}
                dbPrisma={document.content.dbPrisma}
                onCopy={handleCopy}
              />
            </div>

            {/* BRAND SECTION */}
            <div className={`${activeTab === 'brand' ? 'block' : 'hidden'} print:block`}>
              <BrandTab logoSuggestion={document.content.logoSuggestion} />
            </div>

            {/* Chat Overlay Components - Print Hidden */}
            <div className="print:hidden">
              <ChatButton
                onClick={() => setIsChatOpen(true)}
                label={personaStyles[activePersona].label}
                color={personaStyles[activePersona].color}
              />
              <ChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                messages={chatHistory[activePersona]}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                persona={activePersona}
              />
            </div>
          </div>
        </div>

        {/* Print Only Footer */}
        <div className="hidden print:block text-center text-gray-400 text-xs mt-10 border-t pt-4">
          <p>Este documento é confidencial e para uso exclusivo de desenvolvimento.</p>
          <p>{new Date().getFullYear()} © PRD-Prompt.ai</p>
        </div>
      </div>
    );
  } else {
    // PROMPT VIEWER (Kept simple but consistent style)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onBack}>← Voltar</Button>
            <h1 className="text-2xl font-bold text-gray-900">Prompt de Desenvolvimento</h1>
          </div>
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => handleCopy(document.content)}><CopyIcon className="h-4 w-4 mr-1" /> Copiar</Button>
            <Button variant="secondary" onClick={handlePrint}>Imprimir PDF</Button>
          </div>
        </div>
        <Card className="shadow-lg border-0 print:shadow-none print:border">
          <div className="relative">
            <div className="absolute top-0 right-0 p-2 bg-gray-100 rounded-bl-lg text-xs font-mono text-gray-500 border-l border-b">
              Stack: {document.stack}
            </div>
            <pre className="bg-white p-8 text-sm whitespace-pre-wrap font-mono text-gray-800 leading-relaxed overflow-x-auto">
              {document.content}
            </pre>
          </div>
        </Card>
      </div>
    );
  }
};
