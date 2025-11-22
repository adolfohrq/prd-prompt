
import React, { useState } from 'react';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { SparklesIcon, SaveIcon, CheckCircleIcon } from '../icons/Icons';
import type { ChatMessage } from '../../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  onAction?: () => void;
  isActionLoading?: boolean;
  onSave?: (text: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onAction, isActionLoading, onSave }) => {
  const isUser = message.role === 'user';
  const [saved, setSaved] = useState(false);
  
  // Check for the action tag
  const hasAction = message.text.includes('{{REGENERATE_ACTION}}');
  // Remove the tag for display
  const displayText = message.text.replace('{{REGENERATE_ACTION}}', '').trim();

  const handleSave = () => {
      if (onSave) {
          onSave(displayText);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
      }
  };

  return (
    <div className={`flex w-full flex-col group ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Bubble Content */}
        <div className={`
            px-5 py-3.5 text-sm leading-relaxed shadow-sm transition-all relative
            ${isUser 
                ? 'bg-gray-900 text-white rounded-2xl rounded-br-sm' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm'}
        `}>
            {isUser ? (
                <p className="whitespace-pre-wrap font-medium">{displayText}</p>
            ) : (
                <div className="markdown-body">
                     <MarkdownRenderer content={displayText} className="text-gray-700" />
                </div>
            )}
        </div>
        
        {/* Footer: Timestamp & Actions */}
        <div className={`flex items-center gap-2 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity select-none ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-gray-300">
                {message.role === 'user' ? 'Você' : 'IA'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {/* Save Button (Only for AI) */}
            {!isUser && onSave && (
                <button 
                    onClick={handleSave} 
                    className={`ml-2 p-1 rounded hover:bg-gray-100 transition-colors ${saved ? 'text-green-600' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Salvar como Nota"
                >
                    {saved ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <SaveIcon className="w-3.5 h-3.5" />}
                </button>
            )}
        </div>

      </div>

      {/* Action Widget (Only for AI messages with tag) */}
      {!isUser && hasAction && onAction && (
          <div className="mt-3 ml-1 max-w-[85%] animate-fade-in-up">
              <div className="bg-white p-1 pr-2 rounded-xl border border-purple-100 shadow-md flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 bg-purple-50 flex items-center justify-center rounded-lg shrink-0">
                      <SparklesIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800">Alteração Sugerida</p>
                      <p className="text-[10px] text-gray-500 truncate">Atualizar o documento com base na conversa?</p>
                  </div>
                  <button 
                    onClick={onAction}
                    disabled={isActionLoading}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                      {isActionLoading ? 'Aplicando...' : 'Aplicar'}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
