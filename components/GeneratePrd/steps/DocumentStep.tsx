import React from 'react';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Textarea } from '../../Textarea';
import { Select } from '../../Select';
import { SparklesIcon } from '../../icons/Icons';
import type { DocumentStepProps } from './types';

export const DocumentStep: React.FC<DocumentStepProps & {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSmartFill: () => void;
}> = ({
  isPrdGenerated,
  prdData,
  onGenerateContent,
  onContentChange,
  onEditIdea,
  onInputChange,
  onSmartFill
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
        <p className="text-sm text-purple-700 mb-3">Não quer digitar tudo? Escreva apenas a ideia abaixo e clique na varinha.</p>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm placeholder-purple-300"
            placeholder="Ex: Um app tipo Tinder para adoção de plantas"
            value={prdData.ideaDescription || ''}
            onChange={onInputChange}
            id="ideaDescription"
          />
          <Button onClick={onSmartFill} variant="secondary" className="whitespace-nowrap bg-white border border-purple-200 text-purple-700 hover:bg-purple-100">
            ✨ Mágica
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input id="title" label="Título do Produto/Projeto" value={prdData.title || ''} onChange={onInputChange} placeholder="Ex: Uber para Pets" />
        {!prdData.ideaDescription && (
          <Textarea id="ideaDescription" label="Descrição da Ideia" value={prdData.ideaDescription || ''} onChange={onInputChange} placeholder="Descreva a funcionalidade principal..." />
        )}
        {prdData.ideaDescription && prdData.ideaDescription.length > 50 && (
          <Textarea id="ideaDescription" label="Refinar Descrição (Detalhada)" value={prdData.ideaDescription || ''} onChange={onInputChange} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="industry" label="Indústria / Mercado" value={prdData.industry || ''} onChange={onInputChange} placeholder="Ex: Pet Care, Fintech" />
          <Input id="targetAudience" label="Público-alvo" value={prdData.targetAudience || ''} onChange={onInputChange} placeholder="Ex: Donos de cães em áreas urbanas" />
        </div>
        <Select id="complexity" label="Complexidade" value={prdData.complexity} onChange={onInputChange}>
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
        </Select>
      </div>
    </>
  );
};
