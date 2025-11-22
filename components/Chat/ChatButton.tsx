import React from 'react';
import { ChatIcon } from '../icons/Icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

interface ChatButtonProps {
  onClick: () => void;
  label?: string;
  color?: string;
  variant?: 'fab' | 'icon';
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, label = "Falar com Especialista", color = "bg-primary", variant = 'fab' }) => {
  
  if (variant === 'icon') {
    return (
      <IconButton
        onClick={onClick}
        ariaLabel={label}
        className={`p-2 text-white hover:opacity-90 hover:scale-105 active:scale-95 shadow-sm ${color}`}
        icon={<ChatIcon className="w-5 h-5" />}
        variant="ghost" // Using ghost but styling with color prop to maintain flexibility
      />
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