export type TaskStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TurboTask {
  id: string;
  label: string;
  status: TaskStatus;
}

export interface MagicMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateAuto: () => void;
  onOpenCreativeDirection: () => void;
}

export interface CreativeDirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateLogo: () => void;
  onBackToMagicMatch: () => void;
  logoInspiration: string;
  setLogoInspiration: (value: string) => void;
  creativeStyle: string[];
  setCreativeStyle: React.Dispatch<React.SetStateAction<string[]>>;
  creativeColors: string[];
  setCreativeColors: React.Dispatch<React.SetStateAction<string[]>>;
  creativeTypography: string;
  setCreativeTypography: (value: string) => void;
  creativeElements: string;
  setCreativeElements: (value: string) => void;
  creativeNegative: string;
  setCreativeNegative: (value: string) => void;
}

export interface TurboProgressModalProps {
  isOpen: boolean;
  tasks: TurboTask[];
}
