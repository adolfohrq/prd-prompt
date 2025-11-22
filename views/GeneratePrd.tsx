import React, { useState, useContext, useEffect } from 'react';
import type { PRD, Competitor, ChatMessage, AgentPersona, IdeaAnalysis } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { AppContext } from '../contexts/AppContext';
import { ChatButton } from '../components/Chat/ChatButton';
import { ChatDrawer } from '../components/Chat/ChatDrawer';
import { CompetitorModal } from '../components/CompetitorModal';
import { MagicMatchModal, CreativeDirectionModal, TurboProgressModal } from '../components/GeneratePrd/modals';
import { DocumentStep, CompetitorsStep, UiPlanStep, DatabaseStep, LogoStep, ReviewStep } from '../components/GeneratePrd/steps';
import { usePrdGeneration, useChatHandlers, useFormHandlers } from '../components/GeneratePrd/hooks';
import type { TurboTask, TaskStatus } from '../components/GeneratePrd/types';

interface GeneratePrdProps {
  onSavePrd: (prd: PRD) => void;
  editingPrd: PRD | null;
  onCancelEditing: () => void;
}

const steps = ["Documento", "Concorrentes", "Interfaces", "Banco de Dados", "Logotipo", "Revisão Final"];

// --- VISUAL STYLES NOW IMPORTED FROM constants/logoStyles.ts ---
// --- MODAL COMPONENTS NOW IMPORTED FROM components/GeneratePrd/modals ---

