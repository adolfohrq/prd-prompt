import React from 'react';
import { Card } from '../../Card';
import { Badge } from '../../Badge';
import { Button } from '../../Button';
import { IconButton } from '../../IconButton';
import {
  TrashIcon,
  EyeIcon,
  EditIcon,
  CopyIcon,
  DownloadIcon,
  StarIcon,
} from '../../icons/Icons';
import type { DocumentCardProps } from './types';
import type { PRD, PromptDocument } from '../../../types';

const isPRD = (doc: PRD | PromptDocument): doc is PRD => {
  return 'ideaDescription' in doc;
};

const isPrompt = (doc: PRD | PromptDocument): doc is PromptDocument => {
  return 'prdTitle' in doc && 'type' in doc;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  type,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  isSelected,
  onSelect,
  viewMode,
}) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  };

  const daysAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
  };

  if (viewMode === 'list') {
    // Visualização em Lista Compacta
    return (
      <div className="flex items-center gap-4 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 rounded border-secondary-300"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-secondary-900 truncate">
              {isPRD(document) ? document.title : `Prompt: ${document.prdTitle}`}
            </h3>
            {isPRD(document) && document.status === 'draft' && (
              <Badge variant="warning" size="sm" rounded="sm">
                Rascunho
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-secondary-500">
            <span>{formatDate(document.createdAt)}</span>
            <span>•</span>
            <span className="text-xs">{daysAgo(document.createdAt)}</span>
            {isPrompt(document) && (
              <>
                <span>•</span>
                <span className="text-xs font-medium text-primary-600">{document.type}</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <IconButton variant="secondary" size="sm" onClick={onView} title="Visualizar">
            <EyeIcon className="w-4 h-4" />
          </IconButton>
          {onEdit && (
            <IconButton variant="secondary" size="sm" onClick={onEdit} title="Editar">
              <EditIcon className="w-4 h-4" />
            </IconButton>
          )}
          {onDuplicate && (
            <IconButton variant="secondary" size="sm" onClick={onDuplicate} title="Duplicar">
              <CopyIcon className="w-4 h-4" />
            </IconButton>
          )}
          <IconButton variant="danger" size="sm" onClick={onDelete} title="Deletar">
            <TrashIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    );
  }

  // Visualização em Grid
  return (
    <div className="relative">
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={(e) => onSelect(e.target.checked)}
          className="absolute top-3 left-3 w-4 h-4 rounded border-secondary-300 z-10"
        />
      )}

      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-secondary-900 flex-1 pr-2">
              {isPRD(document) ? document.title : `Prompt: ${document.prdTitle}`}
            </h3>
            {isPRD(document) && document.status === 'draft' && (
              <Badge variant="warning" size="sm" rounded="full">
                Rascunho
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2 mb-3">
            <p className="text-xs text-secondary-500">
              Criado em: {formatDate(document.createdAt)}
            </p>
            {isPRD(document) && (
              <p className="text-sm text-secondary-700 line-clamp-2">
                {document.ideaDescription}
              </p>
            )}
            {isPrompt(document) && (
              <div className="flex gap-2">
                <Badge variant="primary" size="sm" rounded="sm">
                  {document.type}
                </Badge>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="text-xs text-secondary-500 mt-2 pt-2 border-t border-secondary-200">
            {isPRD(document) ? (
              <span>📊 {document.sections?.length || 0} seções</span>
            ) : (
              <span>⚡ Prompt de IA</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-secondary-200 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={isPRD(document) && document.status === 'draft' ? 'primary' : 'secondary'}
            onClick={onView}
            className="flex-1"
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            {isPRD(document) && document.status === 'draft' ? 'Editar' : 'Ver'}
          </Button>
          <IconButton
            variant="danger"
            size="sm"
            onClick={onDelete}
            title="Deletar documento"
          >
            <TrashIcon className="w-4 h-4" />
          </IconButton>
          {onDuplicate && (
            <IconButton
              variant="secondary"
              size="sm"
              onClick={onDuplicate}
              title="Duplicar documento"
            >
              <CopyIcon className="w-4 h-4" />
            </IconButton>
          )}
        </div>
      </Card>
    </div>
  );
};
