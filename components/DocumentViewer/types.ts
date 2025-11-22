import type { PRD, PromptDocument } from '../../types';

export interface DocumentViewerProps {
  document: PRD | PromptDocument;
  onBack: () => void;
}

export type TabId = 'overview' | 'market' | 'ui' | 'db' | 'brand';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: JSX.Element;
}
