
import { createContext, useContext } from 'react';
import type { User } from '../types';

interface AppContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  currentModel: string;
  updateModel: (model: string) => void;
  user: User | null;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Custom hook to access AppContext
 *
 * OPÇÃO A (SEGURA): Retorna o context sem validação.
 * Componentes devem continuar usando optional chaining (appContext?.showToast)
 * para máxima compatibilidade e zero risco de breaking changes.
 */
export const useAppContext = () => {
  return useContext(AppContext);
};
