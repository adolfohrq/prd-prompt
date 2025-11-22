import React from 'react';
import { Modal } from '../../Modal';
import { CheckCircleIcon, XIcon } from '../../icons/Icons';
import type { TurboProgressModalProps } from '../types';

export const TurboProgressModal: React.FC<TurboProgressModalProps> = ({
  isOpen,
  tasks
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Gerando PRD Completo">
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">A IA está trabalhando em paralelo para gerar todas as seções do seu documento. Por favor, aguarde.</p>

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                {task.status === 'loading' && (
                  <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {task.status === 'success' && (
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                  </div>
                )}
                {task.status === 'error' && (
                  <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                    <XIcon className="w-3 h-3 text-red-600" />
                  </div>
                )}
                {task.status === 'idle' && (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-200"></div>
                )}
                <span className={`text-sm ${task.status === 'success' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {task.label}
                </span>
              </div>
              {task.status === 'loading' && <span className="text-xs text-primary font-medium animate-pulse">Gerando...</span>}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
