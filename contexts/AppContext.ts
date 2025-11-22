
import { createContext } from 'react';
import type { User } from '../../types';

interface AppContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  currentModel: string;
  updateModel: (model: string) => void;
  user: User | null;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
