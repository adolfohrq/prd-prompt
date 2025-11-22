import type { PRD, PromptDocument } from '../../../types';

// ============================================================================
// ENUMS E TIPOS
// ============================================================================

export type ViewMode = 'grid' | 'list';
export type SortBy = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'status';
export type FilterStatus = 'all' | 'draft' | 'completed';
export type DocumentType = 'all' | 'prd' | 'prompt';

// ============================================================================
// INTERFACES DOS COMPONENTES
// ============================================================================

export interface StatsOverviewProps {
  totalPrds: number;
  totalPrompts: number;
  draftPrds: number;
  recentCount: number;
}

export interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortByChange: (sort: SortBy) => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
}

export interface DocumentCardProps {
  document: PRD | PromptDocument;
  type: 'prd' | 'prompt';
  onView: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  viewMode: ViewMode;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onDeselectAll: () => void;
  onExportSelected: () => void;
}

export interface EmptyStateEnhancedProps {
  type: 'prd' | 'prompt';
  hasFilters: boolean;
  onClearFilters?: () => void;
  onCreateNew: () => void;
}
