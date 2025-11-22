import { useContext } from 'react';
import type { PRD, ChatMessage, AgentPersona } from '../../../types';
import { geminiService } from '../../../services/geminiService';
import { AppContext } from '../../../contexts/AppContext';

interface UseChatHandlersProps {
  prdData: Partial<PRD>;
  setPrdData: React.Dispatch<React.SetStateAction<Partial<PRD>>>;
  activePersona: AgentPersona;
  chatHistory: Record<AgentPersona, ChatMessage[]>;
  setChatHistory: React.Dispatch<React.SetStateAction<Record<AgentPersona, ChatMessage[]>>>;
  setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChatHandlers = ({
  prdData,
  setPrdData,
  activePersona,
  chatHistory,
  setChatHistory,
  setIsChatLoading,
  setIsActionLoading
}: UseChatHandlersProps) => {
  const appContext = useContext(AppContext);

  const getContextData = () => {
    switch (activePersona) {
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
      default:
        return "";
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

  const handleApplyChatChanges = async () => {
    setIsActionLoading(true);
    try {
      const context = getContextData();
      const history = chatHistory[activePersona];

      const result = await geminiService.refineSection(activePersona, context, history);

      if (result) {
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

  return {
    handleSendMessage,
    handleApplyChatChanges,
    getContextData
  };
};
