import { useContext } from 'react';
import type { PRD } from '../../../types';
import { AppContext } from '../../../contexts/AppContext';

interface UseFormHandlersProps {
  prdData: Partial<PRD>;
  setPrdData: React.Dispatch<React.SetStateAction<Partial<PRD>>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  maxStepReached: number;
  setMaxStepReached: React.Dispatch<React.SetStateAction<number>>;
  setIsPrdGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  steps: string[];
  onSavePrd: (prd: PRD) => void;
}

export const useFormHandlers = ({
  prdData,
  setPrdData,
  currentStep,
  setCurrentStep,
  maxStepReached,
  setMaxStepReached,
  setIsPrdGenerated,
  steps,
  onSavePrd
}: UseFormHandlersProps) => {
  const appContext = useContext(AppContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setPrdData(prev => ({ ...prev, [id]: value }));
  };

  const handleContentChange = (key: keyof PRD['content'], value: string) => {
    setPrdData(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  const handleNextStep = async () => {
    // Step 0 Validation & Navigation (No Generation)
    if (currentStep === 0) {
      if (!prdData.title || !prdData.ideaDescription) {
        appContext?.showToast('Preencha pelo menos o Título e a Descrição para avançar.', 'error');
        return;
      }
      setMaxStepReached(Math.max(maxStepReached, 1));
      setCurrentStep(1);
      return;
    }

    // Generic Navigation for other steps
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setMaxStepReached(Math.max(maxStepReached, nextStep));
      setCurrentStep(nextStep);
    }
  };

  const handleSave = () => {
    if (!prdData.title) {
      appContext?.showToast('O PRD precisa de um título.', 'error');
      return;
    }

    const finalPrd: PRD = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prd-${Date.now()}`,
      userId: appContext?.user?.id || '',
      createdAt: new Date(),
      title: prdData.title,
      ideaDescription: prdData.ideaDescription || '',
      industry: prdData.industry || 'Geral',
      targetAudience: prdData.targetAudience || 'Geral',
      complexity: prdData.complexity || 'Média',
      content: prdData.content || {}
    };
    onSavePrd(finalPrd);

    // Reset to Initial State (Welcome Screen)
    setCurrentStep(0);
    setMaxStepReached(0);
    setIsPrdGenerated(false);
    setPrdData({ complexity: 'Média', content: {} });
  };

  return {
    handleInputChange,
    handleContentChange,
    handleNextStep,
    handleSave
  };
};
