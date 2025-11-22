
import React from 'react';
import { IconButton } from './IconButton';
import { XIcon } from './icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Title is optional now as some modals have custom headers
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-auto py-4" onClick={onClose}>
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[maxWidth]} mx-4 transform transition-all flex flex-col max-h-[90vh]`} 
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <IconButton 
              icon={<XIcon />} 
              ariaLabel="Fechar" 
              onClick={onClose} 
              variant="ghost"
              className="text-gray-400 hover:text-gray-600"
            />
          </div>
        )}
        <div className="overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};
