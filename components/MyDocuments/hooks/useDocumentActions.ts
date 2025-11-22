import { useState, useCallback } from 'react';
import type { PRD, PromptDocument } from '../../../types';

interface UseDocumentActionsProps {
  onDeletePrd: (id: string) => void;
  onDeletePrompt: (id: string) => void;
}

interface UseDocumentActionsReturn {
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  deselectAll: () => void;
  deleteSelected: (documents: (PRD | PromptDocument)[]) => void;
  exportSelected: (documents: (PRD | PromptDocument)[]) => void;
}

export const useDocumentActions = ({
  onDeletePrd,
  onDeletePrompt,
}: UseDocumentActionsProps): UseDocumentActionsReturn => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const deleteSelected = useCallback(
    (documents: (PRD | PromptDocument)[]) => {
      documents.forEach((doc) => {
        if ('ideaDescription' in doc) {
          onDeletePrd(doc.id);
        } else {
          onDeletePrompt(doc.id);
        }
      });
      setSelectedIds(new Set());
    },
    [onDeletePrd, onDeletePrompt]
  );

  const exportSelected = useCallback(
    (documents: (PRD | PromptDocument)[]) => {
      const selectedDocs = documents.filter((doc) => selectedIds.has(doc.id));
      const dataStr = JSON.stringify(selectedDocs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `documents-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    [selectedIds]
  );

  return {
    selectedIds,
    toggleSelect,
    deselectAll,
    deleteSelected,
    exportSelected,
  };
};
