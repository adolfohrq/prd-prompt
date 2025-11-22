import React, { useState } from 'react';
import { AdminTabProps } from './types';
import { Button } from '../../Button';
import { Modal } from '../../Modal';
import { Alert } from '../../Alert';
import { TrashIcon, DatabaseIcon, DownloadIcon, RefreshIcon } from '../../icons/Icons';

interface SystemTabProps extends AdminTabProps {
    onClearDatabase: () => Promise<void>;
    onExportData: (format: 'json' | 'csv') => Promise<void>;
    onClearCache: () => Promise<void>;
    systemLoading: boolean;
}

export const SystemTab: React.FC<SystemTabProps> = ({
    onClearDatabase,
    onExportData,
    onClearCache,
    systemLoading,
}) => {
    const [confirmModal, setConfirmModal] = useState<'clear' | 'export' | null>(null);
    const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

    const handleClearDb = async () => {
        await onClearDatabase();
        setConfirmModal(null);
    };

    const handleExport = async () => {
        await onExportData(exportFormat);
        setConfirmModal(null);
    };

    const handleClearCache = async () => {
        await onClearCache();
    };

    return (
        <div className="p-6 space-y-8">
            {/* Manutenção de Dados */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Manutenção de Dados</h2>

                {/* Clear Database */}
                <div className="bg-red-50 border border-red-100 rounded-lg p-6 flex items-start gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-full shrink-0">
                        <TrashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-red-900 font-bold mb-1">Limpar Banco de Dados</h3>
                        <p className="text-red-700 text-sm mb-4">
                            Esta ação irá apagar permanentemente todos os PRDs, Prompts, Histórico de Chats e Configurações de todos os usuários.
                            As contas de usuário NÃO serão apagadas.
                        </p>
                        <Alert variant="warning" className="mb-4">
                            <strong>Atenção:</strong> Esta ação é irreversível. Recomendamos exportar os dados antes de limpar.
                        </Alert>
                        <Button
                            variant="danger"
                            onClick={() => setConfirmModal('clear')}
                            isLoading={systemLoading}
                        >
                            Confirmar Limpeza
                        </Button>
                    </div>
                </div>

                {/* Export Data */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full shrink-0">
                        <DownloadIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-blue-900 font-bold mb-1">Exportar Dados do Sistema</h3>
                        <p className="text-blue-700 text-sm mb-4">
                            Exporta todos os dados do sistema (usuários, PRDs, prompts) em formato JSON ou CSV para backup ou migração.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setExportFormat('json');
                                    setConfirmModal('export');
                                }}
                                isLoading={systemLoading}
                            >
                                Exportar JSON
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setExportFormat('csv');
                                    setConfirmModal('export');
                                }}
                                isLoading={systemLoading}
                            >
                                Exportar CSV
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Clear Cache */}
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-full shrink-0">
                        <RefreshIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-purple-900 font-bold mb-1">Limpar Cache</h3>
                        <p className="text-purple-700 text-sm mb-4">
                            Remove dados temporários e cache de sessão. Pode resolver problemas de desempenho.
                            Dados principais não são afetados.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleClearCache}
                            isLoading={systemLoading}
                        >
                            Limpar Cache
                        </Button>
                    </div>
                </div>
            </section>

            {/* Informações Técnicas */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Técnicas</h2>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600 overflow-x-auto space-y-1">
                    <InfoRow label="App Version" value="1.0.0 (v9)" />
                    <InfoRow label="Storage Engine" value="localStorage / Supabase" />
                    <InfoRow label="React Version" value="19.2.0" />
                    <InfoRow label="Build Date" value={new Date().toISOString().split('T')[0]} />
                    <InfoRow label="User Agent" value={navigator.userAgent} />
                    <InfoRow label="Current Time" value={new Date().toISOString()} />
                    <InfoRow label="Screen Resolution" value={`${window.screen.width}x${window.screen.height}`} />
                    <InfoRow label="Viewport" value={`${window.innerWidth}x${window.innerHeight}`} />
                </div>
            </section>

            {/* Modal de Confirmação - Clear Database */}
            {confirmModal === 'clear' && (
                <Modal isOpen={true} onClose={() => setConfirmModal(null)} title="⚠️ Confirmar Limpeza de Banco">
                    <div className="space-y-4">
                        <Alert variant="error">
                            Esta ação é <strong>IRREVERSÍVEL</strong> e apagará TODOS os dados da plataforma!
                        </Alert>
                        <p className="text-gray-700">
                            Tem certeza absoluta que deseja continuar? Digite <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">CONFIRMAR</code> abaixo para prosseguir:
                        </p>
                        <input
                            type="text"
                            id="confirm-input"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Digite CONFIRMAR"
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setConfirmModal(null)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    const input = document.getElementById('confirm-input') as HTMLInputElement;
                                    if (input?.value === 'CONFIRMAR') {
                                        handleClearDb();
                                    } else {
                                        alert('Você deve digitar CONFIRMAR para prosseguir.');
                                    }
                                }}
                                isLoading={systemLoading}
                            >
                                Limpar Banco de Dados
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal de Confirmação - Export */}
            {confirmModal === 'export' && (
                <Modal isOpen={true} onClose={() => setConfirmModal(null)} title="Exportar Dados">
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Você está prestes a exportar todos os dados do sistema em formato <strong>{exportFormat.toUpperCase()}</strong>.
                        </p>
                        <Alert variant="info">
                            O arquivo de export será baixado automaticamente no seu navegador.
                        </Alert>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setConfirmModal(null)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleExport} isLoading={systemLoading}>
                                Exportar Agora
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex gap-2">
        <span className="text-gray-500 min-w-[140px]">{label}:</span>
        <span className="text-gray-800 break-all">{value}</span>
    </div>
);
