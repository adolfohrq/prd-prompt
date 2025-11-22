
import React, { useState } from 'react';
import { Modal } from './Modal';
import type { SpecialistAgent } from '../../types';
import { CheckIcon, XIcon, ChatIcon, CodeIcon, CopyIcon, RobotIcon, ChevronDownIcon, ChevronUpIcon } from './icons/Icons';
import { Button } from './Button';

interface AgentDetailsModalProps {
  agent: SpecialistAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onChat: (agent: SpecialistAgent) => void;
}

const categoryStyles: Record<string, { bg: string, text: string, border: string, gradient: string }> = {
    Marketing: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', gradient: 'from-pink-500 to-rose-500' },
    Dev: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500' },
    Design: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-indigo-500' },
    Data: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-500' },
    Product: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500' },
    Content: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', gradient: 'from-indigo-500 to-violet-500' },
};

export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ agent, isOpen, onClose, onChat }) => {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!agent) return null;

  const styles = categoryStyles[agent.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', gradient: 'from-gray-600 to-gray-800' };

  const handleCopyPrompt = () => {
      navigator.clipboard.writeText(agent.systemInstruction);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isOpen && 'hidden'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden animate-scale-up flex flex-col">
            
            {/* Header Temático */}
            <div className={`relative p-6 bg-gradient-to-r ${styles.gradient} text-white overflow-hidden shrink-0`}>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20 transform rotate-12">
                     <RobotIcon className="w-32 h-32" />
                </div>
                
                <div className="relative z-10 flex items-start gap-4">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
                        {agent.category === 'Marketing' && '🚀'}
                        {agent.category === 'Dev' && '💻'}
                        {agent.category === 'Design' && '🎨'}
                        {agent.category === 'Data' && '📊'}
                        {agent.category === 'Product' && '💡'}
                        {agent.category === 'Content' && '📝'}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold">{agent.name}</h2>
                            <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-xs font-medium border border-white/30">
                                {agent.category}
                            </span>
                        </div>
                        <p className="text-white/90 font-medium">{agent.role}</p>
                     </div>
                     <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                         <XIcon className="w-6 h-6" />
                     </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-8">
                
                {/* Descrição Curta */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        "{agent.shortDescription}"
                    </p>
                </div>

                {/* Grid Do's and Dont's */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckIcon className="w-3 h-3" /></div>
                            Especialidades
                        </h4>
                        <ul className="space-y-3">
                            {agent.fullDescription.whatIDo.map((item, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-green-500 mt-0.5 font-bold text-lg leading-none">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <div className="p-1 bg-red-100 rounded-full text-red-600"><XIcon className="w-3 h-3" /></div>
                             Limitações
                        </h4>
                        <ul className="space-y-3">
                            {agent.fullDescription.whatIDontDo.map((item, i) => (
                                <li key={i} className="text-sm text-gray-500 flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100/50">
                                    <span className="text-red-300 mt-0.5 font-bold text-lg leading-none">×</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* How I Work (Process) */}
                <div>
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Fluxo de Trabalho
                     </h4>
                     <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                        
                        <div className="space-y-4">
                             {agent.fullDescription.howIWork.map((item, i) => (
                                <div key={i} className="relative flex items-center gap-4">
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 bg-white
                                        ${i === 0 ? 'border-primary text-primary' : 'border-gray-300 text-gray-500'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="text-sm text-gray-700 font-medium bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm w-full">
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* System Prompt (Collapsible) */}
                <div className="border-t border-gray-100 pt-4">
                    <button 
                        onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                        className="flex items-center justify-between w-full text-left text-gray-500 hover:text-gray-800 transition-colors group"
                    >
                        <div className="flex items-center gap-2">
                            <CodeIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wide">Ver Prompt de Sistema</span>
                        </div>
                        {showSystemPrompt ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                    </button>

                    {showSystemPrompt && (
                        <div className="mt-3 relative group/code animate-fade-in">
                            <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap border border-gray-800 shadow-inner max-h-48 overflow-y-auto">
                                {agent.systemInstruction}
                            </pre>
                            <button 
                                onClick={handleCopyPrompt}
                                className="absolute top-2 right-2 p-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors opacity-0 group-hover/code:opacity-100"
                                title="Copiar Prompt"
                            >
                                {copied ? <CheckIcon className="w-3 h-3 text-green-400" /> : <CopyIcon className="w-3 h-3" />}
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-2xl">
                <Button variant="secondary" onClick={onClose}>Fechar</Button>
                <Button 
                    onClick={() => { onClose(); onChat(agent); }} 
                    className={`flex items-center gap-2 bg-gradient-to-r ${styles.gradient} text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
                >
                    <ChatIcon className="w-4 h-4" />
                    Iniciar Conversa com {agent.name.split(' ')[0]}
                </Button>
            </div>
        </div>
    </div>
  );
};
