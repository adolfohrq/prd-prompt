
import React, { useState, useContext } from 'react';
import type { PRD, PromptDocument } from '../types';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Card } from '../components/Card';
import { geminiService } from '../services/geminiService';
import { AppContext } from '../contexts/AppContext';
import { CopyIcon, CodeIcon, LayoutIcon, DatabaseIcon, GlobeIcon } from '../components/icons/Icons';
import { designSystem } from '../designSystem';

interface GeneratePromptProps {
  prds: PRD[];
  onSavePrompt: (prompt: PromptDocument) => void;
}

type TargetPlatform = 'Generic' | 'Bolt.new' | 'Cursor' | 'ChatGPT' | 'v0.dev';

export const GeneratePrompt: React.FC<GeneratePromptProps> = ({ prds, onSavePrompt }) => {
  const appContext = useContext(AppContext);
  
  // Core Selection
  const [selectedPrdId, setSelectedPrdId] = useState<string>('');
  
  // Advanced Configuration
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('Generic');
  const [type, setType] = useState<'Aplicativo' | 'Landing Page' | 'Script/Tool'>('Aplicativo');
  
  // Tech Stack
  const [stack, setStack] = useState('Next.js, Tailwind CSS, Supabase');
  const [framework, setFramework] = useState('React');
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  // Context Inclusion (Granular Control)
  const [includeDb, setIncludeDb] = useState(true);
  const [includeUi, setIncludeUi] = useState(true);
  const [includeCompetitors, setIncludeCompetitors] = useState(false);

  // Output
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Stack Templates
  const quickStacks = [
      { name: 'T3 Stack', stack: 'Next.js, tRPC, Tailwind, Prisma, NextAuth', framework: 'React' },
      { name: 'Modern Web', stack: 'Vite, React, Tailwind, Supabase', framework: 'React' },
      { name: 'Python API', stack: 'FastAPI, SQLAlchemy, Pydantic, Docker', framework: 'Python' },
      { name: 'Mobile MVP', stack: 'Expo, React Native, Firebase', framework: 'React Native' },
  ];

  const applyTemplate = (template: typeof quickStacks[0]) => {
      setStack(template.stack);
      setFramework(template.framework);
      appContext?.showToast(`Template ${template.name} aplicado!`);
  };

  const handleGenerate = async () => {
    if (!selectedPrdId) {
      appContext?.showToast('Selecione um PRD para começar.', 'error');
      return;
    }
    const selectedPrd = prds.find(p => p.id === selectedPrdId);
    if (!selectedPrd) {
      appContext?.showToast('PRD selecionado não encontrado.', 'error');
      return;
    }

    setIsLoading(true);
    setGeneratedPrompt(''); // Clear previous
    try {
      const promptContent = await geminiService.generateAiPrompt(selectedPrd, { 
          type, 
          targetPlatform, 
          stack, 
          framework, 
          specialRequirements,
          includeContext: {
              db: includeDb,
              ui: includeUi,
              competitors: includeCompetitors
          }
      });
      setGeneratedPrompt(promptContent);
    } catch (error) {
      appContext?.showToast('Erro ao gerar o prompt.', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedPrompt || !selectedPrdId) return;
    const selectedPrd = prds.find(p => p.id === selectedPrdId);
    const newPrompt: PromptDocument = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prompt-${Date.now()}`,
      userId: appContext?.user?.id || '',
      prdId: selectedPrdId,
      prdTitle: selectedPrd?.title || 'PRD Desconhecido',
      type,
      targetPlatform,
      stack,
      framework,
      specialRequirements,
      content: generatedPrompt,
      createdAt: new Date(),
    };
    onSavePrompt(newPrompt);
  };
  
  const handleCopy = () => {
      navigator.clipboard.writeText(generatedPrompt).then(() => {
          appContext?.showToast('Prompt copiado para a área de transferência!');
      }, () => {
          appContext?.showToast('Falha ao copiar o prompt.', 'error');
      });
  };

  return (
    <div className="mx-auto pb-12" style={{ maxWidth: designSystem.componentVariants.layout.maxWidth.default }}>
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Engenharia de Prompt Avançada</h1>
          <p className="mt-1 text-secondary-600">Transforme PRDs em instruções de código otimizadas para sua IA favorita.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONFIGURATION */}
        <div className="lg:col-span-5 space-y-6">
            {/* 1. Source & Target */}
            <Card title="1. Origem e Destino">
                <div className="space-y-4">
                    <Select label="PRD de Origem" value={selectedPrdId} onChange={(e) => setSelectedPrdId(e.target.value)}>
                        <option value="" disabled>Selecione um documento...</option>
                        {prds.map(prd => (
                            <option key={prd.id} value={prd.id}>{prd.title}</option>
                        ))}
                    </Select>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Tipo de Projeto" value={type} onChange={(e) => setType(e.target.value as any)}>
                            <option>Aplicativo</option>
                            <option>Landing Page</option>
                            <option>Script/Tool</option>
                        </Select>
                        <Select label="IA de Destino (Target)" value={targetPlatform} onChange={(e) => setTargetPlatform(e.target.value as any)}>
                            <option value="Generic">Genérica (ChatGPT)</option>
                            <option value="Cursor">Cursor (Composer)</option>
                            <option value="Bolt.new">Bolt.new</option>
                            <option value="v0.dev">v0.dev (UI Focus)</option>
                        </Select>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800 border border-blue-100">
                        <span className="font-bold">Dica:</span> Selecionar "Cursor" gera regras (.cursorrules), "Bolt" foca em setup web e "v0" foca exclusivamente em UI Shadcn.
                    </div>
                </div>
            </Card>

            {/* 2. Tech Stack */}
            <Card title="2. Stack Tecnológica">
                <div className="space-y-4">
                    <div>
                        <span className="block text-sm font-medium text-secondary-700 mb-2">Templates Rápidos</span>
                        <div className="flex flex-wrap gap-2">
                            {quickStacks.map((t) => (
                                <Button
                                    key={t.name}
                                    onClick={() => applyTemplate(t)}
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full text-xs py-1 h-auto bg-gray-100 border border-gray-200 hover:bg-primary-100 hover:text-primary-700 hover:border-primary-200"
                                >
                                    {t.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    
                    <Input label="Stack (Tecnologias)" value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Ex: Next.js, Tailwind, Supabase" />
                    <Input label="Framework / Linguagem" value={framework} onChange={(e) => setFramework(e.target.value)} placeholder="Ex: React, Vue, Python" />
                </div>
            </Card>

            {/* 3. Context Control */}
            <Card title="3. Contexto do PRD">
                <p className="text-sm text-secondary-500 mb-4">Selecione quais partes do PRD incluir no prompt para economizar tokens e focar a IA.</p>
                <div className="space-y-3">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${includeUi ? 'bg-primary-50 border-purple-200' : 'bg-white hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={includeUi} onChange={(e) => setIncludeUi(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <div className="ml-3 flex items-center">
                            <LayoutIcon className="h-4 w-4 text-secondary-500 mr-2" />
                            <span className="text-sm font-medium text-secondary-700">Plano de UI & Telas</span>
                        </div>
                    </label>
                    
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${includeDb ? 'bg-primary-50 border-purple-200' : 'bg-white hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={includeDb} onChange={(e) => setIncludeDb(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <div className="ml-3 flex items-center">
                            <DatabaseIcon className="h-4 w-4 text-secondary-500 mr-2" />
                            <span className="text-sm font-medium text-secondary-700">Schema do Banco de Dados</span>
                        </div>
                    </label>

                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${includeCompetitors ? 'bg-primary-50 border-purple-200' : 'bg-white hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={includeCompetitors} onChange={(e) => setIncludeCompetitors(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <div className="ml-3 flex items-center">
                            <GlobeIcon className="h-4 w-4 text-secondary-500 mr-2" />
                            <span className="text-sm font-medium text-secondary-700">Análise de Concorrentes</span>
                        </div>
                    </label>
                </div>
                
                 <div className="mt-4">
                    <Textarea 
                        label="Instruções Especiais (Opcional)" 
                        value={specialRequirements} 
                        onChange={(e) => setSpecialRequirements(e.target.value)} 
                        placeholder="Ex: Use testes unitários com Jest, Prefira Functional Components..." 
                        rows={2}
                    />
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button onClick={handleGenerate} isLoading={isLoading} className="w-full shadow-md text-lg py-3">
                        ⚡ Gerar Prompt Otimizado
                    </Button>
                </div>
            </Card>
        </div>

        {/* RIGHT COLUMN: OUTPUT & PREVIEW */}
        <div className="lg:col-span-7 flex flex-col h-full">
             <Card className="flex-grow flex flex-col h-full min-h-[600px]" title="Resultado Gerado">
                {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-secondary-500 animate-pulse space-y-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <CodeIcon className="h-6 w-6 text-primary animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-gray-800">Construindo o Prompt Perfeito...</p>
                            <p className="text-sm">Adaptando para {targetPlatform} • Injetando Contexto • Aplicando Regras</p>
                        </div>
                    </div>
                ) : !generatedPrompt ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg m-4">
                         <CodeIcon className="h-12 w-12 mb-2 opacity-20" />
                        <p>O prompt gerado aparecerá aqui.</p>
                        <p className="text-sm opacity-60">Selecione um PRD e clique em Gerar.</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2 px-1">
                             <span className="text-xs font-mono text-secondary-500 bg-gray-100 px-2 py-1 rounded">
                                {targetPlatform} Mode • {generatedPrompt.length} chars
                             </span>
                             <div className="space-x-2">
                                <Button size="sm" variant="secondary" onClick={handleCopy}>
                                    <CopyIcon className="h-4 w-4 mr-1" /> Copiar
                                </Button>
                             </div>
                        </div>
                        
                        <div className="relative flex-grow border border-gray-300 rounded-md shadow-inner bg-gray-50 overflow-hidden group">
                             <textarea 
                                className="w-full h-full p-4 font-mono text-sm text-gray-800 bg-transparent focus:outline-none resize-none"
                                value={generatedPrompt}
                                onChange={(e) => setGeneratedPrompt(e.target.value)}
                                spellCheck={false}
                             />
                             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                 Editável
                             </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                                💾 Salvar na Biblioteca
                            </Button>
                        </div>
                    </div>
                )}
             </Card>
        </div>

      </div>
    </div>
  );
};
