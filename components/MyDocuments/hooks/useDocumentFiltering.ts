import { useMemo } from 'react';
import type { PRD, PromptDocument } from '../../../types';
import type { SortBy, FilterStatus, DocumentType } from '../components/types';

interface UseDocumentFilteringProps {
  prds: PRD[];
  prompts: PromptDocument[];
  searchQuery: string;
  filterStatus: FilterStatus;
  documentType: DocumentType;
  sortBy: SortBy;
}

interface FilteredDocuments {
  filteredPrds: PRD[];
  filteredPrompts: PromptDocument[];
  totalResults: number;
}

export const useDocumentFiltering = ({
  prds,
  prompts,
  searchQuery,
  filterStatus,
  documentType,
  sortBy,
}: UseDocumentFilteringProps): FilteredDocuments => {
  return useMemo(() => {
    // =========================================================================
    // FILTRO 1: Por tipo de documento (PRD vs Prompt)
    // =========================================================================
    let workingPrds = documentType === 'all' || documentType === 'prd' ? prds : [];
    let workingPrompts =
      documentType === 'all' || documentType === 'prompt' ? prompts : [];

    // =========================================================================
    // FILTRO 2: Por status (apenas PRDs)
    // =========================================================================
    if (filterStatus !== 'all') {
      workingPrds = workingPrds.filter(
        (prd) => prd.status === filterStatus
      );
    }

    // =========================================================================
    // FILTRO 3: Por busca textual
    // =========================================================================
    const searchLower = searchQuery.toLowerCase().trim();
    if (searchLower) {
      workingPrds = workingPrds.filter(
        (prd) =>
          prd.title.toLowerCase().includes(searchLower) ||
          prd.ideaDescription.toLowerCase().includes(searchLower) ||
          prd.id.toLowerCase().includes(searchLower)
      );

      workingPrompts = workingPrompts.filter(
        (prompt) =>
          prompt.prdTitle.toLowerCase().includes(searchLower) ||
          prompt.id.toLowerCase().includes(searchLower) ||
          prompt.type.toLowerCase().includes(searchLower)
      );
    }

    // =========================================================================
    // ORDENAÇÃO
    // =========================================================================
    const sortFunction = (a: any, b: any) => {
      switch (sortBy) {
        case 'date-desc':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        case 'date-asc':
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );
        case 'name-asc':
          return (a.title || a.prdTitle).localeCompare(
            b.title || b.prdTitle
          );
        case 'name-desc':
          return (b.title || b.prdTitle).localeCompare(
            a.title || a.prdTitle
          );
        case 'status':
          // PRDs com rascunho vêm primeiro
          if (a.status && b.status) {
            if (a.status === 'draft' && b.status !== 'draft') return -1;
            if (a.status !== 'draft' && b.status === 'draft') return 1;
          }
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    };

    workingPrds.sort(sortFunction);
    workingPrompts.sort(sortFunction);

    return {
      filteredPrds: workingPrds,
      filteredPrompts: workingPrompts,
      totalResults: workingPrds.length + workingPrompts.length,
    };
  }, [prds, prompts, searchQuery, filterStatus, documentType, sortBy]);
};
