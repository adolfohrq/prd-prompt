
import React, { useState, useContext, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Input } from '../components/Input';
import { geminiService } from '../services/geminiService';
import { db } from '../services/databaseService';
import { AppContext } from '../contexts/AppContext';
import { TrashIcon } from '../components/icons/Icons';

export const Settings: React.FC = () => {
    const appContext = useContext(AppContext);
    
    const [selectedModel, setSelectedModel] = useState(appContext?.currentModel || 'gemini-2.5-flash');
    const [groqKey, setGroqKey] = useState(''); // Local state for input
    
    const [apiKeyStatus, setApiKeyStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
    const [isLoadingCheck, setIsLoadingCheck] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    // Load saved Groq Key on mount
    useEffect(() => {
        const loadSettings = async () => {
            if (appContext?.user) {
                const settings = await db.getSettings(appContext.user.id);
                if (settings.groqApiKey) {
                    setGroqKey(settings.groqApiKey);
                    geminiService.setGroqKey(settings.groqApiKey); // Ensure service has it
                }
            }
        };
        loadSettings();
    }, [appContext?.user]);

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setSelectedModel(newModel);
        setApiKeyStatus('unknown');
        setValidationMessage('');
    };

    const handleGroqKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroqKey(e.target.value);
        setApiKeyStatus('unknown'); // Invalidate previous check
    };

    // Updated detection logic matching geminiService
    const isGroq = selectedModel.startsWith('llama') || 
                   selectedModel.startsWith('mixtral') || 
                   selectedModel.startsWith('deepseek') || 
                   selectedModel.startsWith('gemma');

    const handleCheckConnection = async () => {
        setIsLoadingCheck(true);
        setValidationMessage('Testando conexão com o modelo selecionado...');
        
        // Temporarily set key in service for testing
        if (isGroq) {
            geminiService.setGroqKey(groqKey);
        }

        const result = await geminiService.validateConnection(selectedModel);
        
        setIsLoadingCheck(false);
        setApiKeyStatus(result.isValid ? 'valid' : 'invalid');
        setValidationMessage(result.message);
        
        if (result.isValid) {
            appContext?.showToast('Conexão válida! Clique em Salvar para aplicar.', 'success');
        } else {
            appContext?.showToast('Erro na conexão.', 'error');
        }
    };

    const handleSave = async () => {
        if (appContext?.user) {
            // Save to DB
            await db.saveSettings(appContext.user.id, { 
                selectedModel: selectedModel,
                groqApiKey: groqKey 
            });
            
            // Update Context & Service
            appContext.updateModel(selectedModel);
            if (isGroq) geminiService.setGroqKey(groqKey);

            appContext.showToast('Configurações salvas com sucesso!', 'success');
        }
    };

    const handleChangeApiKey = async () => {
        const win = window as any;
        if (win.aistudio) {
            try {
                await win.aistudio.openSelectKey();
                setTimeout(handleCheckConnection, 2000); 
            } catch (e) {
                console.error(e);
                appContext?.showToast('Erro ao abrir seletor de chave.', 'error');
            }
        }
    };

    const handleResetDatabase = async () => {
        if (confirm("⚠️ PERIGO: Tem certeza? \n\nIsso apagará PERMANENTEMENTE todos os PRDs, Prompts e Configurações salvos.")) {
            setIsResetting(true);
            try {
                await db.clearDatabase();
                appContext?.showToast('Banco de dados limpo. Reiniciando sistema...', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (e) {
                setIsResetting(false);
                appContext?.showToast('Erro ao limpar banco de dados.', 'error');
            }
        }
    }

    return (
        <div className="max-w-3xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-lg text-gray-600 mb-8">Gerencie modelos de IA e dados do sistema.</p>

            <div className="space-y-8">
                {/* Model Settings */}
                <Card title="Modelo de Inteligência Artificial">
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provedor e Modelo</label>
                            <Select 
                                label="Modelo Selecionado" 
                                id="aiModel" 
                                value={selectedModel} 
                                onChange={handleModelChange}
                            >
                                <optgroup label="Google Gemini (Padrão)">
                                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado)</option>
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Estável)</option>
                                    <option value="gemini-3-pro-preview">Gemini 3 Pro Preview (Avançado)</option>
                                </optgroup>
                                <optgroup label="Meta Llama (via Groq)">
                                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Novo Padrão)</option>
                                    <option value="llama-3.1-8b-instant">Llama 3.1 8B (Super Rápido)</option>
                                </optgroup>
                                <optgroup label="DeepSeek (via Groq)">
                                    <option value="deepseek-r1-distill-llama-70b">DeepSeek R1 (Raciocínio Avançado)</option>
                                </optgroup>
                                <optgroup label="Mistral & Google (via Groq)">
                                    <option value="mixtral-8x7b-32768">Mixtral 8x7B (Clássico)</option>
                                    <option value="gemma2-9b-it">Google Gemma 2 9B</option>
                                </optgroup>
                            </Select>
                        </div>
                        
                        {/* Conditional Input for Groq Key */}
                        {isGroq && (
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg animate-fade-in">
                                <h4 className="text-sm font-bold text-orange-800 mb-2">Configuração Groq Cloud</h4>
                                <p className="text-xs text-orange-700 mb-3">
                                    Para usar modelos Open Source (Llama, DeepSeek, Gemma), você precisa de uma API Key gratuita da Groq. 
                                    <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="underline font-bold ml-1">Obter Chave aqui</a>.
                                </p>
                                <Input 
                                    label="Groq API Key (gsk_...)" 
                                    id="groqKey" 
                                    type="password" 
                                    value={groqKey} 
                                    onChange={handleGroqKeyChange}
                                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-md font-medium text-gray-900">Validação de Conexão</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {isGroq ? "Testar conexão com servidores da Groq." : "Testar conexão com Google AI Studio."}
                                </p>
                            </div>
                             <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                 {!isGroq && (
                                    <Button onClick={handleChangeApiKey} variant="secondary" size="sm">
                                        Trocar Chave Google
                                    </Button>
                                 )}
                                <Button onClick={handleCheckConnection} isLoading={isLoadingCheck} variant="primary" size="sm">
                                    Testar Conexão
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center min-h-[2rem]">
                            {apiKeyStatus === 'valid' && (
                                <span className="inline-flex items-center text-sm font-medium text-green-700">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Conexão validada com sucesso!
                                </span>
                            )}
                            {apiKeyStatus === 'invalid' && (
                                <span className="inline-flex items-center text-sm font-medium text-red-700">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    {validationMessage}
                                </span>
                            )}
                        </div>
                        
                        {apiKeyStatus === 'valid' && (
                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end animate-fade-in">
                                <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-md w-full md:w-auto">
                                    💾 Salvar e Aplicar Configurações
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Danger Zone */}
                <div className="border border-red-200 rounded-xl overflow-hidden bg-white">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                         <h3 className="text-lg font-bold text-red-800 flex items-center">
                            ⚠️ Zona de Perigo
                         </h3>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-md font-medium text-gray-900">Resetar Banco de Dados</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Apaga todos os dados locais. Use se o aplicativo apresentar problemas.
                            </p>
                        </div>
                        <Button 
                            onClick={handleResetDatabase} 
                            variant="danger" 
                            isLoading={isResetting}
                            className="shrink-0"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Apagar Tudo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
