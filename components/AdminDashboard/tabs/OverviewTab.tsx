import React from 'react';
import { AdminTabProps, AdminStats } from './types';
import { StatCard } from '../components';
import { UserGroupIcon, FileTextIcon, CheckCircleIcon, DatabaseIcon, ClockIcon, ChartBarIcon } from '../../icons/Icons';

interface OverviewTabProps extends AdminTabProps {
    stats: AdminStats;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats }) => {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Métricas do Sistema</h2>
                <p className="text-sm text-gray-500">Visão geral do desempenho e uso da plataforma</p>
            </div>

            {/* Grid de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Total de Usuários"
                    value={stats.users}
                    icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
                    color="bg-blue-50"
                />

                <StatCard
                    label="Usuários Ativos"
                    value={stats.activeUsers}
                    icon={<ClockIcon className="h-6 w-6 text-green-600" />}
                    color="bg-green-50"
                />

                <StatCard
                    label="PRDs Gerados"
                    value={stats.prds}
                    icon={<FileTextIcon className="h-6 w-6 text-purple-600" />}
                    color="bg-purple-50"
                />

                <StatCard
                    label="Prompts Criados"
                    value={stats.prompts}
                    icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
                    color="bg-green-50"
                />

                <StatCard
                    label="Total de Documentos"
                    value={stats.totalDocuments}
                    icon={<ChartBarIcon className="h-6 w-6 text-indigo-600" />}
                    color="bg-indigo-50"
                />

                <StatCard
                    label="Armazenamento"
                    value={stats.storageUsage}
                    icon={<DatabaseIcon className="h-6 w-6 text-orange-600" />}
                    color="bg-orange-50"
                />
            </div>

            {/* Métricas Adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Atividade Recente */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-primary-600" />
                        Atividade Recente
                    </h3>
                    <div className="space-y-3">
                        <MetricRow label="Média de PRDs/usuário" value={(stats.prds / Math.max(stats.users, 1)).toFixed(1)} />
                        <MetricRow label="Média de Prompts/usuário" value={(stats.prompts / Math.max(stats.users, 1)).toFixed(1)} />
                        <MetricRow label="Documentos/usuário" value={(stats.totalDocuments / Math.max(stats.users, 1)).toFixed(1)} />
                    </div>
                </div>

                {/* Status do Sistema */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DatabaseIcon className="h-5 w-5 text-primary-600" />
                        Status do Sistema
                    </h3>
                    <div className="space-y-3">
                        <StatusRow label="Banco de Dados" status="Operacional" variant="success" />
                        <StatusRow label="Armazenamento" status="Disponível" variant="success" />
                        <StatusRow label="API Gemini" status="Ativa" variant="success" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
);

const StatusRow: React.FC<{ label: string; status: string; variant: 'success' | 'warning' | 'error' }> = ({ label, status, variant }) => {
    const colors = {
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        error: 'bg-error-100 text-error-700',
    };

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">{label}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[variant]}`}>
                {status}
            </span>
        </div>
    );
};
