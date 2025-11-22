import React, { useState, useContext, useCallback } from 'react';
import type { PRD, Competitor, DBTable, LogoSuggestion, ChatMessage, AgentPersona } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { geminiService } from '../services/geminiService';
import { AppContext } from '../contexts/AppContext';
import { ChatButton } from '../components/Chat/ChatButton';
import { ChatDrawer } from '../components/Chat/ChatDrawer';
import { CompetitorModal } from '../components/CompetitorModal';
import { GeneratePrdIcon, SparklesIcon, LayoutIcon, DatabaseIcon, GlobeIcon, LogoIcon, CheckCircleIcon, XIcon, InfoIcon, WandIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon, BulbIcon, CodeIcon, SettingsIcon, StarsIcon, EditIcon } from '../components/icons/Icons';

interface GeneratePrdProps {
  onSavePrd: (prd: PRD) => void;
}

const steps = ["Documento", "Concorrentes", "Interfaces", "Banco de Dados", "Logotipo", "Revisão Final"];

// Types for Turbo Progress
type TaskStatus = 'idle' | 'loading' | 'success' | 'error';
interface TurboTask {
    id: string;
    label: string;
    status: TaskStatus;
}

// --- VISUAL STYLES DEFINITION ---
const LOGO_STYLES = [
    { 
        id: 'Minimalista', 
        label: 'Minimalista', 
        desc: 'Limpo e simples',
        renderVisual: () => (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-800 rounded-full"></div>
            </div>
        )
    },
    { 
        id: 'Moderno', 
        label: 'Moderno', 
        desc: 'Geométrico e atual',
        renderVisual: () => (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-tr-xl rounded-bl-xl border border-white/50"></div>
            </div>
        )
    },
    { 
        id: 'Corporativo', 
        label: 'Corporativo', 
        desc: 'Sóbrio e confiável',
        renderVisual: () => (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center flex-col gap-1.5">
                <div className="w-10 h-2 bg-blue-500 rounded-sm"></div>
                <div className="w-10 h-2 bg-slate-600 rounded-sm"></div>
            </div>
        )
    },
    { 
        id: 'Divertido', 
        label: 'Divertido', 
        desc: 'Lúdico e colorido',
        renderVisual: () => (
            <div className="w-full h-full bg-yellow-50 flex items-center justify-center overflow-hidden relative">
                 <div className="absolute top-2 right-3 w-4 h-4 bg-pink-400 rounded-full animate-bounce"></div>
                 <div className="absolute bottom-3 left-3 w-6 h-6 bg-blue-400 rounded-full"></div>
                 <div className="text-2xl">🎨</div>
            </div>
        )
    },
    { 
        id: 'Luxuoso', 
        label: 'Luxuoso', 
        desc: 'Elegante e premium',
        renderVisual: () => (
            <div className="w-full h-full bg-black flex items-center justify-center border border-amber-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-amber-900/20"></div>
                <div className="w-8 h-8 border-2 border-amber-400 transform rotate-45 flex items-center justify-center">
                     <div className="w-4 h-4 bg-amber-400"></div>
                </div>
            </div>
        )
    },
    { 
        id: 'Futurista', 
        label: 'Futurista', 
        desc: 'Neon e Tech',
        renderVisual: () => (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent"></div>
                <div className="w-10 h-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                <div className="w-10 h-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] transform rotate-90 absolute"></div>
            </div>
        )
    },
    { 
        id: 'Vintage', 
        label: 'Vintage', 
        desc: 'Retrô e clássico',
        renderVisual: () => (
            <div className="w-full h-full bg-[#fdf6e3] flex items-center justify-center border-4 border-double border-[#d3c6aa]">
                <span className="font-serif text-[#8d6b48] font-bold text-xl tracking-widest">A.</span>
            </div>
        )
    },
    { 
        id: 'Abstrato', 
        label: 'Abstrato', 
        desc: 'Conceitual e artístico',
        renderVisual: () => (
            <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
                 <div className="w-12 h-12 border border-gray-900 rounded-full rounded-tr-none transform -rotate-12 flex items-center justify-center">
                     <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                 </div>
            </div>
        )
    }
];

const COLOR_PALETTES = [
    { id: 'Vibrante', label: 'Vibrante', colors: ['#3B82F6', '#F59E0B'] },
    { id: 'Pastel', label: 'Pastel', colors: ['#FBCFE8', '#A7F3D0'] },
    { id: 'Sóbrio', label: 'Sóbrio', colors: ['#1F2937', '#9CA3AF'] },
    { id: 'Monocromático', label: 'Mono', colors: ['#4B5563', '#E5E7EB'] },
    { id: 'Quente', label: 'Quente', colors: ['#EF4444', '#FCD34D'] },
    { id: 'Frio', label: 'Frio', colors: ['#10B981', '#3B82F6'] },
    { id: 'Natureza', label: 'Natureza', colors: ['#059669', '#D97706'] },
    { id: 'Noturno', label: 'Noturno', colors: ['#111827', '#6366F1'] },
];

const TYPOGRAPHY_OPTIONS = [
    { id: 'Sans-Serif', label: 'Sans-Serif (Moderno)', example: 'Aa' },
    { id: 'Serif', label: 'Serif (Clássico)', example: 'Aa', font: 'font-serif' },
    { id: 'Slab', label: 'Slab (Robusto)', example: 'Aa', font: 'font-mono' },
    { id: 'Script', label: 'Script (Elegante)', example: 'Aa', font: 'italic' },
    { id: 'Monospace', label: 'Tech / Code', example: '</>', font: 'font-mono' },
];

// --- CREATIVE DIRECTION OPTIONS ---
const CREATIVE_STYLES = [
    "Minimalista", "3D", "Abstrato", "Vintage", "Futurista", "Geométrico", 
    "Orgânico", "Flat", "Hand-drawn", "Luxuoso", "Tech", "Cartoon"
];

