
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { WandIcon } from './icons/Icons';

interface MagicMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const MagicMatchModal: React.FC<MagicMatchModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      await onSubmit(input);
      setInput('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Magic Match">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3">
                <WandIcon className="w-6 h-6 text-purple-600 shrink-0 mt-1" />
                <p className="text-sm text-purple-900">
                    Não sabe qual agente escolher? Descreva sua tarefa e a IA irá te conectar ao especialista ideal.
                </p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">O que você precisa fazer?</label>
                <textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ex: Preciso melhorar o SEO do meu blog..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none h-32 resize-none text-sm"
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
                    <WandIcon className="w-4 h-4 mr-2" />
                    Encontrar Especialista
                </Button>
            </div>
        </form>
    </Modal>
  );
};