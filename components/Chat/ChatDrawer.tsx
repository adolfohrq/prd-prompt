
import React, { useState, useRef, useEffect, useContext } from 'react';
import { XIcon, SendIcon, SparklesIcon, ChatIcon, ClipIcon, MaximizeIcon, MinimizeIcon } from '../icons/Icons';
import { ChatBubble } from './ChatBubble';
import type { ChatMessage, AgentPersona, PRD } from '../../../types';
import { DocumentSelectorModal } from '../DocumentSelectorModal';
import { AppContext } from '../../contexts/AppContext';
import { IconButton } from '../IconButton';
import { Button } from '../Button';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, attachedDoc?: string, image?: string) => void;
  isLoading: boolean;
  persona?: AgentPersona;
  customAgentConfig?: {
      name: string;
      role: string;
      initialSuggestions?: string[];
  };
  onAction?: () => void;
  isActionLoading?: boolean;
  onSaveMessage?: (text: string) => void;
}

const personaConfig: Record<AgentPersona, { name: string; role: string }> = {
    pm: { name: 'Gerente de Produto', role: 'Estratégia e Escopo' },
    market: { name: 'Analista de Mercado', role: 'Pesquisa Competitiva' },
    ux: { name: 'Designer de Interface', role: 'UX/UI' },
    db: { name: 'Arquiteto de Dados', role: 'Modelagem DB' },
    brand: { name: 'Diretor Criativo', role: 'Branding' },
};

const quickSuggestions: Record<AgentPersona, string[]> = {
    pm: ["Refine a descrição", "Sugira 3 features", "Critérios de aceite"],
    market: ["Pontos fracos dos rivais", "Diferencial único", "Tendências"],
    ux: ["Melhore a acessibilidade", "Novo fluxo de usuário", "Componentes faltando"],
    db: ["Normalizar (3NF)", "Sugerir índices", "Adicionar tabela de logs"],
    brand: ["Psicologia das cores", "Paleta moderna", "Ideia de ícone"]
};

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ 
    isOpen, onClose, messages, onSendMessage, isLoading, persona, customAgentConfig, onAction, isActionLoading, onSaveMessage 
}) => {
  const appContext = useContext(AppContext);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // v2 Features States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [attachedDoc, setAttachedDoc] = useState<PRD | null>(null);
  const [pastedImage, setPastedImage] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isFullscreen]);

  // Global Shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!isOpen) return;
          if (e.key === 'Escape') onClose();
          if (e.key === '/' && document.activeElement !== inputRef.current) {
              e.preventDefault();
              inputRef.current?.focus();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Paste (Image)
  const handlePaste = (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
              const blob = items[i].getAsFile();
              if (blob) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                      if(event.target?.result) {
                          setPastedImage(event.target.result as string);
                      }
                  };
                  reader.readAsDataURL(blob);
                  e.preventDefault(); // Prevent pasting binary code text
              }
          }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if ((!inputValue.trim() && !pastedImage) || isLoading) return;
      
      // Prepare context data string
      let contextStr = undefined;
      if (attachedDoc) {
          contextStr = JSON.stringify(attachedDoc.content);
      }

      // Clean up image base64 for sending (remove data:image/png;base64, prefix)
      let imagePayload = undefined;
      if (pastedImage) {
          imagePayload = pastedImage.split(',')[1];
      }

      onSendMessage(inputValue, contextStr, imagePayload);
      setInputValue('');
      setPastedImage(null);
  };

  // Determine Config Source (Custom vs Persona)
  let config = { name: 'Assistente', role: 'IA' };
  let suggestions: string[] = [];

  if (customAgentConfig) {
      config = { name: customAgentConfig.name, role: customAgentConfig.role };
      suggestions = customAgentConfig.initialSuggestions || [];
  } else if (persona) {
      config = personaConfig[persona];
      suggestions = quickSuggestions[persona];
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Clean Backdrop */}
        <div 
            className="absolute inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className={`
            relative bg-white shadow-2xl overflow-hidden flex flex-col animate-scale-up ring-1 ring-black/5 transition-all duration-300
            ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-2xl max-h-[85vh] rounded-2xl'}
        `}>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <ChatIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-none">{config.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{config.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <IconButton
                        variant="ghost"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        ariaLabel={isFullscreen ? "Restaurar" : "Tela Cheia"}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        icon={isFullscreen ? <MinimizeIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
                    />
                    <IconButton
                        variant="ghost"
                        onClick={onClose}
                        ariaLabel="Fechar"
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        icon={<XIcon className="w-5 h-5" />}
                    />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 transform rotate-3">
                            <SparklesIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{config.name}</h4>
                        <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
                            Estou pronto para ajudar. Cole imagens (Ctrl+V) ou anexe documentos para contexto.
                        </p>
                        
                        {suggestions.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
                                {suggestions.map((sug, i) => (
                                    <Button
                                        key={i}
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onSendMessage(sug)}
                                        className="rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                                    >
                                        {sug}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 pb-2">
                        {messages.map(msg => (
                            <ChatBubble 
                                key={msg.id} 
                                message={msg} 
                                onAction={onAction} 
                                isActionLoading={isActionLoading}
                                onSave={onSaveMessage}
                            />
                        ))}
                    </div>
                )}
                 
                 {isLoading && (
                    <div className="flex items-center gap-2 ml-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Attachment Preview Bar */}
            {(attachedDoc || pastedImage) && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto">
                    {attachedDoc && (
                         <div className="flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-3 py-1 rounded-lg text-xs shadow-sm">
                            <span className="font-bold">DOC:</span> {attachedDoc.title}
                            <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setAttachedDoc(null)}
                                ariaLabel="Remover anexo"
                                className="h-4 w-4 p-0 hover:text-purple-900 text-purple-700"
                                icon={<XIcon className="w-3 h-3"/>}
                            />
                         </div>
                    )}
                    {pastedImage && (
                        <div className="relative group h-12 w-12 rounded-lg border border-gray-200 overflow-hidden bg-white">
                            <img src={pastedImage} alt="Paste" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                <IconButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPastedImage(null)}
                                    ariaLabel="Remover imagem"
                                    className="text-white hover:text-white hover:bg-white/20"
                                    icon={<XIcon className="w-4 h-4" />}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <div className="relative flex items-center gap-2">
                    <IconButton
                        type="button"
                        onClick={() => setIsDocModalOpen(true)}
                        ariaLabel="Anexar Documento"
                        variant="ghost"
                        className="p-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-primary border border-transparent hover:border-gray-200 h-auto w-auto"
                        icon={<ClipIcon className="w-5 h-5" />}
                    />

                    <form onSubmit={handleSubmit} className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 focus:bg-white transition-all text-sm text-gray-800 placeholder-gray-400"
                            placeholder="Digite sua mensagem..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPaste={handlePaste}
                            disabled={isLoading}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <IconButton
                                type="submit"
                                disabled={(!inputValue.trim() && !pastedImage) || isLoading}
                                ariaLabel="Enviar"
                                variant="primary"
                                size="sm"
                                className="bg-gray-900 hover:bg-black text-white shadow-sm"
                                icon={<SendIcon className="w-4 h-4" />}
                            />
                        </div>
                    </form>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px] text-gray-400">Pressione <strong>Enter</strong> para enviar • <strong>Ctrl+V</strong> para colar imagem</span>
                </div>
            </div>
        </div>

        {/* Document Selector Modal */}
        <DocumentSelectorModal 
            isOpen={isDocModalOpen} 
            onClose={() => setIsDocModalOpen(false)} 
            onSelect={setAttachedDoc} 
            userId={appContext?.user?.id || ''}
        />
    </div>
  );
};
