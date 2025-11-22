
import React from 'react';
import type { SpecialistAgent } from '../../types';
import { ChatIcon, EyeIcon, StarIcon, ArrowRightIcon } from './icons/Icons';
import { Button } from './Button';

interface AgentCardProps {
  agent: SpecialistAgent;
  onChat: (agent: SpecialistAgent) => void;
  onDetails: (agent: SpecialistAgent) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

// Configuração visual avançada por categoria
const getTheme = (category: string) => {
  switch (category) {
    case 'Marketing':
      return {
        bg: 'bg-pink-50',
        iconBg: 'bg-gradient-to-br from-pink-100 to-rose-200',
        text: 'text-pink-700',
        border: 'border-pink-100',
        hoverBorder: 'group-hover:border-pink-300',
        badge: 'bg-pink-100 text-pink-800',
        button: 'bg-pink-600 hover:bg-pink-700',
        shadow: 'shadow-pink-100'
      };
    case 'Dev':
      return {
        bg: 'bg-blue-50',
        iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-200',
        text: 'text-blue-700',
        border: 'border-blue-100',
        hoverBorder: 'group-hover:border-blue-300',
        badge: 'bg-blue-100 text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700',
        shadow: 'shadow-blue-100'
      };
    case 'Design':
      return {
        bg: 'bg-purple-50',
        iconBg: 'bg-gradient-to-br from-purple-100 to-fuchsia-200',
        text: 'text-purple-700',
        border: 'border-purple-100',
        hoverBorder: 'group-hover:border-purple-300',
        badge: 'bg-purple-100 text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700',
        shadow: 'shadow-purple-100'
      };
    case 'Data':
      return {
        bg: 'bg-emerald-50',
        iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-200',
        text: 'text-emerald-700',
        border: 'border-emerald-100',
        hoverBorder: 'group-hover:border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-800',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        shadow: 'shadow-emerald-100'
      };
    case 'Product':
      return {
        bg: 'bg-amber-50',
        iconBg: 'bg-gradient-to-br from-amber-100 to-orange-200',
        text: 'text-amber-700',
        border: 'border-amber-100',
        hoverBorder: 'group-hover:border-amber-300',
        badge: 'bg-amber-100 text-amber-800',
        button: 'bg-amber-600 hover:bg-amber-700',
        shadow: 'shadow-amber-100'
      };
    default: // Content & Others
      return {
        bg: 'bg-gray-50',
        iconBg: 'bg-gradient-to-br from-gray-100 to-gray-200',
        text: 'text-gray-700',
        border: 'border-gray-100',
        hoverBorder: 'group-hover:border-gray-300',
        badge: 'bg-gray-100 text-gray-800',
        button: 'bg-gray-800 hover:bg-gray-900',
        shadow: 'shadow-gray-100'
      };
  }
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onChat, onDetails, isFavorite = false, onToggleFavorite }) => {
  const theme = getTheme(agent.category);

  return (
    <div 
        className={`
            group relative flex flex-col h-full bg-white rounded-2xl 
            border ${theme.border} ${theme.hoverBorder}
            transition-all duration-300 ease-out
            hover:shadow-xl hover:-translate-y-1 hover:shadow-gray-200/50
        `}
    >
      {/* Top Decoration Gradient */}
      <div className={`absolute top-0 inset-x-0 h-1.5 rounded-t-2xl ${theme.button} opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-5">
             {/* Icon Container */}
             <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm
                ${theme.iconBg} text-gray-900 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
             `}>
                {agent.category === 'Marketing' && '🚀'}
                {agent.category === 'Dev' && '💻'}
                {agent.category === 'Design' && '🎨'}
                {agent.category === 'Data' && '📊'}
                {agent.category === 'Product' && '💡'}
                {agent.category === 'Content' && '📝'}
             </div>

             {/* Actions Top Right */}
             <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${theme.badge}`}>
                    {agent.category}
                </span>
                {onToggleFavorite && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(agent.id); }}
                        className={`
                            w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200
                            ${isFavorite 
                                ? 'bg-yellow-50 text-yellow-400 hover:bg-yellow-100' 
                                : 'bg-transparent text-gray-300 hover:bg-gray-50 hover:text-gray-400'}
                        `}
                        title={isFavorite ? "Remover Favorito" : "Favoritar"}
                    >
                        <StarIcon filled={isFavorite} className="w-5 h-5" />
                    </button>
                )}
             </div>
        </div>
        
        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">{agent.name}</h3>
            <p className={`text-sm font-medium ${theme.text}`}>{agent.role}</p>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-grow">
            {agent.shortDescription}
        </p>

        {/* Divider with fade */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4 opacity-50" />

        <div className="flex items-center gap-3">
            <Button 
                variant="ghost"
                size="sm"
                onClick={() => onDetails(agent)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            >
                <EyeIcon className="w-4 h-4 mr-2" />
                Detalhes
            </Button>
            
            <Button 
                variant="primary"
                size="sm"
                onClick={() => onChat(agent)}
                className="flex-1 shadow-md group-hover:shadow-lg"
            >
                Conversar
                <ArrowRightIcon className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
      </div>
    </div>
  );
};
