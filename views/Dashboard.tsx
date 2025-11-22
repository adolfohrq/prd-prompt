
import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import type { View } from '../types';
import { GeneratePrdIcon, GeneratePromptIcon, MyDocumentsIcon } from '../components/icons/Icons';

interface DashboardProps {
  setActiveView: (view: View) => void;
  prdCount: number;
  promptCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveView, prdCount, promptCount }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Bem-vindo ao PRD-Prompt.ai</h1>
        <p className="mt-2 text-lg text-secondary-600">Transforme suas ideias em produtos digitais prontos para o desenvolvimento com IA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-start p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('generate-prd')}>
            <div className="flex items-center justify-between w-full mb-4">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
                    <GeneratePrdIcon className="h-6 w-6" />
                </div>
                <Badge variant="success" rounded="full">Novo</Badge>
            </div>
            <h2 className="text-xl font-semibold text-secondary-800">Gerar PRD</h2>
            <p className="mt-2 text-sm text-secondary-600">Crie especificações completas a partir de uma simples ideia.</p>
        </Card>
        
        <Card className="flex flex-col items-start p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('generate-prompt')}>
             <div className="flex items-center justify-between w-full mb-4">
                <div className="bg-info-100 p-3 rounded-lg text-info-600">
                    <GeneratePromptIcon className="h-6 w-6" />
                </div>
            </div>
            <h2 className="text-xl font-semibold text-secondary-800">Gerar Prompt</h2>
            <p className="mt-2 text-sm text-secondary-600">Converta seus PRDs em prompts otimizados para codificação.</p>
        </Card>

        <Card className="flex flex-col items-start p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('my-documents')}>
             <div className="flex items-center justify-between w-full mb-4">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
                    <MyDocumentsIcon className="h-6 w-6" />
                </div>
                 <div className="flex space-x-2">
                    <Badge variant="gray">{prdCount} PRDs</Badge>
                    <Badge variant="gray">{promptCount} Prompts</Badge>
                 </div>
            </div>
            <h2 className="text-xl font-semibold text-secondary-800">Meus Documentos</h2>
            <p className="mt-2 text-sm text-secondary-600">Acesse e gerencie todo o seu histórico de projetos.</p>
        </Card>
      </div>

      <Card title="Fluxo de Trabalho Recomendado">
        <ol className="relative border-l border-secondary-200 ml-3 space-y-6 mt-4">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full -left-3 ring-8 ring-white">
                <span className="text-primary-600 font-bold text-xs">1</span>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-secondary-900">Descreva sua Ideia</h3>
            <p className="mb-4 text-base font-normal text-secondary-500">Comece na seção "Gerar PRD". Forneça detalhes básicos sobre o que você quer construir, a indústria e o público-alvo.</p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full -left-3 ring-8 ring-white">
                <span className="text-primary-600 font-bold text-xs">2</span>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-secondary-900">Refine e Gere o PRD</h3>
            <p className="text-base font-normal text-secondary-500">A IA irá gerar concorrentes, banco de dados e layouts. Você pode regenerar seções e editar o texto final antes de salvar.</p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full -left-3 ring-8 ring-white">
                 <span className="text-primary-600 font-bold text-xs">3</span>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-secondary-900">Crie o Prompt de Desenvolvimento</h3>
            <p className="text-base font-normal text-secondary-500">Vá para "Gerar Prompt", selecione seu novo PRD e escolha sua stack (ex: React, Python). A IA criará um prompt perfeito para colar em ferramentas como Bolt ou ChatGPT.</p>
          </li>
        </ol>
      </Card>
    </div>
  );
};
