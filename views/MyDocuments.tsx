
import React, { useState } from 'react';
import type { PRD, PromptDocument } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { TrashIcon, EyeIcon, EditIcon, GeneratePrdIcon, GeneratePromptIcon } from '../components/icons/Icons';

interface MyDocumentsProps {
  prds: PRD[];
  prompts: PromptDocument[];
  onDeletePrd: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  onViewDocument: (doc: PRD | PromptDocument) => void;
  onEditPrd: (prd: PRD) => void;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({ prds, prompts, onDeletePrd, onDeletePrompt, onViewDocument, onEditPrd }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'prd' | 'prompt' } | null>(null);

  const openDeleteModal = (id: string, type: 'prd' | 'prompt') => {
    setItemToDelete({ id, type });
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'prd') {
        onDeletePrd(itemToDelete.id);
      } else {
        onDeletePrompt(itemToDelete.id);
      }
    }
    setModalOpen(false);
    setItemToDelete(null);
  };
  
  const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR').format(date);

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-900 mb-6">Meus Documentos</h1>
      
      <section>
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Documentos de Requisitos (PRDs)</h2>
        {prds.length === 0 ? (
          <EmptyState
            icon={<GeneratePrdIcon className="w-8 h-8" />}
            title="Nenhum PRD criado ainda"
            description="Comece criando seu primeiro documento de requisitos e transforme suas ideias em produtos digitais."
            size="md"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prds.map(prd => (
              <Card key={prd.id} className="flex flex-col">
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{prd.title}</h3>
                    {prd.status === 'draft' && (
                      <Badge variant="warning" size="sm" rounded="full">Rascunho</Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary-500 mt-1">Criado em: {formatDate(prd.createdAt)}</p>
                  <p className="text-sm text-secondary-700 mt-2 line-clamp-3">{prd.ideaDescription}</p>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                   {prd.status === 'draft' ? (
                      <Button size="sm" variant="primary" onClick={() => onEditPrd(prd)}><EditIcon className="w-4 h-4 mr-1"/> Continuar Editando</Button>
                   ) : (
                      <Button size="sm" variant="secondary" onClick={() => onViewDocument(prd)}><EyeIcon className="w-4 h-4 mr-1"/> Visualizar</Button>
                   )}
                   <Button size="sm" variant="danger" onClick={() => openDeleteModal(prd.id, 'prd')}><TrashIcon className="w-4 h-4"/></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Prompts de IA</h2>
         {prompts.length === 0 ? (
          <EmptyState
            icon={<GeneratePromptIcon className="w-8 h-8" />}
            title="Nenhum prompt gerado ainda"
            description="Gere prompts otimizados a partir dos seus PRDs para usar em ferramentas como ChatGPT e Claude."
            size="md"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map(prompt => (
              <Card key={prompt.id} className="flex flex-col">
                 <div className="flex-grow">
                    <h3 className="font-bold text-lg">Prompt para: {prompt.prdTitle}</h3>
                    <p className="text-sm text-secondary-500 mt-1">Gerado em: {formatDate(prompt.createdAt)}</p>
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full mt-2">{prompt.type}</span>
                 </div>
                 <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                   <Button size="sm" variant="secondary" onClick={() => onViewDocument(prompt)}><EyeIcon className="w-4 h-4 mr-1"/> Visualizar</Button>
                   <Button size="sm" variant="danger" onClick={() => openDeleteModal(prompt.id, 'prompt')}><TrashIcon className="w-4 h-4"/></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar Exclusão">
        <p>Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</p>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
