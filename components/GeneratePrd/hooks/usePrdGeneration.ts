import { useState, useCallback, useContext } from 'react';
import type { PRD, Competitor } from '../../../types';
import { geminiService } from '../../../services/geminiService';
import { AppContext } from '../../../contexts/AppContext';
import type { TaskStatus } from '../types';

interface UsePrdGenerationProps {
  prdData: Partial<PRD>;
  setPrdData: React.Dispatch<React.SetStateAction<Partial<PRD>>>;
  setIsPrdGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;
  isMagicMatchModalOpen: boolean;
  isCreativeDirectionModalOpen: boolean;
  setIsMagicMatchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreativeDirectionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logoInspiration: string;
  creativeStyle: string[];
  creativeColors: string[];
  creativeTypography: string;
  creativeElements: string;
  creativeNegative: string;
  setTurboTasks: React.Dispatch<React.SetStateAction<Array<{ id: string; label: string; status: TaskStatus }>>>;
}

export const usePrdGeneration = ({
  prdData,
  setPrdData,
  setIsPrdGenerated,
  setIsLoading,
  setLoadingMessage,
  isMagicMatchModalOpen,
  isCreativeDirectionModalOpen,
  setIsMagicMatchModalOpen,
  setIsCreativeDirectionModalOpen,
  logoInspiration,
  creativeStyle,
  creativeColors,
  creativeTypography,
  creativeElements,
  creativeNegative,
  setTurboTasks
}: UsePrdGenerationProps) => {
  const appContext = useContext(AppContext);

  const generateSection = useCallback(async (
    generator: () => Promise<any>,
    contentKey: keyof PRD['content'],
    message: string
  ) => {
    setLoadingMessage(message);
    try {
      const result = await generator();
      if (result) {
        setPrdData(prev => ({
          ...prev,
          content: { ...prev.content, [contentKey]: result }
        }));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [setPrdData, setLoadingMessage]);

  const handleSmartFill = async () => {
    if (!prdData.ideaDescription || prdData.ideaDescription.length < 5) {
      appContext?.showToast('Digite pelo menos um rascunho da ideia para usar a IA.', 'error');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Analisando sua ideia e preenchendo campos...');
    try {
      const suggestions = await geminiService.suggestPrdMetadata(prdData.ideaDescription);
      if (suggestions) {
        setPrdData(prev => ({
          ...prev,
          ...suggestions,
          content: prev.content
        }));
        appContext?.showToast('Campos preenchidos com IA!');
      } else {
        appContext?.showToast('Não foi possível sugerir metadados.', 'error');
      }
    } catch (e) {
      appContext?.showToast('Erro no preenchimento inteligente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrdStructure = async () => {
    if (!prdData.title || !prdData.ideaDescription || !prdData.industry || !prdData.targetAudience) {
      appContext?.showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Gerando estrutura do PRD...');
    try {
      const results = await Promise.allSettled([
        geminiService.generatePrdSection('Resumo Executivo', prdData),
        geminiService.generatePrdSection('Visão Geral do Produto', prdData),
        geminiService.generatePrdSection('Requisitos Funcionais (em lista)', prdData)
      ]);

      const summary = results[0].status === 'fulfilled' ? results[0].value : 'Erro ao gerar resumo executivo. Tente novamente.';
      const overview = results[1].status === 'fulfilled' ? results[1].value : 'Erro ao gerar visão geral. Tente novamente.';
      const funcReq = results[2].status === 'fulfilled' ? results[2].value : '';

      setPrdData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          executiveSummary: summary,
          productOverview: overview,
          functionalRequirements: funcReq ? funcReq.split('\n').filter(r => r.trim().length > 1) : [],
        }
      }));

      const failedSections = results.filter(r => r.status === 'rejected').length;
      if (failedSections > 0) {
        appContext?.showToast(`Estrutura gerada com ${failedSections} seção(ões) com erro. Revise e regenere se necessário.`, 'warning');
      } else {
        appContext?.showToast('Estrutura gerada com sucesso!');
      }

      setIsPrdGenerated(true);

    } catch (e) {
      appContext?.showToast('Falha ao gerar seções iniciais do PRD.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCompetitors = async () => {
    setIsLoading(true);
    await generateSection(() => geminiService.generateCompetitors(prdData.industry!), 'competitors', 'Analisando concorrentes...');
    setIsLoading(false);
  };

  const handleGenerateUi = async () => {
    setIsLoading(true);
    await generateSection(() => geminiService.generateUiPlan(prdData.ideaDescription!), 'uiPlan', 'Arquitetando Interface do Usuário...');
    setIsLoading(false);
  };

  const handleGenerateDb = async () => {
    setIsLoading(true);
    await generateSection(() => geminiService.generateDbSchema(prdData.ideaDescription!), 'dbSchema', 'Modelando dados...');
    setIsLoading(false);
  };

  const handleGenerateLogo = async (optionsOverride?: { inspiration?: string }) => {
    setIsLoading(true);

    // Close modals
    if (isMagicMatchModalOpen) setIsMagicMatchModalOpen(false);
    if (isCreativeDirectionModalOpen) setIsCreativeDirectionModalOpen(false);

    // Logic to determine source of options
    let options: any = {};

    if (isCreativeDirectionModalOpen) {
      const parts = [];
      if (logoInspiration) parts.push(`Inspiração Principal: ${logoInspiration}`);
      if (creativeStyle.length > 0) parts.push(`Estilos: ${creativeStyle.join(', ')}`);
      if (creativeColors.length > 0) parts.push(`Cores: ${creativeColors.join(', ')}`);
      if (creativeTypography) parts.push(`Tipografia: ${creativeTypography}`);
      if (creativeElements) parts.push(`Elementos Obrigatórios: ${creativeElements}`);
      if (creativeNegative) parts.push(`Evitar (Negative Prompt): ${creativeNegative}`);

      options = {
        customPrompt: parts.join('\n')
      };
    } else if (optionsOverride?.inspiration) {
      options = {
        customPrompt: `Conceito inspirado em: ${optionsOverride.inspiration}`
      };
    }

    await generateSection(() => geminiService.generateLogo(prdData.title!, prdData.industry!, options), 'logoSuggestion', 'Criando identidade visual...');
    setIsLoading(false);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTurboTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleRegenerate = async (currentStep: number) => {
    if (currentStep === 1) await handleGenerateCompetitors();
    else if (currentStep === 2) await handleGenerateUi();
    else if (currentStep === 3) await handleGenerateDb();
    else if (currentStep === 4) await handleGenerateLogo();

    appContext?.showToast('Seção atualizada!');
  };

  const handleDownloadLogo = () => {
    if (!prdData.content?.logoSuggestion?.base64Image) return;

    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${prdData.content.logoSuggestion.base64Image}`;
    link.download = `${prdData.title?.replace(/\s+/g, '_')}_logo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    appContext?.showToast('Logo baixado com sucesso!');
  };

  const handleGenerateDbCode = async (format: 'sql' | 'prisma') => {
    if (!prdData.content?.dbSchema) return;

    setIsLoading(true);
    setLoadingMessage(`Gerando código ${format.toUpperCase()}...`);

    try {
      const code = await geminiService.generateTechnicalSchema(prdData.content.dbSchema, format);

      setPrdData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [format === 'sql' ? 'dbSql' : 'dbPrisma']: code
        }
      }));

      // Auto download
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prdData.title?.replace(/\s+/g, '_')}_${format}.${format === 'sql' ? 'sql' : 'prisma'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      appContext?.showToast(`Arquivo ${format.toUpperCase()} baixado!`);

    } catch (e) {
      appContext?.showToast('Erro ao gerar código técnico.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSmartFill,
    handleGeneratePrdStructure,
    handleGenerateCompetitors,
    handleGenerateUi,
    handleGenerateDb,
    handleGenerateLogo,
    handleRegenerate,
    handleDownloadLogo,
    handleGenerateDbCode,
    updateTaskStatus
  };
};
