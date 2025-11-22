import React from 'react';
import { Button } from '../../Button';
import { IconButton } from '../../IconButton';
import { TrashIcon, DownloadIcon, XIcon } from '../../icons/Icons';
import type { BulkActionsBarProps } from './types';

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onDeleteSelected,
  onDeselectAll,
  onExportSelected,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-600 text-white shadow-xl z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            {selectedCount} documento{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onDeselectAll}
            className="text-sm text-primary-100 hover:text-white transition-colors"
          >
            Desselecionar tudo
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onExportSelected}
            className="text-primary-600"
          >
            <DownloadIcon className="w-4 h-4 mr-1" />
            Exportar ({selectedCount})
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onDeleteSelected}
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Deletar ({selectedCount})
          </Button>
        </div>
      </div>
    </div>
  );
};