export const GeneratePrd: React.FC<GeneratePrdProps> = ({ onSavePrd, editingPrd, onCancelEditing }) => {
  // Flow State
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0); // Tracks the furthest step unlocked
  const [isPrdGenerated, setIsPrdGenerated] = useState(false); // Tracks if Step 0 content is visible
  const [smartFillingFields, setSmartFillingFields] = useState<string[]>([]);
  const [ideaAnalysis, setIdeaAnalysis] = useState<IdeaAnalysis | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Gerando conteúdo...');
  const [prdData, setPrdData] = useState<Partial<PRD>>({
    complexity: 'Média',
    content: {},
    industry: []
  });

  useEffect(() => {
    if (editingPrd) {
      setPrdData(editingPrd);
      // Logic to determine which step to start on could be added here
      // For now, it will start on step 0 with data loaded.
      setIsPrdGenerated(true); // Assume if it's a draft, the base is generated
      setMaxStepReached(steps.length -1); // Unlock all steps for editing
    }
  }, [editingPrd]);
  
  // Competitor Details State
  const [selectedCompetitorIndex, setSelectedCompetitorIndex] = useState<number | null>(null);
  const [isCompetitorModalOpen, setIsCompetitorModalOpen] = useState(false);

  // --- Magic Match Modal State ---
  const [isMagicMatchModalOpen, setIsMagicMatchModalOpen] = useState(false);
  const [isCreativeDirectionModalOpen, setIsCreativeDirectionModalOpen] = useState(false);
  const [logoInspiration, setLogoInspiration] = useState('');

  // Creative Direction Advanced State
  const [creativeStyle, setCreativeStyle] = useState<string[]>([]);
  const [creativeColors, setCreativeColors] = useState<string[]>([]);
  const [creativeTypography, setCreativeTypography] = useState('Sans-Serif');
  const [creativeElements, setCreativeElements] = useState('');
  const [creativeNegative, setCreativeNegative] = useState('');

  const [isExpertMode, setIsExpertMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Review Mode State: which tab is active
  const [activeReviewTab, setActiveReviewTab] = useState<string>('text');

  // Turbo Mode State
  const [showTurboModal, setShowTurboModal] = useState(false);
  const [turboTasks, setTurboTasks] = useState<TurboTask[]>([
      { id: 'text', label: 'Escrevendo Documentação (Resumo e Requisitos)', status: 'idle' },
      { id: 'competitors', label: 'Analisando Concorrentes de Mercado', status: 'idle' },
      { id: 'ui', label: 'Desenhando Arquitetura de UI/UX', status: 'idle' },
      { id: 'db', label: 'Modelando Banco de Dados', status: 'idle' },
      { id: 'logo', label: 'Criando Identidade Visual (Logo)', status: 'idle' },
  ]);

  // --- Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<AgentPersona, ChatMessage[]>>({
      pm: [], market: [], ux: [], db: [], brand: []
  });

  const appContext = useContext(AppContext);

  // --- Chat Helpers ---
  const getActivePersona = (): AgentPersona => {
      if (currentStep === 0) return 'pm';
      if (currentStep === 1) return 'market';
      if (currentStep === 2) return 'ux';
      if (currentStep === 3) return 'db';
      if (currentStep === 4) return 'brand';
      if (currentStep === 5) {
          const map: Record<string, AgentPersona> = {
              'text': 'pm',
              'competitors': 'market',
              'ui': 'ux',
              'db': 'db',
              'logo': 'brand'
          };
          return map[activeReviewTab] || 'pm';
      }
      return 'pm';
  };

  const activePersona = getActivePersona();

  const personaStyles: Record<AgentPersona, { label: string, color: string }> = {
      pm: { label: 'Falar com PM', color: 'bg-gray-900' },
      market: { label: 'Falar com Analista', color: 'bg-gray-900' },
      ux: { label: 'Falar com Designer', color: 'bg-gray-900' },
      db: { label: 'Falar com DBA', color: 'bg-gray-900' },
      brand: { label: 'Falar com Criativo', color: 'bg-gray-900' },
  };

  // --- Custom Hooks ---
  const chatHandlers = useChatHandlers({
    prdData,
    setPrdData,
    activePersona,
    chatHistory,
    setChatHistory,
    setIsChatLoading,
    setIsActionLoading
  });

  const formHandlers = useFormHandlers({
    prdData,
    setPrdData,
    currentStep,
    setCurrentStep,
    maxStepReached,
    setMaxStepReached,
    setIsPrdGenerated,
    steps,
    onSavePrd
  });

  const prdGeneration = usePrdGeneration({
    prdData,
    setPrdData,
    setIsPrdGenerated,
    setIsLoading,
    setLoadingMessage,
    isMagicMatchModalOpen,
    isCreativeDirectionModalOpen,
    setIsMagicMatchModalOpen,
    setIsCreativeDirectionModalOpen,
    logoInspiration,
    creativeStyle,
    creativeColors,
    creativeTypography,
    creativeElements,
    creativeNegative,
    setTurboTasks,
    setSmartFillingFields,
    setIdeaAnalysis
  });

  // Destructure handlers from hooks
  const { handleSendMessage, handleApplyChatChanges } = chatHandlers;
  const { handleInputChange, handleContentChange, handleNextStep, handleSave, handleSaveDraft } = formHandlers;
  const {
    handleSmartFill,
    handleGeneratePrdStructure,
    handleGenerateCompetitors,
    handleGenerateUi,
    handleGenerateDb,
    handleGenerateLogo,
    handleDownloadLogo,
    handleGenerateDbCode,
    handleAnalyzeIdea
  } = prdGeneration;

  // handleCompetitorClick needs state setters so it stays in the main component
  const handleCompetitorClick = (comp: Competitor, index: number) => {
    setSelectedCompetitorIndex(index);
    setIsCompetitorModalOpen(true);
  };

  // --- RENDER HELPERS ---

  const renderChatAction = () => (
    <ChatButton 
        onClick={() => setIsChatOpen(true)} 
        label={personaStyles[activePersona].label}
        color={personaStyles[activePersona].color} // Now using gray/dark colors
        variant="icon"
    />
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title={isPrdGenerated ? "1. Documento PRD" : "1. Detalhes do Documento"} headerAction={renderChatAction()}>
            <DocumentStep
              isPrdGenerated={isPrdGenerated}
              prdData={prdData}
              onGenerateContent={handleGeneratePrdStructure}
              onContentChange={handleContentChange}
              onEditIdea={() => setIsPrdGenerated(false)}
              onInputChange={handleInputChange}
              onSmartFill={handleSmartFill}
              smartFillingFields={smartFillingFields}
              onAnalyzeIdea={handleAnalyzeIdea}
              ideaAnalysis={ideaAnalysis}
              onSaveDraft={handleSaveDraft}
            />
          </Card>
        );
      case 1:
        return (
          <Card title="2. Análise de Concorrentes" headerAction={renderChatAction()}>
            <CompetitorsStep
              competitors={prdData.content?.competitors}
              onRegenerate={handleGenerateCompetitors}
              onCompetitorClick={handleCompetitorClick}
            />
          </Card>
        );
       case 2:
        return (
          <Card title="3. Plano de Interface Profissional" headerAction={renderChatAction()}>
            <UiPlanStep
              uiFlows={prdData.content?.uiPlan}
              onRegenerate={handleGenerateUi}
            />
          </Card>
        );
        case 3:
            return (
            <Card title="4. Estrutura de Dados" headerAction={renderChatAction()}>
              <DatabaseStep
                dbTables={prdData.content?.dbSchema}
                onRegenerate={handleGenerateDb}
                onExportSQL={() => handleGenerateDbCode('sql')}
                onExportPrisma={() => handleGenerateDbCode('prisma')}
              />
            </Card>
            );
        case 4:
            return (
            <Card title="5. Identidade Visual" headerAction={renderChatAction()}>
              <LogoStep
                logoSuggestion={prdData.content?.logoSuggestion}
                onOpenMagicMatch={() => setIsMagicMatchModalOpen(true)}
                onRefineStyle={() => {
                  setPrdData(prev => ({...prev, content: {...prev.content, logoSuggestion: undefined}}));
                  setIsCreativeDirectionModalOpen(true);
                }}
                onRegenerate={handleGenerateLogo}
                onDownload={handleDownloadLogo}
              />
            </Card>
            );
        case 5:
            return (
              <ReviewStep
                prdData={prdData}
                onContentChange={handleContentChange}
                onRegenerateCompetitors={handleGenerateCompetitors}
                onCompetitorClick={handleCompetitorClick}
                onRegenerateUi={handleGenerateUi}
                onRegenerateDb={handleGenerateDb}
                onExportSQL={() => handleGenerateDbCode('sql')}
                onExportPrisma={() => handleGenerateDbCode('prisma')}
                onOpenMagicMatch={() => setIsMagicMatchModalOpen(true)}
                onRefineLogoStyle={() => {
                  setPrdData(prev => ({...prev, content: {...prev.content, logoSuggestion: undefined}}));
                  setIsCreativeDirectionModalOpen(true);
                }}
                onRegenerateLogo={handleGenerateLogo}
                onDownloadLogo={handleDownloadLogo}
                onSave={handleSave}
              />
            );
      default:
        return null;
    }
  };

  // --- RENDER MAIN ---
  return (
    <div className="max-w-5xl mx-auto pb-10 relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerador de PRD</h1>
            <p className="mt-1 text-gray-600">
              {editingPrd ? `Editando rascunho: "${editingPrd.title}"` : 'Crie especificações detalhadas usando IA.'}
            </p>
          </div>
          {editingPrd && (
            <Button variant="secondary" onClick={() => {
              onCancelEditing();
              setPrdData({ complexity: 'Média', content: {}, industry: [] });
              setCurrentStep(0);
              setMaxStepReached(0);
              setIsPrdGenerated(false);
            }} className="mt-4 sm:mt-0">
              Cancelar Edição
            </Button>
          )}
      </div>

        <div className="animate-slide-up">
            {/* INTERACTIVE STEPPER NAVIGATION (Only visible after first generation) */}
            {(maxStepReached > 0 || isPrdGenerated || editingPrd) && (
                <div className="border-b border-gray-200 bg-white px-4 mb-8 -mx-4 sm:mx-0 sm:rounded-lg shadow-sm animate-fade-in">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar py-2" aria-label="Tabs">
                        {steps.map((stepName, index) => {
                            const isCurrent = currentStep === index;
                            const isAccessible = index <= Math.max(currentStep, maxStepReached);
                            
                            return (
                                <button
                                    key={stepName}
                                    onClick={() => isAccessible && setCurrentStep(index)}
                                    disabled={!isAccessible}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200
                                        ${isCurrent 
                                            ? 'border-primary text-primary'
                                            : isAccessible 
                                                ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                : 'border-transparent text-gray-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <span className={`
                                        mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                                        ${isCurrent 
                                            ? 'bg-primary text-white' 
                                            : isAccessible
                                                ? 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                                : 'bg-gray-50 text-gray-300'
                                        }
                                    `}>
                                        {index + 1}
                                    </span>
                                    {stepName}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )}

            {renderStepContent()}

            {currentStep < 5 && (
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    {currentStep === 0 && (
                       <Button onClick={handleSaveDraft} variant="secondary">
                          Salvar Rascunho
                       </Button>
                    )}
                  </div>
                  <Button onClick={handleNextStep} isLoading={isLoading} disabled={isLoading} size="lg">
                      {isLoading ? loadingMessage : 'Próximo Passo'}
                  </Button>
                </div>
            )}
        </div>

      {/* Chat Drawer */}
      <ChatDrawer 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          messages={chatHistory[activePersona]}
          onSendMessage={handleSendMessage}
          isLoading={isChatLoading}
          persona={activePersona}
          onAction={handleApplyChatChanges}
          isActionLoading={isActionLoading}
      />

      {/* Competitor Details Modal */}
      <CompetitorModal
          competitor={selectedCompetitorIndex !== null && prdData.content?.competitors ? prdData.content.competitors[selectedCompetitorIndex] : null}
          isOpen={isCompetitorModalOpen}
          onClose={() => setIsCompetitorModalOpen(false)}
          isLoading={false}
      />

      {/* Magic Match Modal */}
      <MagicMatchModal
        isOpen={isMagicMatchModalOpen}
        onClose={() => setIsMagicMatchModalOpen(false)}
        onGenerateAuto={() => handleGenerateLogo()}
        onOpenCreativeDirection={() => {
          setIsMagicMatchModalOpen(false);
          setIsCreativeDirectionModalOpen(true);
        }}
      />

      {/* Creative Direction Modal */}
      <CreativeDirectionModal
        isOpen={isCreativeDirectionModalOpen}
        onClose={() => setIsCreativeDirectionModalOpen(false)}
        onGenerateLogo={() => handleGenerateLogo()}
        onBackToMagicMatch={() => {
          setIsCreativeDirectionModalOpen(false);
          setIsMagicMatchModalOpen(true);
        }}
        logoInspiration={logoInspiration}
        setLogoInspiration={setLogoInspiration}
        creativeStyle={creativeStyle}
        setCreativeStyle={setCreativeStyle}
        creativeColors={creativeColors}
        setCreativeColors={setCreativeColors}
        creativeTypography={creativeTypography}
        setCreativeTypography={setCreativeTypography}
        creativeElements={creativeElements}
        setCreativeElements={setCreativeElements}
        creativeNegative={creativeNegative}
        setCreativeNegative={setCreativeNegative}
      />

      {/* Turbo Mode Progress Modal */}
      <TurboProgressModal
        isOpen={showTurboModal}
        tasks={turboTasks}
      />
    </div>
  );
};

export default GeneratePrd;