import React from 'react';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { IconButton } from '../../IconButton';
import { GridIcon, ListIcon } from '../../icons/Icons';
import type { SearchAndFiltersProps } from './types';

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  filterStatus,
  onFilterStatusChange,
  documentType,
  onDocumentTypeChange,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Barra de Busca Principal */}
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Buscar documentos por nome, ID ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Botões de Visualização */}
        <div className="flex gap-2 flex-shrink-0">
          <IconButton
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            onClick={() => onViewModeChange('grid')}
            title="Visualização em grid"
          >
            <GridIcon className="w-4 h-4" />
          </IconButton>
          <IconButton
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => onViewModeChange('list')}
            title="Visualização em lista"
          >
            <ListIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      {/* Filtros e Ordenação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          label="Tipo"
          value={documentType}
          onChange={(e) => onDocumentTypeChange(e.target.value as any)}
          options={[
            { value: 'all', label: 'Todos os tipos' },
            { value: 'prd', label: 'PRDs' },
            { value: 'prompt', label: 'Prompts' },
          ]}
        />

        <Select
          label="Status"
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value as any)}
          options={[
            { value: 'all', label: 'Todos os status' },
            { value: 'draft', label: 'Rascunhos' },
            { value: 'completed', label: 'Concluídos' },
          ]}
        />

        <Select
          label="Ordenar por"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as any)}
          options={[
            { value: 'date-desc', label: 'Mais recentes' },
            { value: 'date-asc', label: 'Mais antigos' },
            { value: 'name-asc', label: 'Nome (A-Z)' },
            { value: 'name-desc', label: 'Nome (Z-A)' },
            { value: 'status', label: 'Por status' },
          ]}
        />

        <div className="flex items-end">
          <button
            onClick={() => {
              onSearchChange('');
              onDocumentTypeChange('all');
              onFilterStatusChange('all');
              onSortByChange('date-desc');
            }}
            className="w-full px-3 py-2 text-sm font-medium text-secondary-600 bg-secondary-50 rounded-md hover:bg-secondary-100 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
};
