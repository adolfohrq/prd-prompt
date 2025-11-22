
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { db } from '../services/databaseService';
import type { PRD } from '../../types';
import { FileTextIcon, SearchIcon } from './icons/Icons';
import { Button } from './Button';

interface DocumentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prd: PRD) => void;
  userId: string;
}

export const DocumentSelectorModal: React.FC<DocumentSelectorModalProps> = ({ isOpen, onClose, onSelect, userId }) => {
  const [prds, setPrds] = useState<PRD[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
      if (isOpen && userId) {
          setLoading(true);
          db.getPrds(userId).then(data => {
              setPrds(data);
              setLoading(false);
          });
      }
  }, [isOpen, userId]);

  const filtered = prds.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Anexar Documento">
        <div className="space-y-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Buscar PRD..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
                />
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-lg">
                {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Nenhum documento encontrado.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map(prd => (
                            <Button
                                key={prd.id}
                                variant="ghost"
                                onClick={() => { onSelect(prd); onClose(); }}
                                className="w-full justify-start gap-3 p-3 hover:bg-gray-50 h-auto rounded-none"
                            >
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 shrink-0">
                                    <FileTextIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-800">{prd.title}</p>
                                    <p className="text-xs text-gray-500 font-normal">{prd.industry} • {new Date(prd.createdAt).toLocaleDateString()}</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </Modal>
  );
};