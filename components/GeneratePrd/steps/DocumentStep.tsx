import React from 'react';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Textarea } from '../../Textarea';
import { Select } from '../../Select';
import { SparklesIcon, BeakerIcon, SaveIcon } from '../../icons/Icons';
import type { DocumentStepProps } from './types';
import type { IdeaAnalysis } from '../../../types';
import { TagInput } from '../../TagInput';

export const DocumentStep: React.FC<DocumentStepProps & {
  onInputChange: (name: string, value: string | string[]) => void;
  onSmartFill: () => void;
  smartFillingFields: string[];
  onAnalyzeIdea: () => void;
  ideaAnalysis: IdeaAnalysis | null;
  onSaveDraft: () => void;
}> = ({
  isPrdGenerated,
  prdData,
  onGenerateContent,
  onContentChange,
  onEditIdea,
  onInputChange,
  onSmartFill,
  smartFillingFields,
  onAnalyzeIdea,
  ideaAnalysis,
  onSaveDraft
}) => {

  if (isPrdGenerated) {
    return (
      <>
        <div className="flex justify-between items-center mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
          <p className="text-xs text-purple-800">
            <strong>Ideia Base:</strong> {prdData.title} - {prdData.industry}
          </p>
          <Button variant="secondary" size="sm" onClick={onEditIdea} className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-50">
            ✏️ Editar Ideia
          </Button>
        </div>
        <div className="space-y-6 animate-fade-in">
          <Textarea
            label="Resumo Executivo"
            id="executiveSummary"
            rows={6}
            value={prdData.content?.executiveSummary || ''}
            onChange={(e) => onContentChange('executiveSummary', e.target.value)}
          />
          <Textarea
            label="Visão Geral do Produto"
            id="productOverview"
            rows={6}
            value={prdData.content?.productOverview || ''}
            onChange={(e) => onContentChange('productOverview', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos Funcionais</label>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {prdData.content?.functionalRequirements?.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-2 italic">* Para editar requisitos individuais, use o chat ou gere novamente.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
        <h4 className="font-bold text-purple-800 mb-2 text-sm uppercase tracking-wide">🪄  Preenchimento Mágico</h4>
        <p className="text-sm text-purple-700 mb-3">Não quer digitar tudo? Escreva apenas a ideia abaixo e use nossos assistentes de IA.</p>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm placeholder-purple-300"
            placeholder="Ex: Um app tipo Tinder para adoção de plantas"
            value={prdData.ideaDescription || ''}
            onChange={(e) => onInputChange('ideaDescription', e.target.value)}
            id="ideaDescription"
          />
          <Button onClick={onSmartFill} variant="secondary" className="whitespace-nowrap bg-white border border-purple-200 text-purple-700 hover:bg-purple-100">
            <SparklesIcon className="w-4 h-4 mr-2" /> Preencher Campos
          </Button>
          <Button onClick={onAnalyzeIdea} variant="secondary" className="whitespace-nowrap bg-white border border-blue-200 text-blue-700 hover:bg-blue-50">
            <BeakerIcon className="w-4 h-4 mr-2" /> Analisar Ideia
          </Button>
          <Button onClick={onSaveDraft} variant="secondary" className="whitespace-nowrap bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            <SaveIcon className="w-4 h-4 mr-2" /> Salvar Rascunho
          </Button>
        </div>
      </div>

      {ideaAnalysis && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
            <h4 className="font-semibold text-sm text-gray-800 mb-2">Análise Rápida da Ideia</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white rounded-md border">
                    <p className="font-semibold text-gray-600">Qualidade Potencial</p>
                    <p className="text-lg font-bold text-gray-900">{ideaAnalysis.quality}</p>
                </div>
                <div className="p-3 bg-white rounded-md border">
                    <p className="font-semibold text-gray-600">Complexidade Estimada</p>
                    <p className="text-lg font-bold text-gray-900">{ideaAnalysis.complexity}</p>
                </div>
                <div className="p-3 bg-white rounded-md border sm:col-span-3">
                    <p className="font-semibold text-gray-600">Feedback da IA</p>
                    <p className="text-gray-700 italic">"{ideaAnalysis.feedback}"</p>
                </div>
            </div>
        </div>
      )}

      <div className="space-y-4">
        <Input 
            id="title" 
            label="Título do Produto/Projeto" 
            value={prdData.title || ''} 
            onChange={(e) => onInputChange('title', e.target.value)} 
            placeholder="Ex: Plataforma de IA para otimizar logística de e-commerces" 
            isMagicFilling={smartFillingFields.includes('title')} 
            tooltipText="Dê um nome claro e conciso para seu produto ou feature. Isso será usado como a identidade principal do seu PRD."
        />
        {!prdData.ideaDescription && (
          <Textarea 
            id="ideaDescription" 
            label="Descrição da Ideia" 
            value={prdData.ideaDescription || ''} 
            onChange={(e) => onInputChange('ideaDescription', e.target.value)} 
            placeholder="Descreva o que o produto faz, para quem se destina, e qual problema resolve. Ex: 'Uma plataforma SaaS que usa IA para analisar rotas de entrega em tempo real...'" 
            rows={5}
            maxLength={1000}
            showCounter={true}
            tooltipText="Quanto mais detalhes você fornecer aqui, mais precisa será a geração de IA. Tente incluir o problema, a solução e o público."
          />
        )}
        {prdData.ideaDescription && prdData.ideaDescription.length > 50 && (
          <Textarea 
            id="ideaDescription" 
            label="Refinar Descrição (Detalhada)" 
            value={prdData.ideaDescription || ''} 
            onChange={(e) => onInputChange('ideaDescription', e.target.value)} 
            rows={5}
            maxLength={1000}
            showCounter={true}
            tooltipText="Quanto mais detalhes você fornecer aqui, mais precisa será a geração de IA. Tente incluir o problema, a solução e o público."
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TagInput 
            label="Indústria / Mercado" 
            tags={prdData.industry || []}
            onTagsChange={(tags) => onInputChange('industry', tags)}
            placeholder="Ex: SaaS, Logística, IA" 
            tooltipText="Adicione tags para o setor em que seu produto atuará. Isso ajuda a IA a entender o contexto competitivo."
          />
          <Input 
            id="targetAudience" 
            label="Público-alvo" 
            value={prdData.targetAudience || ''} 
            onChange={(e) => onInputChange('targetAudience', e.target.value)} 
            placeholder="Ex: Gerentes de logística de PMEs" 
            isMagicFilling={smartFillingFields.includes('targetAudience')} 
            tooltipText="Descreva o perfil do seu cliente ideal. Seja específico para ajudar a IA a criar personas e requisitos focados."
          />
        </div>
        <Select 
          id="complexity" 
          label="Complexidade" 
          value={prdData.complexity} 
          onChange={(e) => onInputChange('complexity', e.target.value)}
          tooltipText="Estime a complexidade geral do projeto. 'Baixa' (ex: landing page), 'Média' (ex: app com CRUD), 'Alta' (ex: plataforma com IA/integrações)."
        >
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
        </Select>
      </div>
    </>
  );
};
