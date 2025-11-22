import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';

export const useDocumentExport = () => {
  const appContext = useContext(AppContext);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      appContext?.showToast('Conteúdo copiado!');
    }, () => {
      appContext?.showToast('Falha ao copiar.', 'error');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    handleCopy,
    handlePrint
  };
};
