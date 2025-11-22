import { useContext } from 'react';
import type { PRD } from '../../../types';
import { AppContext } from '../../../contexts/AppContext';
import { db } from '../../../services/databaseService';

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

  const handleInputChange = (name: string, value: string | string[]) => {
    setPrdData(prev => ({ ...prev, [name]: value }));
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
       if (prdData.ideaDescription.length < 150) {
            appContext?.showToast('Por favor, forneça uma descrição com pelo menos 150 caracteres para melhores resultados.', 'error');
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
      id: prdData.id || '', // Keep id if editing
      userId: appContext?.user?.id || '',
      createdAt: prdData.createdAt || new Date(),
      title: prdData.title!,
      ideaDescription: prdData.ideaDescription || '',
      industry: prdData.industry || [],
      targetAudience: prdData.targetAudience || 'Geral',
      complexity: prdData.complexity || 'Média',
      status: 'completed', // Mark as completed
      content: prdData.content || {}
    };
    onSavePrd(finalPrd);

    // Reset to Initial State (Welcome Screen)
    setCurrentStep(0);
    setMaxStepReached(0);
    setIsPrdGenerated(false);
    setPrdData({ complexity: 'Média', content: {}, industry: [] });
  };

  const handleSaveDraft = async () => {
    if (!prdData.title) {
      appContext?.showToast('O rascunho precisa de pelo menos um título para ser salvo.', 'error');
      return;
    }

    const draftPrd: PRD = {
      id: prdData.id || '', // Keep id if it exists
      userId: appContext?.user?.id || '',
      createdAt: prdData.createdAt || new Date(),
      title: prdData.title!,
      ideaDescription: prdData.ideaDescription || '',
      industry: prdData.industry || [],
      targetAudience: prdData.targetAudience || '',
      complexity: prdData.complexity || 'Média',
      status: 'draft',
      content: prdData.content || {}
    };
    
    try {
      const savedDraft = await db.createPrd(draftPrd);
      // Update local state with the ID from the DB
      setPrdData(prev => ({ ...prev, id: savedDraft.id, createdAt: savedDraft.createdAt }));
      appContext?.showToast('Rascunho salvo com sucesso!', 'success');
    } catch (error: any) {
      appContext?.showToast(`Erro ao salvar rascunho: ${error.message}`, 'error');
    }
  };

  return {
    handleInputChange,
    handleContentChange,
    handleNextStep,
    handleSave,
    handleSaveDraft
  };
};
