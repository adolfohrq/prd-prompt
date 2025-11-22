
import React, { useState, useContext, useEffect } from 'react';
import { SPECIALIST_AGENTS } from '../constants';
import type { SpecialistAgent, ChatMessage, ChatSession, UserAgentPrefs, PromptDocument } from '../types';
import { AgentCard } from '../components/AgentCard';
import { AgentDetailsModal } from '../components/AgentDetailsModal';
import { ChatDrawer } from '../components/Chat/ChatDrawer';
import { MagicMatchModal } from '../components/MagicMatchModal';
import { SearchIcon, WandIcon, StarIcon } from '../components/icons/Icons';
import { AppContext } from '../contexts/AppContext';
import { geminiService } from '../services/geminiService';
import { db } from '../services/databaseService';

export const AgentHub: React.FC = () => {
  const appContext = useContext(AppContext);
  const userId = appContext?.user?.id || '';
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  // Data State (v2.0)
  const [prefs, setPrefs] = useState<UserAgentPrefs>({ userId, favorites: [], recents: [] });
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  // Modal State
  const [detailsAgent, setDetailsAgent] = useState<SpecialistAgent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  // Chat State
  const [activeAgent, setActiveAgent] = useState<SpecialistAgent | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
      if (userId) {
          db.getAgentPrefs(userId).then(setPrefs);
          db.getChatSessions(userId).then(setSessions);
      }
  }, [userId]);

  const categories = ['Todos', ...new Set(SPECIALIST_AGENTS.map(a => a.category))];

  const filteredAgents = SPECIALIST_AGENTS.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            agent.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  // Favorites Logic
  const toggleFavorite = async (agentId: string) => {
      await db.toggleFavoriteAgent(userId, agentId);
      const newPrefs = await db.getAgentPrefs(userId);
      setPrefs(newPrefs);
      appContext?.showToast(newPrefs.favorites.includes(agentId) ? 'Favorito adicionado!' : 'Favorito removido.');
  };

  const handleOpenDetails = (agent: SpecialistAgent) => {
      setDetailsAgent(agent);
      setIsDetailsOpen(true);
  };

  const handleStartChat = async (agent: SpecialistAgent) => {
      setActiveAgent(agent);
      setIsDetailsOpen(false);
      setIsMagicOpen(false);
      
      const agentSessions = await db.getChatSessions(userId, agent.id);
      if (agentSessions.length > 0) {
          setCurrentMessages(agentSessions[0].messages);
      } else {
          setCurrentMessages([]);
      }
      
      setIsChatOpen(true);
  };

  const handleMagicMatch = async (text: string) => {
      setIsMagicLoading(true);
      const agentList = SPECIALIST_AGENTS.map(a => ({ id: a.id, desc: `${a.name} - ${a.role} - ${a.shortDescription}` }));
      
      const recommendedId = await geminiService.classifyAgent(text, agentList);
      setIsMagicLoading(false);

      if (recommendedId && recommendedId !== 'none') {
          const agent = SPECIALIST_AGENTS.find(a => a.id === recommendedId);
          if (agent) {
              appContext?.showToast(`Recomendado: ${agent.name}!`, 'success');
              handleStartChat(agent);
          } else {
              appContext?.showToast('Não encontrei um agente exato, tente buscar manualmente.', 'error');
          }
      } else {
          appContext?.showToast('Não consegui identificar um especialista para isso. Tente reformular.', 'error');
      }
  };

  const handleSendMessage = async (text: string, attachedDocContext?: string, imageBase64?: string) => {
      if (!activeAgent) return;

      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text,
          timestamp: new Date(),
          image: imageBase64 
      };

      const updatedHistory = [...currentMessages, newMessage];
      setCurrentMessages(updatedHistory); // Optimistic
      setIsChatLoading(true);

      try {
          const responseText = await geminiService.chatWithSpecialist(
              updatedHistory,
              activeAgent.systemInstruction,
              attachedDocContext
          );

          const aiMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              timestamp: new Date()
          };

          const finalHistory = [...updatedHistory, aiMessage];
          setCurrentMessages(finalHistory);

          const existingSession = sessions.find(s => s.agentId === activeAgent.id && s.userId === userId);
          
          const sessionToSave: ChatSession = {
              id: existingSession ? existingSession.id : `${userId}-${activeAgent.id}-${Date.now()}`,
              userId,
              agentId: activeAgent.id,
              title: existingSession ? existingSession.title : `Chat com ${activeAgent.name}`,
              messages: finalHistory,
              lastUpdated: new Date()
          };
          
          await db.saveChatSession(sessionToSave);
          db.getAgentPrefs(userId).then(setPrefs);

      } catch (error) {
          console.error(error);
          appContext?.showToast('Erro ao conversar com o agente.', 'error');
      } finally {
          setIsChatLoading(false);
      }
  };

  const handleSaveMessage = async (content: string) => {
      if (!activeAgent || !userId) return;
      
      try {
          const snippet: PromptDocument = {
              id: '', 
              userId,
              prdId: 'agent-chat', 
              prdTitle: `Chat com ${activeAgent.name}`,
              type: 'Script/Tool',
              targetPlatform: 'Generic',
              stack: 'N/A',
              framework: 'N/A',
              specialRequirements: 'Gerado via Hub de Agentes',
              content: content,
              createdAt: new Date()
          };
          
          await db.createPrompt(snippet);
          appContext?.showToast('Mensagem salva em "Meus Documentos"!');
      } catch (e) {
          appContext?.showToast('Erro ao salvar mensagem.', 'error');
      }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Background Decoration */}
        <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none" />
        
        {/* HERO SECTION */}
        <div className="py-8 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    AI Agents v2.0
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                    Hub de Especialistas
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl">
                    Sua equipe virtual de alta performance. Selecione um agente e resolva tarefas complexas em segundos.
                </p>
            </div>

            <button 
                onClick={() => setIsMagicOpen(true)}
                className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-2 font-bold text-sm tracking-wide">
                    <WandIcon className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors animate-pulse" />
                    <span>MAGIC MATCH</span>
                </div>
            </button>
        </div>

        {/* QUICK ACCESS (Mini Cards) */}
        {(prefs.favorites.length > 0 || prefs.recents.length > 0) && (
            <div className="mb-10">
                 <div className="flex items-center gap-2 mb-4 px-1">
                    <StarIcon className="w-4 h-4 text-amber-400" filled />
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Acesso Rápido</h3>
                 </div>
                 
                 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent -mx-4 px-4">
                    {[...prefs.favorites, ...prefs.recents.filter(id => !prefs.favorites.includes(id))].map(id => {
                        const agent = SPECIALIST_AGENTS.find(a => a.id === id);
                        if (!agent) return null;
                        const isFav = prefs.favorites.includes(id);
                        
                        return (
                             <button 
                                key={id} 
                                onClick={() => handleStartChat(agent)} 
                                className={`
                                    flex-shrink-0 flex flex-col justify-between p-4 w-40 h-32 rounded-2xl border transition-all duration-200
                                    ${isFav 
                                        ? 'bg-white border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300' 
                                        : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300'}
                                `}
                             >
                                <div className="flex justify-between items-start w-full">
                                    <span className="text-2xl filter drop-shadow-sm">
                                         {agent.category === 'Marketing' && '🚀'} {agent.category === 'Dev' && '💻'} {agent.category === 'Design' && '🎨'} {agent.category === 'Data' && '📊'} {agent.category === 'Product' && '💡'} {agent.category === 'Content' && '📝'}
                                    </span>
                                    {isFav && <StarIcon filled className="w-4 h-4 text-amber-400" />}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-gray-800 leading-tight line-clamp-2">{agent.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{agent.category}</p>
                                </div>
                             </button>
                        )
                    })}
                 </div>
            </div>
        )}

        {/* STICKY FILTER BAR */}
        <div className="sticky top-0 z-30 pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
                {/* Categories */}
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-1 px-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                                ${selectedCategory === cat 
                                    ? 'bg-gray-900 text-white shadow-md' 
                                    : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72 shrink-0">
                    <input 
                        type="text" 
                        placeholder="Buscar especialista..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none placeholder-gray-400 font-medium"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>
        </div>

        {/* AGENTS GRID */}
        {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredAgents.map(agent => (
                    <AgentCard 
                        key={agent.id} 
                        agent={agent} 
                        onChat={handleStartChat}
                        onDetails={handleOpenDetails}
                        isFavorite={prefs.favorites.includes(agent.id)}
                        onToggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Nenhum agente encontrado</h3>
                <p className="text-gray-500 text-sm mt-1">Tente ajustar seus filtros ou busca.</p>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('Todos');}}
                    className="mt-4 px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors"
                >
                    Limpar Filtros
                </button>
            </div>
        )}

        {/* Modals */}
        <AgentDetailsModal 
            agent={detailsAgent}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onChat={handleStartChat}
        />

        <MagicMatchModal 
            isOpen={isMagicOpen}
            onClose={() => setIsMagicOpen(false)}
            onSubmit={handleMagicMatch}
            isLoading={isMagicLoading}
        />

        {activeAgent && (
            <ChatDrawer 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                messages={currentMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                customAgentConfig={{
                    name: activeAgent.name,
                    role: activeAgent.role,
                    initialSuggestions: [activeAgent.initialMessage]
                }}
                onSaveMessage={handleSaveMessage}
            />
        )}
    </div>
  );
};
