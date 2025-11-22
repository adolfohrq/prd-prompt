
import React, { useState } from 'react';
import type { PRD, PromptDocument } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { designSystem } from '../designSystem';
import {
  StatsOverview,
  SearchAndFilters,
  DocumentCard,
  BulkActionsBar,
  EmptyStateEnhanced,
} from '../components/MyDocuments/components';
import { useDocumentFiltering, useDocumentActions } from '../components/MyDocuments/hooks';
import type {
  ViewMode,
  SortBy,
  FilterStatus,
  DocumentType,
} from '../components/MyDocuments/components/types';

interface MyDocumentsProps {
  prds: PRD[];
  prompts: PromptDocument[];
  onDeletePrd: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  onViewDocument: (doc: PRD | PromptDocument) => void;
  onEditPrd: (prd: PRD) => void;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({
  prds,
  prompts,
  onDeletePrd,
  onDeletePrompt,
  onViewDocument,
  onEditPrd,
}) => {
  // =========================================================================
  // ESTADO DA VIEW
  // =========================================================================
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date-desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [documentType, setDocumentType] = useState<DocumentType>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'prd' | 'prompt';
  } | null>(null);

  // =========================================================================
  // CUSTOM HOOKS
  // =========================================================================
  const { filteredPrds, filteredPrompts, totalResults } = useDocumentFiltering({
    prds,
    prompts,
    searchQuery,
    filterStatus,
    documentType,
    sortBy,
  });

  const {
    selectedIds,
    toggleSelect,
    deselectAll,
    deleteSelected,
    exportSelected,
  } = useDocumentActions({
    onDeletePrd,
    onDeletePrompt,
  });

  // =========================================================================
  // HANDLERS
  // =========================================================================
  const handleDeleteDocument = (id: string, type: 'prd' | 'prompt') => {
    setItemToDelete({ id, type });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'prd') {
        onDeletePrd(itemToDelete.id);
      } else {
        onDeletePrompt(itemToDelete.id);
      }
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setDocumentType('all');
    setSortBy('date-desc');
  };

  const handleBulkDelete = () => {
    const docsToDelete = [
      ...filteredPrds.filter((doc) => selectedIds.has(doc.id)),
      ...filteredPrompts.filter((doc) => selectedIds.has(doc.id)),
    ];

    if (docsToDelete.length > 0) {
      deleteSelected(docsToDelete);
      deselectAll();
      setDeleteModalOpen(false);
    }
  };

  const handleBulkExport = () => {
    const docsToExport = [
      ...filteredPrds.filter((doc) => selectedIds.has(doc.id)),
      ...filteredPrompts.filter((doc) => selectedIds.has(doc.id)),
    ];

    if (docsToExport.length > 0) {
      exportSelected(docsToExport);
    }
  };

  // =========================================================================
  // STATS
  // =========================================================================
  const draftCount = prds.filter((p) => p.status === 'draft').length;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount =
    prds.filter((p) => p.createdAt > sevenDaysAgo).length +
    prompts.filter((p) => p.createdAt > sevenDaysAgo).length;

  const hasFilters =
    searchQuery !== '' ||
    filterStatus !== 'all' ||
    documentType !== 'all' ||
    sortBy !== 'date-desc';

  const showBulkActions = selectedIds.size > 0;

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className={viewMode === 'list' ? 'mb-20' : ''}>
      <div className="mx-auto" style={{ maxWidth: designSystem.componentVariants.layout.maxWidth.default }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-secondary-900 mb-2">
            Meus Documentos
          </h1>
          <p className="text-secondary-600">
            Gerencie seus PRDs, prompts e documentos em um só lugar
          </p>
        </div>

        {/* Stats */}
        {prds.length > 0 || prompts.length > 0 ? (
          <StatsOverview
            totalPrds={prds.length}
            totalPrompts={prompts.length}
            draftPrds={draftCount}
            recentCount={recentCount}
          />
        ) : null}

        {/* Search & Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
        />

        {/* Results Info */}
        {totalResults > 0 && hasFilters && (
          <div className="mb-4 p-3 bg-info-50 border border-info-100 rounded-lg text-sm text-info-700">
            Mostrando <strong>{totalResults}</strong> documento{totalResults !== 1 ? 's' : ''} (de {prds.length + prompts.length})
          </div>
        )}

        {/* Documents List/Grid */}
        {totalResults === 0 ? (
          <EmptyStateEnhanced
            type={documentType === 'prompt' ? 'prompt' : 'prd'}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
            onCreateNew={() => {}} // Pode ser conectado a onNavigate se necessário
          />
        ) : (
          <>
            {/* PRDs Section */}
            {filteredPrds.length > 0 && (documentType === 'all' || documentType === 'prd') && (
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-secondary-800 mb-4">
                  Documentos de Requisitos ({filteredPrds.length})
                </h2>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-3'
                  }
                >
                  {filteredPrds.map((prd) => (
                    <DocumentCard
                      key={prd.id}
                      document={prd}
                      type="prd"
                      onView={() => onViewDocument(prd)}
                      onEdit={() => onEditPrd(prd)}
                      onDelete={() => handleDeleteDocument(prd.id, 'prd')}
                      isSelected={selectedIds.has(prd.id)}
                      onSelect={(selected) => {
                        if (selected) {
                          toggleSelect(prd.id);
                        } else {
                          toggleSelect(prd.id);
                        }
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Prompts Section */}
            {filteredPrompts.length > 0 && (documentType === 'all' || documentType === 'prompt') && (
              <section>
                <h2 className="text-xl font-semibold text-secondary-800 mb-4">
                  Prompts de IA ({filteredPrompts.length})
                </h2>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-3'
                  }
                >
                  {filteredPrompts.map((prompt) => (
                    <DocumentCard
                      key={prompt.id}
                      document={prompt}
                      type="prompt"
                      onView={() => onViewDocument(prompt)}
                      onDelete={() => handleDeleteDocument(prompt.id, 'prompt')}
                      isSelected={selectedIds.has(prompt.id)}
                      onSelect={(selected) => {
                        if (selected) {
                          toggleSelect(prompt.id);
                        } else {
                          toggleSelect(prompt.id);
                        }
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <BulkActionsBar
          selectedCount={selectedIds.size}
          onDeleteSelected={handleBulkDelete}
          onDeselectAll={deselectAll}
          onExportSelected={handleBulkExport}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <p>
          {selectedIds.size > 0
            ? `Você tem certeza que deseja excluir ${selectedIds.size} documento(s)? Esta ação não pode ser desfeita.`
            : 'Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'}
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={selectedIds.size > 0 ? handleBulkDelete : confirmDelete}
          >
            Excluir {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
