import React, { useContext, useState } from 'react';
import type { PRD, PromptDocument, ChatMessage, AgentPersona } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CopyIcon, LayoutIcon, DatabaseIcon, GlobeIcon, FileTextIcon, LogoIcon } from '../components/icons/Icons';
import { AppContext } from '../contexts/AppContext';
import { ChatButton } from '../components/Chat/ChatButton';
import { ChatDrawer } from '../components/Chat/ChatDrawer';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { geminiService } from '../services/geminiService';

interface DocumentViewerProps {
  document: PRD | PromptDocument;
  onBack: () => void;
}

const isPrd = (doc: PRD | PromptDocument): doc is PRD => 'ideaDescription' in doc;

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onBack }) => {
  const appContext = useContext(AppContext);
  const activeTabState = useState<'overview' | 'market' | 'ui' | 'db' | 'brand'>('overview');
  const [activeTab, setActiveTab] = activeTabState;
  
  // --- Chat State Management ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<AgentPersona, ChatMessage[]>>({
      pm: [], market: [], ux: [], db: [], brand: []
  });

  // Helper to map Tab to Persona
  const tabToPersona: Record<string, AgentPersona> = {
      overview: 'pm',
      market: 'market',
      ui: 'ux',
      db: 'db',
      brand: 'brand'
  };
  
  const activePersona = tabToPersona[activeTab];

  // Persona Styles for Button
  const personaStyles: Record<AgentPersona, { label: string, color: string }> = {
      pm: { label: 'Falar com PM', color: 'bg-purple-600 hover:bg-purple-700' },
      market: { label: 'Falar com Analista', color: 'bg-blue-600 hover:bg-blue-700' },
      ux: { label: 'Falar com Designer', color: 'bg-pink-600 hover:bg-pink-700' },
      db: { label: 'Falar com DBA', color: 'bg-emerald-600 hover:bg-emerald-700' },
      brand: { label: 'Falar com Criativo', color: 'bg-orange-600 hover:bg-orange-700' },
  };

  // Helper to get context data for the current tab
  const getContextData = () => {
      if (!isPrd(document)) return "";
      switch(activeTab) {
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
          default: return "";
      }
  };

  const handleSendMessage = async (text: string) => {
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text,
          timestamp: new Date()
      };

      // Update local history immediately
      setChatHistory(prev => ({
          ...prev,
          [activePersona]: [...prev[activePersona], newMessage]
      }));
      
      setIsChatLoading(true);

      try {
          const context = getContextData();
          // Call API with history INCLUDING the new message
          const currentHistory = [...chatHistory[activePersona], newMessage];
          
          const responseText = await geminiService.chatWithAgent(context, currentHistory, activePersona);

          const aiMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              timestamp: new Date()
          };

          setChatHistory(prev => ({
              ...prev,
              [activePersona]: [...prev[activePersona], aiMessage]
          }));

      } catch (error) {
          console.error(error);
          appContext?.showToast("Erro ao falar com o agente.", "error");
      } finally {
          setIsChatLoading(false);
      }
  };


  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
        appContext?.showToast('Conteúdo copiado!');
    }, () => {
        appContext?.showToast('Falha ao copiar.', 'error');
    });
  };

  const handlePrint = () => {
      window.print();
  };

  if (isPrd(document)) {
    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: <FileTextIcon className="w-4 h-4" /> },
        { id: 'market', label: 'Mercado', icon: <GlobeIcon className="w-4 h-4" /> },
        { id: 'ui', label: 'Interface', icon: <LayoutIcon className="w-4 h-4" /> },
        { id: 'db', label: 'Banco de Dados', icon: <DatabaseIcon className="w-4 h-4" /> },
        { id: 'brand', label: 'Marca', icon: <LogoIcon className="w-4 h-4" /> },
    ] as const;

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
                <div className={`${activeTab === 'overview' ? 'block' : 'hidden'} print:block space-y-8 animate-fade-in`}>
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

                {/* MARKET SECTION */}
                <div className={`${activeTab === 'market' ? 'block' : 'hidden'} print:block space-y-6 animate-fade-in`}>
                     <div className="mb-6 print:hidden">
                        <h2 className="text-xl font-bold text-gray-900">Análise de Mercado</h2>
                        <p className="text-gray-500">Concorrentes diretos e indiretos identificados pela IA.</p>
                     </div>
                     
                     {document.content.competitors && Array.isArray(document.content.competitors) ? (
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
                                    {document.content.competitors.map((c, i) => (
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
                     ) : <p className="text-gray-500 italic">Nenhuma informação de mercado disponível.</p>}
                </div>

                {/* UI SECTION */}
                <div className={`${activeTab === 'ui' ? 'block' : 'hidden'} print:block space-y-8 animate-fade-in`}>
                    <div className="mb-6 print:hidden">
                        <h2 className="text-xl font-bold text-gray-900">Arquitetura de Interface</h2>
                        <p className="text-gray-500">Fluxogramas e especificações de telas.</p>
                     </div>

                    {(document.content.uiPlan?.flowchartSvg || document.content.uiFlowchartSvg) && (
                        <div className="break-inside-avoid">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Fluxograma do Usuário</h3>
                             <div className="p-8 border border-gray-200 rounded-xl bg-gray-50 flex justify-center overflow-hidden" 
                                  dangerouslySetInnerHTML={{ __html: document.content.uiPlan?.flowchartSvg || document.content.uiFlowchartSvg || '' }} />
                        </div>
                    )}

                    {document.content.uiPlan?.screens && Array.isArray(document.content.uiPlan.screens) && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Detalhamento das Telas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {document.content.uiPlan.screens.map((screen, idx) => (
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

                {/* DATABASE SECTION */}
                <div className={`${activeTab === 'db' ? 'block' : 'hidden'} print:block space-y-8 animate-fade-in`}>
                    <div className="mb-6 print:hidden">
                        <h2 className="text-xl font-bold text-gray-900">Esquema de Dados</h2>
                        <p className="text-gray-500">Modelagem do banco de dados relacional.</p>
                     </div>

                    {document.content.dbSchema && Array.isArray(document.content.dbSchema) && (
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {document.content.dbSchema.map((table, idx) => (
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
                    {(document.content.dbSql || document.content.dbPrisma) && (
                        <div className="mt-8 print:hidden">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recursos Técnicos</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {document.content.dbSql && (
                                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                                        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                                            <span className="text-xs font-bold text-gray-400">SQL Schema</span>
                                            <button onClick={() => handleCopy(document.content.dbSql!)} className="text-xs text-white hover:text-primary transition-colors">Copiar</button>
                                        </div>
                                        <pre className="p-4 text-xs text-green-400 font-mono overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-700">
                                            {document.content.dbSql}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* BRAND SECTION */}
                <div className={`${activeTab === 'brand' ? 'block' : 'hidden'} print:block space-y-8 animate-fade-in`}>
                     <div className="mb-6 print:hidden">
                        <h2 className="text-xl font-bold text-gray-900">Identidade Visual</h2>
                        <p className="text-gray-500">Conceito de marca, logo e paleta de cores.</p>
                     </div>

                     {document.content.logoSuggestion && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                             <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-200 shadow-inner break-inside-avoid">
                                {document.content.logoSuggestion.base64Image ? (
                                    <img 
                                    src={`data:image/jpeg;base64,${document.content.logoSuggestion.base64Image}`} 
                                    alt="Logo"
                                    className="max-w-full max-h-80 object-contain drop-shadow-lg" 
                                    />
                                ) : document.content.logoSuggestion.svgCode ? (
                                     <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: document.content.logoSuggestion.svgCode }} />
                                ) : (
                                    <span className="text-gray-400">Sem imagem</span>
                                )}
                             </div>

                             <div className="space-y-8">
                                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                     <h3 className="font-bold text-blue-900 mb-2">Conceito da Marca</h3>
                                     <p className="text-blue-800 text-sm leading-relaxed italic">
                                         "{document.content.logoSuggestion.description}"
                                     </p>
                                 </div>

                                 <div>
                                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Paleta de Cores</h3>
                                     <div className="grid grid-cols-2 gap-4">
                                        {document.content.logoSuggestion.palette?.map((color, idx) => (
                                            <div key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                                                <div className="w-10 h-10 rounded-lg shadow-sm border border-gray-100 mr-3 flex-shrink-0" style={{backgroundColor: color.hex, printColorAdjust: 'exact'}}></div>
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
                     <Button variant="secondary" onClick={() => handleCopy(document.content)}><CopyIcon className="h-4 w-4 mr-1"/> Copiar</Button>
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