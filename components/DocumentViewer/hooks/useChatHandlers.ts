import { useState, useContext } from 'react';
import type { ChatMessage, AgentPersona } from '../../../types';
import { geminiService } from '../../../services/geminiService';
import { AppContext } from '../../../contexts/AppContext';

interface UseChatHandlersProps {
  getContextData: () => string;
  activePersona: AgentPersona;
}

export const useChatHandlers = ({ getContextData, activePersona }: UseChatHandlersProps) => {
  const appContext = useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<AgentPersona, ChatMessage[]>>({
    pm: [],
    market: [],
    ux: [],
    db: [],
    brand: []
  });

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

  return {
    isChatOpen,
    setIsChatOpen,
    isChatLoading,
    chatHistory,
    handleSendMessage
  };
};
