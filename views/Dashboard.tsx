
import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import type { View } from '../types';
import { GeneratePrdIcon, GeneratePromptIcon, MyDocumentsIcon } from '../components/icons/Icons';
import { designSystem } from '../designSystem';

interface DashboardProps {
  setActiveView: (view: View) => void;
  prdCount: number;
  promptCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveView, prdCount, promptCount }) => {
  return (
    <div className="mx-auto space-y-8" style={{ maxWidth: designSystem.componentVariants.layout.maxWidth.default }}>
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Bem-vindo ao PRD-Prompt.ai</h1>
        <p className="mt-2 text-lg text-secondary-600">Transforme suas ideias em produtos digitais prontos para o desenvolvimento com IA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-start p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-secondary-100" onClick={() => setActiveView('generate-prd')}>
            <div className="flex items-center justify-between w-full mb-6">
                <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                    <GeneratePrdIcon className="h-8 w-8" />
                </div>
                <Badge variant="success" rounded="full" className="px-3 py-1 text-xs font-bold uppercase tracking-wide">Novo</Badge>
            </div>
            <h2 className="text-2xl font-bold text-secondary-900">Gerar PRD</h2>
            <p className="mt-3 text-base text-secondary-500 leading-relaxed">Crie especificações completas a partir de uma simples ideia.</p>
        </Card>
        
        <Card className="flex flex-col items-start p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-secondary-100" onClick={() => setActiveView('generate-prompt')}>
             <div className="flex items-center justify-between w-full mb-6">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                    <GeneratePromptIcon className="h-8 w-8" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-secondary-900">Gerar Prompt</h2>
            <p className="mt-3 text-base text-secondary-500 leading-relaxed">Converta seus PRDs em prompts otimizados para codificação.</p>
        </Card>

        <Card className="flex flex-col items-start p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-secondary-100" onClick={() => setActiveView('my-documents')}>
             <div className="flex items-center justify-between w-full mb-6">
                <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                    <MyDocumentsIcon className="h-8 w-8" />
                </div>
                 <div className="flex space-x-2">
                    <Badge variant="gray" className="bg-secondary-100 text-secondary-600">{prdCount} PRDs</Badge>
                    <Badge variant="gray" className="bg-secondary-100 text-secondary-600">{promptCount} Prompts</Badge>
                 </div>
            </div>
            <h2 className="text-2xl font-bold text-secondary-900">Meus Documentos</h2>
            <p className="mt-3 text-base text-secondary-500 leading-relaxed">Acesse e gerencie todo o seu histórico de projetos.</p>
        </Card>
      </div>

      <Card title="Fluxo de Trabalho Recomendado" className="p-8 border border-secondary-100">
        <div className="mt-6">
            <ol className="relative border-l-2 border-secondary-100 ml-4 space-y-10">
              <li className="ml-10">
                <span className="absolute flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full -left-5 ring-8 ring-white border border-primary-100 text-primary-600 font-extrabold text-sm shadow-sm transition-transform hover:scale-110">
                    1
                </span>
                <h3 className="flex items-center mb-2 text-xl font-bold text-secondary-900">Descreva sua Ideia</h3>
                <p className="text-base font-medium text-secondary-500 leading-relaxed max-w-3xl">
                    Comece na seção <span className="font-bold text-primary-600">"Gerar PRD"</span>. Forneça detalhes básicos sobre o que você quer construir, a indústria e o público-alvo.
                </p>
              </li>
              <li className="ml-10">
                <span className="absolute flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full -left-5 ring-8 ring-white border border-primary-100 text-primary-600 font-extrabold text-sm shadow-sm transition-transform hover:scale-110">
                    2
                </span>
                <h3 className="flex items-center mb-2 text-xl font-bold text-secondary-900">Refine e Gere o PRD</h3>
                <p className="text-base font-medium text-secondary-500 leading-relaxed max-w-3xl">
                    A IA irá gerar concorrentes, banco de dados e layouts. Você pode regenerar seções e editar o texto final antes de salvar.
                </p>
              </li>
              <li className="ml-10">
                <span className="absolute flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full -left-5 ring-8 ring-white border border-primary-100 text-primary-600 font-extrabold text-sm shadow-sm transition-transform hover:scale-110">
                    3
                </span>
                <h3 className="flex items-center mb-2 text-xl font-bold text-secondary-900">Crie o Prompt de Desenvolvimento</h3>
                <p className="text-base font-medium text-secondary-500 leading-relaxed max-w-3xl">
                    Vá para <span className="font-bold text-blue-600">"Gerar Prompt"</span>, selecione seu novo PRD e escolha sua stack. A IA criará um prompt perfeito para colar em ferramentas como Bolt ou ChatGPT.
                </p>
              </li>
            </ol>
        </div>
      </Card>
    </div>
  );
};
