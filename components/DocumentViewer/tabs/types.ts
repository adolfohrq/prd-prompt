import type { PRD, Competitor, DBTable, LogoSuggestion } from '../../../types';

export interface OverviewTabProps {
  document: PRD;
  onCopy: (content: string) => void;
}

export interface MarketTabProps {
  competitors?: Competitor[];
}

export interface UiTabProps {
  uiPlan?: {
    flowchartSvg: string;
    screens: Array<{
      name: string;
      description: string;
      components?: string[];
    }>;
  };
  uiFlowchartSvg?: string;
}

export interface DatabaseTabProps {
  dbSchema?: DBTable[];
  dbSql?: string;
  dbPrisma?: string;
  onCopy: (content: string) => void;
}

export interface BrandTabProps {
  logoSuggestion?: LogoSuggestion;
}