const CREATIVE_COLORS = [
    { id: "Quente", label: "Quente", colors: ['#EF4444', '#FCD34D'] },
    { id: "Frio", label: "Frio", colors: ['#10B981', '#3B82F6'] },
    { id: "Pastel", label: "Pastel", colors: ['#FBCFE8', '#A7F3D0'] },
    { id: "Neon", label: "Neon", colors: ['#39FF14', '#FF073A'] },
    { id: "Monocromático", label: "Monocromático", colors: ['#4B5563', '#E5E7EB'] },
    { id: "Metálico", label: "Metálico", colors: ['#c0c0c0', '#ffd700'] },
    { id: "Terroso", label: "Terroso", colors: ['#a16207', '#4d7c0f'] },
    { id: "Vibrante", label: "Vibrante", colors: ['#3B82F6', '#F59E0B'] },
];

export const GeneratePrd: React.FC<GeneratePrdProps> = ({ onSavePrd }) => {
  // Flow State
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0); // Tracks the furthest step unlocked
  const [isPrdGenerated, setIsPrdGenerated] = useState(false); // Tracks if Step 0 content is visible
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Gerando conteúdo...');
  const [prdData, setPrdData] = useState<Partial<PRD>>({
    complexity: 'Média',
    content: {}
  });
  
  // Competitor Details State
  const [selectedCompetitorIndex, setSelectedCompetitorIndex] = useState<number | null>(null);
  const [isCompetitorModalOpen, setIsCompetitorModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

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

  const getContextData = () => {
      switch(activePersona) {
          case 'pm':
              return JSON.stringify({
                  title: prdData.title,
                  description: prdData.ideaDescription,
                  industry: prdData.industry,
                  target: prdData.targetAudience,
                  summary: prdData.content?.executiveSummary,
                  overview: prdData.content?.productOverview,
                  requirements: prdData.content?.functionalRequirements
              });
          case 'market':
              return JSON.stringify(prdData.content?.competitors);
          case 'ux':
              return JSON.stringify({
                  screens: prdData.content?.uiPlan?.screens,
                  flowchart: prdData.content?.uiPlan?.flowchartSvg
              });
          case 'db':
              return JSON.stringify(prdData.content?.dbSchema);
          case 'brand':
              return JSON.stringify(prdData.content?.logoSuggestion);
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

      setChatHistory(prev => ({
          ...prev,
          [activePersona]: [...prev[activePersona], newMessage]
      }));
      
      setIsChatLoading(true);

      try {
          const context = getContextData();
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

  // --- HANDLE CHAT ACTIONS (Regeneration) ---
  const handleApplyChatChanges = async () => {
      setIsActionLoading(true);
      try {
          const context = getContextData();
          const history = chatHistory[activePersona];
          
          const result = await geminiService.refineSection(activePersona, context, history);
          
          if (result) {
              // Update state based on persona
              setPrdData(prev => {
                  const newContent = { ...prev.content };
                  
                  if (activePersona === 'pm') {
                      if (result.executiveSummary) newContent.executiveSummary = result.executiveSummary;
                      if (result.productOverview) newContent.productOverview = result.productOverview;
                      if (result.functionalRequirements) newContent.functionalRequirements = result.functionalRequirements;
                  }
                  else if (activePersona === 'market') {
                      if (Array.isArray(result)) {
                        newContent.competitors = result;
                      } else if (result.competitors && Array.isArray(result.competitors)) {
                        newContent.competitors = result.competitors;
                      }
                  }
                  else if (activePersona === 'ux') {
                      newContent.uiPlan = result;
                  }
                  else if (activePersona === 'db') {
                      newContent.dbSchema = result;
                  }
                  else if (activePersona === 'brand') {
                       if (result.logoSuggestion) {
                           newContent.logoSuggestion = {
                               ...newContent.logoSuggestion,
                               ...result.logoSuggestion,
                               base64Image: newContent.logoSuggestion?.base64Image || ''
                           }
                       } else if (result.description && result.palette) {
                           newContent.logoSuggestion = {
                               ...newContent.logoSuggestion,
                               ...result,
                               base64Image: newContent.logoSuggestion?.base64Image || ''
                           }
                       }
                  }
                  
                  return { ...prev, content: newContent };
              });

              // Add system confirmation to chat
              const confirmMsg: ChatMessage = {
                  id: Date.now().toString(),
                  role: 'model',
                  text: "✅ Alterações aplicadas com sucesso! Verifique o documento.",
                  timestamp: new Date()
              };
              setChatHistory(prev => ({
                ...prev,
                [activePersona]: [...prev[activePersona], confirmMsg]
              }));

              appContext?.showToast('Documento atualizado pelo agente!', 'success');
          } else {
              appContext?.showToast('Não foi possível aplicar as alterações.', 'error');
          }
      } catch (error) {
          console.error(error);
          appContext?.showToast('Erro ao regenerar conteúdo.', 'error');
      } finally {
          setIsActionLoading(false);
      }
  };

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPrdData(prev => ({ ...prev, [id]: value }));
  };

  const handleContentChange = (key: keyof PRD['content'], value: string) => {
      setPrdData(prev => ({
          ...prev,
          content: { ...prev.content, [key]: value }
      }));
  };
  
  const generateSection = useCallback(async (generator: () => Promise<any>, contentKey: keyof PRD['content'], message: string) => {
    setLoadingMessage(message);
    try {
      const result = await generator();
      if(result) {
        setPrdData(prev => ({
          ...prev,
          content: { ...prev.content, [contentKey]: result }
        }));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  // --- SMART FILL ---
  const handleSmartFill = async () => {
      if (!prdData.ideaDescription || prdData.ideaDescription.length < 5) {
          appContext?.showToast('Digite pelo menos um rascunho da ideia para usar a IA.', 'error');
          return;
      }
      setIsLoading(true);
      setLoadingMessage('Analisando sua ideia e preenchendo campos...');
      try {
          const suggestions = await geminiService.suggestPrdMetadata(prdData.ideaDescription);
          if (suggestions) {
              setPrdData(prev => ({
                  ...prev,
                  ...suggestions,
                  content: prev.content 
              }));
              appContext?.showToast('Campos preenchidos com IA!');
          } else {
               appContext?.showToast('Não foi possível sugerir metadados.', 'error');
          }
      } catch (e) {
          appContext?.showToast('Erro no preenchimento inteligente.', 'error');
      } finally {
          setIsLoading(false);
      }
  };

  // --- MANUAL GENERATION HANDLERS ---
  
  const handleGeneratePrdStructure = async () => {
      if (!prdData.title || !prdData.ideaDescription || !prdData.industry || !prdData.targetAudience) {
          appContext?.showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
          return;
      }
      setIsLoading(true);
      setLoadingMessage('Gerando estrutura do PRD...');
      try {
        const [summary, overview, funcReq] = await Promise.all([
          geminiService.generatePrdSection('Resumo Executivo', prdData),
          geminiService.generatePrdSection('Visão Geral do Produto', prdData),
          geminiService.generatePrdSection('Requisitos Funcionais (em lista)', prdData)
        ]);
        setPrdData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            executiveSummary: summary,
            productOverview: overview,
            functionalRequirements: funcReq ? funcReq.split('\n').filter(r => r.trim().length > 1) : [],
          }
        }));
        
        setIsPrdGenerated(true);
        appContext?.showToast('Estrutura gerada com sucesso!');
        
      } catch (e) {
        appContext?.showToast('Falha ao gerar seções iniciais do PRD.', 'error');
      } finally {
        setIsLoading(false);
      }
  };

  const handleGenerateCompetitors = async () => {
      setIsLoading(true);
      await generateSection(() => geminiService.generateCompetitors(prdData.industry!), 'competitors', 'Analisando concorrentes...');
      setIsLoading(false);
  };

  const handleGenerateUi = async () => {
      setIsLoading(true);
      await generateSection(() => geminiService.generateUiPlan(prdData.ideaDescription!), 'uiPlan', 'Arquitetando Interface do Usuário...');
      setIsLoading(false);
  };

  const handleGenerateDb = async () => {
      setIsLoading(true);
      await generateSection(() => geminiService.generateDbSchema(prdData.ideaDescription!), 'dbSchema', 'Modelando dados...');
      setIsLoading(false);
  };

  const handleGenerateLogo = async (optionsOverride?: { inspiration?: string }) => {
      setIsLoading(true);
      
      // Close modals
      if (isMagicMatchModalOpen) setIsMagicMatchModalOpen(false);
      if (isCreativeDirectionModalOpen) setIsCreativeDirectionModalOpen(false);

      // Logic to determine source of options
      let options: any = {};

      if (isCreativeDirectionModalOpen) {
          // Came from Creative Direction Modal (Advanced)
          const parts = [];
          if (logoInspiration) parts.push(`Inspiração Principal: ${logoInspiration}`);
          if (creativeStyle.length > 0) parts.push(`Estilos: ${creativeStyle.join(', ')}`);
          if (creativeColors.length > 0) parts.push(`Cores: ${creativeColors.join(', ')}`);
          if (creativeTypography) parts.push(`Tipografia: ${creativeTypography}`);
          if (creativeElements) parts.push(`Elementos Obrigatórios: ${creativeElements}`);
          if (creativeNegative) parts.push(`Evitar (Negative Prompt): ${creativeNegative}`);
          
          options = {
              customPrompt: parts.join('\n')
          };
      } else if (optionsOverride?.inspiration) {
          // Came from Simple Creative Direction (Quick Input)
          options = {
              customPrompt: `Conceito inspirado em: ${optionsOverride.inspiration}`
          };
      }
      // Else: Auto Pilot (empty options)
      
      await generateSection(() => geminiService.generateLogo(prdData.title!, prdData.industry!, options), 'logoSuggestion', 'Criando identidade visual...');
      setIsLoading(false);
  };

  // --- TURBO GENERATION & REGENERATE ---
  const updateTaskStatus = (id: string, status: TaskStatus) => {
      setTurboTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleRegenerate = async () => {
      if (currentStep === 1) await handleGenerateCompetitors();
      else if (currentStep === 2) await handleGenerateUi();
      else if (currentStep === 3) await handleGenerateDb();
      else if (currentStep === 4) await handleGenerateLogo();
      
      appContext?.showToast('Seção atualizada!');
  };

  const handleDownloadLogo = () => {
      if (!prdData.content?.logoSuggestion?.base64Image) return;
      
      const link = document.createElement("a");
      link.href = `data:image/jpeg;base64,${prdData.content.logoSuggestion.base64Image}`;
      link.download = `${prdData.title?.replace(/\s+/g, '_')}_logo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      appContext?.showToast('Logo baixado com sucesso!');
  };
  
  const handleGenerateDbCode = async (format: 'sql' | 'prisma') => {
      if (!prdData.content?.dbSchema) return;
      
      setIsLoading(true);
      setLoadingMessage(`Gerando código ${format.toUpperCase()}...`);
      
      try {
          const code = await geminiService.generateTechnicalSchema(prdData.content.dbSchema, format);
          
          setPrdData(prev => ({
              ...prev,
              content: {
                  ...prev.content,
                  [format === 'sql' ? 'dbSql' : 'dbPrisma']: code
              }
          }));
          
          // Auto download
          const blob = new Blob([code], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${prdData.title?.replace(/\s+/g, '_')}_${format}.${format === 'sql' ? 'sql' : 'prisma'}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          appContext?.showToast(`Arquivo ${format.toUpperCase()} baixado!`);
          
      } catch (e) {
          appContext?.showToast('Erro ao gerar código técnico.', 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleNextStep = async () => {
    // Step 0 Validation & Navigation (No Generation)
    if (currentStep === 0) {
        if (!prdData.title || !prdData.ideaDescription) {
             appContext?.showToast('Preencha pelo menos o Título e a Descrição para avançar.', 'error');
             return;
        }
        setMaxStepReached(Math.max(maxStepReached, 1)); 
        setCurrentStep(1);
        return;
    }
    
    // Generic Navigation for other steps
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
        setMaxStepReached(Math.max(maxStepReached, nextStep));
        setCurrentStep(nextStep);
    }
  };
  
  const handleSave = () => {
    if (!prdData.title) {
        appContext?.showToast('O PRD precisa de um título.', 'error');
        return;
    }
    
    const finalPrd: PRD = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prd-${Date.now()}`,
      userId: appContext?.user?.id || '',
      createdAt: new Date(),
      title: prdData.title,
      ideaDescription: prdData.ideaDescription || '',
      industry: prdData.industry || 'Geral',
      targetAudience: prdData.targetAudience || 'Geral',
      complexity: prdData.complexity || 'Média',
      content: prdData.content || {}
    };
    onSavePrd(finalPrd);
    
    // Reset to Initial State (Welcome Screen)
    setCurrentStep(0);
    setMaxStepReached(0);
    setIsPrdGenerated(false);
    setPrdData({ complexity: 'Média', content: {} });
  };

  const handleCompetitorClick = async (comp: Competitor, index: number) => {
      setSelectedCompetitorIndex(index);
      setIsCompetitorModalOpen(true);

      if (!comp.details) {
          setIsLoadingDetails(true);
          try {
              const details = await geminiService.analyzeCompetitorDeeply(comp.name, prdData.industry || '', comp.notes);
              if (details) {
                  setPrdData(prev => {
                      const newCompetitors = [...(prev.content?.competitors || [])];
                      if(newCompetitors[index]) {
                          newCompetitors[index] = { ...newCompetitors[index], details };
                      }
                      return { ...prev, content: { ...prev.content, competitors: newCompetitors } };
                  });
              }
          } catch (e) {
              console.error(e);
              appContext?.showToast("Erro ao carregar detalhes do concorrente", "error");
          } finally {
              setIsLoadingDetails(false);
          }
      }
  };

  // --- RENDER HELPERS ---

  const renderEmptyState = (title: string, description: string, onGenerate: () => void, icon: React.ReactNode, extraContent?: React.ReactNode) => (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border-2 border-dashed border-gray-200 rounded-xl animate-fade-in text-center transition-all">
          <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
              {icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
          
          {extraContent}

          <Button onClick={onGenerate} size="lg" className="shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-105 transition-transform mt-4">
              <WandIcon className="w-5 h-5 mr-2" />
              Gerar Agora com IA
          </Button>
      </div>
  );
  
  const renderGeneratedTextContent = () => (
     <div className="space-y-6 animate-fade-in">
        <Textarea 
            label="Resumo Executivo" 
            id="executiveSummary"
            rows={6}
            value={prdData.content?.executiveSummary || ''}
            onChange={(e) => handleContentChange('executiveSummary', e.target.value)}
        />
        <Textarea 
            label="Visão Geral do Produto" 
            id="productOverview"
            rows={6}
            value={prdData.content?.productOverview || ''}
            onChange={(e) => handleContentChange('productOverview', e.target.value)}
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
  );

  const renderCompetitorsContent = (isReviewMode = false) => (
      <>
        {!prdData.content?.competitors ? (
             renderEmptyState(
                 "Análise de Concorrentes", 
                 "A IA irá pesquisar o mercado e identificar os principais competidores do seu produto.", 
                 handleGenerateCompetitors, 
                 <GlobeIcon className="w-10 h-10" />
             )
        ) : (
            <>
                {!isReviewMode && (
                    <div className="flex justify-between items-center mb-4 animate-fade-in">
                        <p className="text-gray-600">A IA analisou o mercado. Clique em um concorrente para ver a análise profunda.</p>
                        <Button size="sm" variant="secondary" onClick={handleGenerateCompetitors}>Regenerar</Button>
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
                        {prdData.content.competitors.map((c, i) => (
                            <tr 
                                key={i} 
                                onClick={() => handleCompetitorClick(c, i)}
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
        )}
      </>
  );

  const renderUiContent = (isReviewMode = false) => (
      <>
        {!prdData.content?.uiPlan ? (
             renderEmptyState(
                 "Arquitetura de Interface",
                 "Gere um plano visual com fluxo de navegação (Flowchart) e detalhamento das principais telas.",
                 handleGenerateUi,
                 <LayoutIcon className="w-10 h-10" />
             )
        ) : (
            <div className="animate-fade-in">
                {!isReviewMode && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">Especificação visual e técnica das telas principais do produto.</p>
                        <Button size="sm" variant="secondary" onClick={handleGenerateUi}>Regenerar</Button>
                    </div>
                )}
                
                {/* Flowchart Section */}
                {prdData.content?.uiPlan?.flowchartSvg && (
                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Fluxo de Navegação</h4>
                        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50/50 shadow-sm flex justify-center overflow-hidden hover:bg-gray-50 transition-colors" 
                                dangerouslySetInnerHTML={{ __html: prdData.content.uiPlan.flowchartSvg }} />
                    </div>
                )}

                {/* Screen Details Grid */}
                {prdData.content?.uiPlan?.screens && Array.isArray(prdData.content.uiPlan.screens) && (
                    <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Especificação de Telas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {prdData.content.uiPlan.screens.map((screen, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
                                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                        <h5 className="font-bold text-lg text-gray-800">{screen.name}</h5>
                                        <span className="text-xs font-mono text-gray-400">#{idx + 1}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{screen.description}</p>
                                    <div>
                                        <span className="text-xs font-semibold text-primary mb-2 block">Componentes Chave:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {screen.components?.map((comp, cIdx) => (
                                                <span key={cIdx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
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
        )}
      </>
  );

  const renderDbContent = (isReviewMode = false) => (
      <>
        {!prdData.content?.dbSchema ? (
             renderEmptyState(
                 "Banco de Dados",
                 "Modele a estrutura de dados do seu sistema, incluindo tabelas, colunas e relacionamentos.",
                 handleGenerateDb,
                 <DatabaseIcon className="w-10 h-10" />
             )
        ) : (
            <div className="animate-fade-in">
                {!isReviewMode && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">Modelo sugerido para o Banco de Dados Relacional.</p>
                        <Button size="sm" variant="secondary" onClick={handleGenerateDb}>Regenerar</Button>
                    </div>
                )}

                {prdData.content?.dbSchema && Array.isArray(prdData.content.dbSchema) && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {prdData.content.dbSchema.map((table, idx) => (
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
                                    onClick={() => handleGenerateDbCode('sql')} 
                                    disabled={isLoading}
                                    className="border border-gray-300 bg-white hover:bg-gray-50"
                                >
                                    {prdData.content?.dbSql ? '⬇️ Baixar SQL (.sql)' : '⚡ Gerar & Baixar SQL'}
                                </Button>
                                    <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={() => handleGenerateDbCode('prisma')} 
                                    disabled={isLoading}
                                    className="border border-gray-300 bg-white hover:bg-gray-50"
                                >
                                        {prdData.content?.dbPrisma ? '⬇️ Baixar Prisma (.prisma)' : '⚡ Gerar & Baixar Prisma'}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}
      </>
  );

  const renderDesignStudioModal = () => (
    <Modal isOpen={isDesignStudioModalOpen} onClose={() => setIsDesignStudioModalOpen(false)} title="Estúdio de Design" maxWidth="2xl">
     <div className="p-6">
         {/* 1. Styles Gallery */}
         <div className="mb-8">
             <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <span className="p-1 bg-blue-100 rounded text-blue-600"><SparklesIcon className="w-3 h-3"/></span>
                 1. Estilo Visual
             </h4>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {LOGO_STYLES.map((style) => {
                     const isSelected = logoStyle === style.id;
                     return (
                         <button
                            key={style.id}
                            onClick={() => setLogoStyle(style.id)}
                            className={`
                                group relative flex flex-col items-center text-left rounded-xl border-2 transition-all duration-200 overflow-hidden bg-gray-50
                                ${isSelected 
                                    ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.02] bg-white' 
                                    : 'border-transparent hover:border-gray-300 hover:shadow-sm hover:bg-white'}
                            `}
                         >
                             <div className="w-full h-20 overflow-hidden relative flex items-center justify-center">
                                 {style.renderVisual()}
                                 {isSelected && (
                                     <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 shadow-sm animate-scale-up">
                                         <CheckIcon className="w-3 h-3" />
                                     </div>
                                 )}
                             </div>
                             
                             <div className="w-full p-2 text-center border-t border-gray-100/50">
                                 <p className="text-xs font-bold text-gray-700 group-hover:text-gray-900">
                                     {style.label}
                                 </p>
                             </div>
                         </button>
                     );
                 })}
             </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 2. Typography */}
            <div>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="p-1 bg-purple-100 rounded text-purple-600"><CodeIcon className="w-3 h-3"/></span>
                    2. Tipografia
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {TYPOGRAPHY_OPTIONS.map((type) => {
                         const isSelected = logoTypography === type.id;
                         return (
                             <button
                                key={type.id}
                                onClick={() => setLogoTypography(type.id)}
                                className={`
                                    flex items-center justify-between px-3 py-2 rounded-lg border transition-all
                                    ${isSelected
                                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                                        : 'border-gray-200 hover:border-purple-300 text-gray-600'}
                                `}
                             >
                                 <span className="text-xs font-medium">{type.label}</span>
                                 <span className={`text-lg ${type.font || ''} opacity-70`}>{type.example}</span>
                             </button>
                         );
                    })}
                </div>
            </div>

             {/* 3. Color Palette */}
             <div>
                 <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                     <span className="p-1 bg-amber-100 rounded text-amber-600"><BulbIcon className="w-3 h-3"/></span>
                     3. Cores
                 </h4>
                 <div className="grid grid-cols-2 gap-3">
                     {COLOR_PALETTES.map((palette) => {
                         const isSelected = logoColor === palette.id;
                         return (
                             <button
                                key={palette.id}
                                onClick={() => setLogoColor(palette.id)}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg border transition-all
                                    ${isSelected
                                        ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-200'
                                        : 'border-gray-200 hover:border-amber-300 bg-white'}
                                `}
                             >
                                 <div className="flex -space-x-1">
                                     {palette.colors.map(c => (
                                         <div key={c} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                                     ))}
                                 </div>
                                 <span className={`text-xs font-medium ${isSelected ? 'text-amber-900' : 'text-gray-600'}`}>
                                     {palette.label}
                                 </span>
                             </button>
                         );
                     })}
                 </div>
             </div>
         </div>

         <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
             <Button 
                variant="ghost" 
                onClick={() => {
                    setIsDesignStudioModalOpen(false);
                    setIsMagicMatchModalOpen(true);
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
             >
                 <ChevronDownIcon className="w-4 h-4 mr-2 rotate-90" />
                 Voltar
             </Button>

             <div className="flex gap-3">
                 <Button variant="secondary" onClick={() => setIsDesignStudioModalOpen(false)}>
                     Cancelar
                 </Button>
                 <Button onClick={() => handleGenerateLogo()} className="shadow-lg bg-gradient-to-r from-primary to-primary-dark">
                     <WandIcon className="w-4 h-4 mr-2" />
                     Gerar Logo Personalizado
                 </Button>
             </div>
         </div>
     </div>
    </Modal>
  );

  const renderMagicMatchModal = () => (
    <Modal isOpen={isMagicMatchModalOpen} onClose={() => setIsMagicMatchModalOpen(false)} title="Como você quer criar sua identidade visual?" maxWidth="4xl">
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* 1. Piloto Automático - Otimizado para velocidade */}
                <button 
                    onClick={() => handleGenerateLogo()}
                    className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-6 text-left transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <StarsIcon className="w-24 h-24 text-blue-600 rotate-12" />
                    </div>
                    
                    <div className="relative z-10 mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <StarsIcon className="w-7 h-7"/>
                    </div>
                    
                    <div className="relative z-10 flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Piloto Automático</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Deixe a IA surpreender você. Analisamos seu PRD e criamos o conceito ideal instantaneamente.
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 border-t border-gray-50 w-full">
                         <div className="flex items-center text-sm font-bold text-blue-600 opacity-60 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Gerar Instantaneamente <ChevronDownIcon className="w-4 h-4 ml-2 rotate-[-90deg]" />
                         </div>
                    </div>
                </button>

                {/* 2. Direção Criativa - O Card "Hero" */}
                <div className="relative flex flex-col h-full bg-white rounded-2xl border-2 border-purple-500 shadow-2xl shadow-purple-500/10 p-1 transform md:scale-105 z-10">
                    <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow-lg tracking-widest flex items-center gap-2">
                            <StarsIcon className="w-3 h-3" /> Recomendado
                        </div>
                    </div>
                    
                    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50/50 to-white rounded-xl p-5">
                        <div className="mb-5 flex items-center gap-4">
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                                <WandIcon className="w-7 h-7"/>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Direção Criativa</h4>
                                <span className="text-xs text-purple-600 font-medium">Colaborativo com IA</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">
                           Guie a IA com detalhes. Escolha estilos, cores e elementos para criar o logo perfeito.
                        </p>
                        
                        <Button 
                            size="lg" 
                            className="w-full mt-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all transform active:scale-95" 
                            onClick={() => {
                                setIsMagicMatchModalOpen(false);
                                setIsCreativeDirectionModalOpen(true);
                            }}
                        >
                            <SettingsIcon className="w-5 h-5 mr-2" />
                            Usar Editor Criativo
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    </Modal>
  );

  const renderCreativeDirectionModal = () => {
    // Helper function for multi-select state
    const handleMultiSelect = (
        value: string, 
        state: string[], 
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const MAX_SELECTIONS = 3;
        if (state.includes(value)) {
            setter(state.filter(item => item !== value));
        } else {
            if (state.length < MAX_SELECTIONS) {
                setter([...state, value]);
            } else {
                appContext?.showToast(`Você pode selecionar até ${MAX_SELECTIONS} opções.`, 'info');
            }
        }
    };

    const generatedPromptPreview = [
        logoInspiration,
        creativeStyle.length > 0 ? `Estilos: ${creativeStyle.join(', ')}.` : '',
        creativeColors.length > 0 ? `Cores: ${creativeColors.join(', ')}.` : '',
        creativeTypography ? `Tipografia: ${creativeTypography}.` : '',
        creativeElements ? `Deve incluir: ${creativeElements}.` : '',
        creativeNegative ? `Não deve incluir: ${creativeNegative}.` : ''
    ].filter(Boolean).join(' ');
    
    return (
        <Modal 
            isOpen={isCreativeDirectionModalOpen} 
            onClose={() => setIsCreativeDirectionModalOpen(false)} 
            title="Direção Criativa Avançada" 
            maxWidth="5xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[75vh]">
                {/* LEFT: Inputs */}
                <div className="p-8 space-y-6 bg-white overflow-y-auto">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Passo 1: Descreva sua Visão</h3>
                        <p className="text-sm text-gray-500 mb-4">Qual é a ideia central ou sentimento que o logo deve transmitir?</p>
                        <Textarea
                            id="logoInspiration"
                            placeholder="Ex: Um tigre forte e minimalista para uma marca de café..."
                            value={logoInspiration}
                            onChange={(e) => setLogoInspiration(e.target.value)}
                            rows={5}
                            className="border-2 focus:border-primary focus:ring-1 focus:ring-primary/50"
                        />
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Passo 2: Especifique os Detalhes</h3>
                        <p className="text-sm text-gray-500 mb-4">Seja específico para refinar o resultado da IA.</p>
                        <div className="space-y-4">
                            <Input 
                                id="creativeElements"
                                label="Elementos Obrigatórios (Opcional)"
                                placeholder="Ex: um escudo, uma coroa, um livro"
                                value={creativeElements}
                                onChange={e => setCreativeElements(e.target.value)}
                            />
                            <Input 
                                id="creativeNegative"
                                label="O que Evitar (Prompt Negativo)"
                                placeholder="Ex: sem animais, cores escuras, muito detalhe"
                                value={creativeNegative}
                                onChange={e => setCreativeNegative(e.target.value)}
                            />
                        </div>
                     </div>
                </div>

                {/* RIGHT: Visual Choices & Preview */}
                <div className="p-8 space-y-6 bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto">
                    {/* Visual Styles */}
                    <div className="flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Passo 3: Escolha até 3 Estilos</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {LOGO_STYLES.slice(0, 12).map(style => {
                                const isSelected = creativeStyle.includes(style.id);
                                return (
                                    <button
                                        key={style.id}
                                        onClick={() => handleMultiSelect(style.id, creativeStyle, setCreativeStyle)}
                                        title={style.label}
                                        className={`group relative flex flex-col items-center text-center rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                                            isSelected ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
                                        }`}
                                    >
                                        <div className="w-full h-16 bg-white flex items-center justify-center">{style.renderVisual()}</div>
                                        <div className={`w-full p-2 text-xs font-semibold border-t ${isSelected ? 'bg-primary/5 text-primary' : 'bg-gray-100 text-gray-700'}`}>{style.label}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                     {/* Color Palettes */}
                    <div className="flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Passo 4: Escolha até 3 Paletas</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {CREATIVE_COLORS.map(palette => {
                                 const isSelected = creativeColors.includes(palette.id);
                                return (
                                    <button
                                        key={palette.id}
                                        onClick={() => handleMultiSelect(palette.id, creativeColors, setCreativeColors)}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all ${
                                            isSelected ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-gray-200 hover:border-gray-400 bg-white'
                                        }`}
                                    >
                                        <div className="flex -space-x-1.5">
                                            {palette.colors.map(c => <div key={c} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />)}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">{palette.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Passo 5: Escolha a Tipografia</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {TYPOGRAPHY_OPTIONS.map((type) => {
                                const isSelected = creativeTypography === type.id;
                                return (
                                    <button
                                       key={type.id}
                                       onClick={() => setCreativeTypography(type.id)}
                                       className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                                           isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30 scale-105' : 'border-gray-200 hover:border-gray-400 bg-white'
                                       }`}
                                    >
                                        <span className="text-sm font-semibold">{type.label.split('(')[0]}</span>
                                        <span className={`text-xl ${type.font || ''} opacity-80`}>{type.example}</span>
                                    </button>
                                );
                           })}
                        </div>
                    </div>

                    {/* Live Prompt Preview */}
                    <div className="mt-auto pt-6 border-t border-gray-200 flex-shrink-0">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Seu Prompt para a IA</h4>
                        <div className="p-4 rounded-lg bg-gray-200 text-gray-700 text-sm min-h-[80px] italic">
                           {generatedPromptPreview || <span className="text-gray-400">Comece a preencher para ver a mágica...</span>}
                        </div>
                    </div>
                </div>
            </div>

             <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center">
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        setIsCreativeDirectionModalOpen(false);
                        setIsMagicMatchModalOpen(true);
                    }}
                >
                    <ChevronDownIcon className="w-4 h-4 mr-2 rotate-90" />
                    Voltar
                </Button>
                <Button 
                    onClick={() => handleGenerateLogo()} 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-transform"
                    size="lg"
                    disabled={!logoInspiration}
                >
                    <WandIcon className="w-5 h-5 mr-2" />
                    Gerar Logo com Direção Criativa
                </Button>
            </div>
        </Modal>
    );
  };

  const renderLogoContent = (isReviewMode = false) => (
      <>
        {!prdData.content?.logoSuggestion ? (
            // Custom Empty State for Logo to handle the Toggle logic
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border-2 border-dashed border-gray-200 rounded-xl animate-fade-in text-center transition-all">
                <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
                    <LogoIcon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Identidade Visual</h3>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                    A IA criará um conceito de marca, paleta de cores e uma sugestão visual de logotipo baseada no seu produto.
                </p>

                <Button onClick={() => setIsMagicMatchModalOpen(true)} size="lg" className="shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-105 transition-transform">
                    <WandIcon className="w-5 h-5 mr-2" />
                    Criar Identidade Visual
                </Button>
            </div>
        ) : (
            <div className="animate-fade-in">
                {!isReviewMode && (
                    <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">Conceito visual e Logo profissional gerado pelo modelo de imagem.</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" onClick={() => {
                                    // Reset logo and open creative direction modal for refinement
                                    setPrdData(prev => ({...prev, content: {...prev.content, logoSuggestion: undefined}}));
                                    setIsCreativeDirectionModalOpen(true); 
                                }}>
                                    Refinar Estilo
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => handleGenerateLogo()}>Regenerar</Button>
                            </div>
                    </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-8">
                        {/* Logo Display */}
                    <div className="flex flex-col items-center space-y-3">
                            <div className="w-64 h-64 bg-white border-2 border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-4">
                                {prdData.content.logoSuggestion.base64Image ? (
                                    <img 
                                    src={`data:image/jpeg;base64,${prdData.content.logoSuggestion.base64Image}`} 
                                    alt="Generated Logo" 
                                    className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-center text-sm">Erro ao carregar imagem.<br/>Tente regenerar.</span>
                                )}
                        </div>
                        {prdData.content.logoSuggestion.base64Image && (
                            <Button size="sm" variant="secondary" onClick={handleDownloadLogo}>
                                Download JPG
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Conceito da Marca</h4>
                            <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg border border-gray-100">
                                "{prdData.content.logoSuggestion.description}"
                            </p>
                        </div>

                        <div>
                                <h4 className="font-bold text-gray-900 mb-3">Paleta de Cores</h4>
                                <div className="grid grid-cols-2 gap-3">
                                {prdData.content.logoSuggestion.palette?.map((color, i) => (
                                    <div key={i} className="flex items-center p-2 border rounded-lg">
                                        <div className="w-8 h-8 rounded-md mr-3 shadow-sm" style={{ backgroundColor: color.hex }} />
                                        <div>
                                            <p className="font-mono text-xs font-bold text-gray-800">{color.hex}</p>
                                            <p className="text-xs text-gray-500">{color.name}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </>
  );

  // --- RENDER STEPS ---
  const reviewTabs = [
      { id: 'text', label: 'Detalhes e Texto' },
      { id: 'competitors', label: 'Concorrentes' },
      { id: 'ui', label: 'Interface (UI)' },
      { id: 'db', label: 'Banco de Dados' },
      { id: 'logo', label: 'Identidade Visual' },
  ];

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
        // CONDITIONAL RENDERING:
        // If we have generated content, show the generated text.
        // Otherwise, show the input form.
        if (isPrdGenerated) {
            return (
                <Card title="1. Documento PRD" headerAction={renderChatAction()}>
                    <div className="flex justify-between items-center mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-800">
                            <strong>Ideia Base:</strong> {prdData.title} - {prdData.industry}
                        </p>
                        <Button variant="secondary" size="sm" onClick={() => { setIsPrdGenerated(false); }} className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-50">
                            ✏️ Editar Ideia
                        </Button>
                    </div>
                    {renderGeneratedTextContent()}
                </Card>
            );
        }
        
        return (
          <Card title="1. Detalhes do Documento" headerAction={renderChatAction()}>
             <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-bold text-purple-800 mb-2 text-sm uppercase tracking-wide">🪄  Preenchimento Mágico</h4>
                <p className="text-sm text-purple-700 mb-3">Não quer digitar tudo? Escreva apenas a ideia abaixo e clique na varinha.</p>
                 <div className="flex gap-2 flex-col sm:flex-row">
                    <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm placeholder-purple-300"
                        placeholder="Ex: Um app tipo Tinder para adoção de plantas"
                        value={prdData.ideaDescription || ''}
                        onChange={handleInputChange}
                        id="ideaDescription"
                    />
                    <Button onClick={handleSmartFill} variant="secondary" className="whitespace-nowrap bg-white border border-purple-200 text-purple-700 hover:bg-purple-100">
                         ✨ Mágica
                    </Button>
                </div>
            </div>
            
            <div className="space-y-4">
              <Input id="title" label="Título do Produto/Projeto" value={prdData.title || ''} onChange={handleInputChange} placeholder="Ex: Uber para Pets" />
              {!prdData.ideaDescription && (
                 <Textarea id="ideaDescription" label="Descrição da Ideia" value={prdData.ideaDescription || ''} onChange={handleInputChange} placeholder="Descreva a funcionalidade principal..." />
              )}
               {prdData.ideaDescription && prdData.ideaDescription.length > 50 && (
                 <Textarea id="ideaDescription" label="Refinar Descrição (Detalhada)" value={prdData.ideaDescription || ''} onChange={handleInputChange} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="industry" label="Indústria / Mercado" value={prdData.industry || ''} onChange={handleInputChange} placeholder="Ex: Pet Care, Fintech" />
                <Input id="targetAudience" label="Público-alvo" value={prdData.targetAudience || ''} onChange={handleInputChange} placeholder="Ex: Donos de cães em áreas urbanas" />
              </div>
              <Select id="complexity" label="Complexidade" value={prdData.complexity} onChange={handleInputChange}>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </Select>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Button onClick={handleGeneratePrdStructure} isLoading={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:scale-105 transition-transform">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Gerar Estrutura com IA
                  </Button>
              </div>
            </div>
          </Card>
        );
      case 1:
        return (
          <Card title="2. Análise de Concorrentes" headerAction={renderChatAction()}>
            {renderCompetitorsContent()}
          </Card>
        );
       case 2:
        return (
          <Card title="3. Plano de Interface Profissional" headerAction={renderChatAction()}>
            {renderUiContent()}
          </Card>
        );
        case 3:
            return (
            <Card title="4. Estrutura de Dados" headerAction={renderChatAction()}>
                {renderDbContent()}
            </Card>
            );
        case 4:
            return (
            <Card title="5. Identidade Visual" headerAction={renderChatAction()}>
                {renderLogoContent()}
            </Card>
            );
        case 5:
            return (
            <div className="space-y-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">6. Revisão Final</h2>
                    <p className="text-gray-600">Revise, edite e exporte o documento final.</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Review Tabs Header */}
                    <div className="border-b border-gray-200 bg-gray-50 flex justify-between items-center pr-4">
                        <nav className="flex overflow-x-auto" aria-label="Tabs">
                            {reviewTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveReviewTab(tab.id)}
                                    className={`
                                        whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                                        ${activeReviewTab === tab.id
                                            ? 'border-primary text-primary bg-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100'}
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                        {/* Chat Button in Tab Header for Review Step */}
                        <div className="flex-shrink-0">
                            {renderChatAction()}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 min-h-[400px]">
                        {activeReviewTab === 'text' && renderGeneratedTextContent()}

                        {activeReviewTab === 'competitors' && (
                            <div className="animate-fade-in">
                                {renderCompetitorsContent(true)}
                            </div>
                        )}

                        {activeReviewTab === 'ui' && (
                             <div className="animate-fade-in">
                                {renderUiContent(true)}
                            </div>
                        )}

                        {activeReviewTab === 'db' && (
                             <div className="animate-fade-in">
                                {renderDbContent(true)}
                            </div>
                        )}

                        {activeReviewTab === 'logo' && (
                             <div className="animate-fade-in">
                                {renderLogoContent(true)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} size="lg" className="shadow-lg transform hover:scale-105 transition-transform">
                            💾 Salvar Documento Completo
                        </Button>
                </div>
            </div>
            );
      default:
        return null;
    }
  };

  // --- RENDER MAIN ---
  return (
    <div className="max-w-5xl mx-auto pb-10 relative">
      <div className="mb-8 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">Gerador de PRD</h1>
          <p className="mt-1 text-gray-600">Crie especificações detalhadas usando IA.</p>
      </div>

        <div className="animate-slide-up">
            {/* INTERACTIVE STEPPER NAVIGATION (Only visible after first generation) */}
            {(maxStepReached > 0 || isPrdGenerated) && (
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
                <div className="mt-6 flex justify-end">
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
          isLoading={isLoadingDetails}
      />

      {/* Magic Match Modal */}
      {renderMagicMatchModal()}

      {/* Creative Direction Modal */}
      {renderCreativeDirectionModal()}

        {/* Turbo Mode Progress Modal */}
        <Modal isOpen={showTurboModal} onClose={() => {}} title="Gerando PRD Completo">
            <div className="space-y-6">
                <p className="text-gray-600 text-sm">A IA está trabalhando em paralelo para gerar todas as seções do seu documento. Por favor, aguarde.</p>
                
                <div className="space-y-3">
                    {turboTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="flex items-center space-x-3">
                                {task.status === 'loading' && (
                                     <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {task.status === 'success' && (
                                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                    </div>
                                )}
                                {task.status === 'error' && (
                                     <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                                        <XIcon className="w-3 h-3 text-red-600" />
                                    </div>
                                )}
                                {task.status === 'idle' && (
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-200"></div>
                                )}
                                <span className={`text-sm ${task.status === 'success' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {task.label}
                                </span>
                            </div>
                            {task.status === 'loading' && <span className="text-xs text-primary font-medium animate-pulse">Gerando...</span>}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default GeneratePrd;
