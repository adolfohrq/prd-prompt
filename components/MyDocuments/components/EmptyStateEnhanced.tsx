import React from 'react';
import { Button } from '../../Button';
import { EmptyState } from '../../EmptyState';
import { GeneratePrdIcon, GeneratePromptIcon } from '../../icons/Icons';
import type { EmptyStateEnhancedProps } from './types';

export const EmptyStateEnhanced: React.FC<EmptyStateEnhancedProps> = ({
  type,
  hasFilters,
  onClearFilters,
  onCreateNew,
}) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          Nenhum documento encontrado
        </h3>
        <p className="text-secondary-600 mb-6">
          Nenhum documento corresponde aos filtros selecionados.
        </p>
        <Button variant="secondary" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <EmptyState
      icon={type === 'prd' ? (
        <GeneratePrdIcon className="w-8 h-8" />
      ) : (
        <GeneratePromptIcon className="w-8 h-8" />
      )}
      title={
        type === 'prd'
          ? 'Nenhum PRD criado ainda'
          : 'Nenhum prompt gerado ainda'
      }
      description={
        type === 'prd'
          ? 'Comece criando seu primeiro documento de requisitos e transforme suas ideias em produtos digitais.'
          : 'Gere prompts otimizados a partir dos seus PRDs para usar em ferramentas como ChatGPT e Claude.'
      }
      size="md"
    />
  );
};
