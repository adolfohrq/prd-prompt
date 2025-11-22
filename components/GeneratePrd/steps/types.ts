import type { PRD, Competitor, DBTable, UIFlow, LogoSuggestion } from '../../../types';

export interface DocumentStepProps {
  isPrdGenerated: boolean;
  prdData: Partial<PRD>;
  onGenerateContent: () => void;
  onContentChange: (key: keyof PRD['content'], value: string) => void;
  onEditIdea: () => void;
}

export interface CompetitorsStepProps {
  competitors?: Competitor[];
  isReviewMode?: boolean;
  onRegenerate: () => void;
  onCompetitorClick: (comp: Competitor, index: number) => void;
}

export interface UiPlanStepProps {
  uiFlows?: { flowchartSvg: string; screens: any[] };
  isReviewMode?: boolean;
  onRegenerate: () => void;
}

export interface DatabaseStepProps {
  dbTables?: DBTable[];
  isReviewMode?: boolean;
  onRegenerate: () => void;
  onExportSQL: () => void;
  onExportPrisma: () => void;
}

export interface LogoStepProps {
  logoSuggestion?: LogoSuggestion;
  isReviewMode?: boolean;
  onOpenMagicMatch: () => void;
  onRefineStyle: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
}

export interface ReviewStepProps {
  prdData: Partial<PRD>;
  onContentChange: (key: keyof PRD['content'], value: string) => void;
  onRegenerateCompetitors: () => void;
  onCompetitorClick: (comp: Competitor, index: number) => void;
  onRegenerateUi: () => void;
  onRegenerateDb: () => void;
  onExportSQL: () => void;
  onExportPrisma: () => void;
  onOpenMagicMatch: () => void;
  onRefineLogoStyle: () => void;
  onRegenerateLogo: () => void;
  onDownloadLogo: () => void;
  onSave: () => void;
}
