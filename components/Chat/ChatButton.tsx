import React from 'react';
import { ChatIcon } from '../icons/Icons';

interface ChatButtonProps {
  onClick: () => void;
  label?: string;
  color?: string;
  variant?: 'fab' | 'icon';
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, label = "Falar com Especialista", color = "bg-primary", variant = 'fab' }) => {
  
  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        title={label}
        className={`flex items-center justify-center p-2 rounded-lg text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-sm ${color}`}
      >
        <ChatIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white transition-transform hover:scale-105 active:scale-95 animate-bounce-in ${color}`}
    >
      <ChatIcon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
};