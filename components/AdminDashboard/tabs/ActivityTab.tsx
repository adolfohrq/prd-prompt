import React, { useState, useMemo } from 'react';
import { AdminTabProps, ActivityLog } from './types';
import { ActivityLogItem } from '../components';
import { EmptyState } from '../../EmptyState';
import { Badge } from '../../Badge';
import { ClockIcon, FilterIcon } from '../../icons/Icons';

interface ActivityTabProps extends AdminTabProps {
    activityLogs: ActivityLog[];
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ activityLogs }) => {
    const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
    const [limit, setLimit] = useState(50);

    const filteredLogs = useMemo(() => {
        let result = activityLogs;

        // Filtro por severidade
        if (severityFilter !== 'all') {
            result = result.filter(log => log.severity === severityFilter);
        }

        // Ordenar por timestamp (mais recente primeiro)
        result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Limitar quantidade
        return result.slice(0, limit);
    }, [activityLogs, severityFilter, limit]);

    const stats = useMemo(() => {
        return {
            total: activityLogs.length,
            info: activityLogs.filter(l => l.severity === 'info').length,
            warning: activityLogs.filter(l => l.severity === 'warning').length,
            error: activityLogs.filter(l => l.severity === 'error').length,
        };
    }, [activityLogs]);

    return (
        <div className="p-6 space-y-6">
            {/* Header com Stats */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Registro de Atividades</h2>
                <p className="text-sm text-gray-500">Histórico completo de ações realizadas no sistema</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Total" value={stats.total} variant="gray" />
                <StatBox label="Informações" value={stats.info} variant="info" />
                <StatBox label="Avisos" value={stats.warning} variant="warning" />
                <StatBox label="Erros" value={stats.error} variant="error" />
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <FilterButton
                        label="Todos"
                        active={severityFilter === 'all'}
                        onClick={() => setSeverityFilter('all')}
                        count={stats.total}
                    />
                    <FilterButton
                        label="Info"
                        active={severityFilter === 'info'}
                        onClick={() => setSeverityFilter('info')}
                        count={stats.info}
                        variant="info"
                    />
                    <FilterButton
                        label="Avisos"
                        active={severityFilter === 'warning'}
                        onClick={() => setSeverityFilter('warning')}
                        count={stats.warning}
                        variant="warning"
                    />
                    <FilterButton
                        label="Erros"
                        active={severityFilter === 'error'}
                        onClick={() => setSeverityFilter('error')}
                        count={stats.error}
                        variant="error"
                    />
                </div>

                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value={25}>Últimas 25</option>
                    <option value={50}>Últimas 50</option>
                    <option value={100}>Últimas 100</option>
                    <option value={500}>Últimas 500</option>
                </select>
            </div>

            {/* Lista de Logs */}
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            icon={<ClockIcon className="h-12 w-12" />}
                            title="Nenhuma atividade registrada"
                            description="Ações realizadas no sistema aparecerão aqui."
                        />
                    </div>
                ) : (
                    filteredLogs.map(log => (
                        <ActivityLogItem key={log.id} log={log} />
                    ))
                )}
            </div>

            {filteredLogs.length > 0 && filteredLogs.length < activityLogs.length && (
                <p className="text-center text-sm text-gray-500">
                    Mostrando {filteredLogs.length} de {activityLogs.length} registros
                </p>
            )}
        </div>
    );
};

const StatBox: React.FC<{ label: string; value: number; variant?: 'gray' | 'info' | 'warning' | 'error' }> = ({
    label,
    value,
    variant = 'gray'
}) => {
    const colors = {
        gray: 'bg-gray-50 border-gray-200',
        info: 'bg-info-50 border-info-200',
        warning: 'bg-warning-50 border-warning-200',
        error: 'bg-error-50 border-error-200',
    };

    return (
        <div className={`p-4 rounded-lg border ${colors[variant]}`}>
            <p className="text-xs text-gray-600 font-medium uppercase">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
};

const FilterButton: React.FC<{
    label: string;
    active: boolean;
    onClick: () => void;
    count: number;
    variant?: 'info' | 'warning' | 'error';
}> = ({ label, active, onClick, count, variant }) => {
    const baseClasses = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border";

    const activeClasses = variant
        ? `bg-${variant}-100 border-${variant}-300 text-${variant}-700`
        : 'bg-primary-100 border-primary-300 text-primary-700';

    const inactiveClasses = 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50';

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        >
            {label} <span className="ml-1 opacity-75">({count})</span>
        </button>
    );
};
