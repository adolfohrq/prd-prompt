import React from 'react';
import { AdminTabProps, SecurityEvent } from './types';
import { EmptyState } from '../../EmptyState';
import { Badge } from '../../Badge';
import { ShieldIcon, LockIcon, UserIcon } from '../../icons/Icons';

interface SecurityTabProps extends AdminTabProps {
    securityEvents?: SecurityEvent[];
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ securityEvents = [] }) => {
    // Mock de eventos de segurança para demonstração
    const mockEvents: SecurityEvent[] = securityEvents.length === 0 ? [
        {
            id: '1',
            type: 'login',
            userName: 'João Silva',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            ipAddress: '192.168.1.1',
            userAgent: 'Chrome/Windows',
            details: 'Login bem-sucedido',
        },
        {
            id: '2',
            type: 'role_change',
            userName: 'Maria Santos',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            details: 'Usuário promovido a Admin',
        },
        {
            id: '3',
            type: 'failed_login',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            ipAddress: '192.168.1.100',
            details: 'Tentativa de login com credenciais inválidas',
        },
    ] : securityEvents;

    const recentEvents = mockEvents.slice(0, 10);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Segurança & Auditoria</h2>
                <p className="text-sm text-gray-500">Monitore acessos, mudanças de permissão e eventos de segurança</p>
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SecurityCard
                    icon={<ShieldIcon className="h-6 w-6 text-green-600" />}
                    title="Status de Segurança"
                    value="Protegido"
                    description="Todas as verificações passaram"
                    variant="success"
                />
                <SecurityCard
                    icon={<LockIcon className="h-6 w-6 text-blue-600" />}
                    title="Sessões Ativas"
                    value="0"
                    description="Usuários conectados no momento"
                    variant="info"
                />
                <SecurityCard
                    icon={<UserIcon className="h-6 w-6 text-purple-600" />}
                    title="Logins Falhados (24h)"
                    value={mockEvents.filter(e => e.type === 'failed_login').length}
                    description="Tentativas de acesso negadas"
                    variant={mockEvents.filter(e => e.type === 'failed_login').length > 5 ? 'warning' : 'gray'}
                />
            </div>

            {/* Recent Security Events */}
            <div>
                <h3 className="text-md font-semibold text-gray-800 mb-4">Eventos Recentes de Segurança</h3>
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {recentEvents.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={<ShieldIcon className="h-12 w-12" />}
                                title="Nenhum evento de segurança"
                                description="Eventos de login, logout e mudanças de permissão aparecerão aqui."
                            />
                        </div>
                    ) : (
                        recentEvents.map(event => (
                            <SecurityEventItem key={event.id} event={event} />
                        ))
                    )}
                </div>
            </div>

            {/* Security Recommendations */}
            <div>
                <h3 className="text-md font-semibold text-gray-800 mb-4">Recomendações de Segurança</h3>
                <div className="space-y-3">
                    <RecommendationItem
                        title="Autenticação de Dois Fatores (2FA)"
                        description="Habilite 2FA para contas de administrador para maior segurança."
                        status="pending"
                    />
                    <RecommendationItem
                        title="Revisão de Permissões"
                        description="Revise regularmente as permissões de admin para garantir acesso apropriado."
                        status="active"
                    />
                    <RecommendationItem
                        title="Backup Automático"
                        description="Configure backups automáticos dos dados do sistema."
                        status="pending"
                    />
                </div>
            </div>
        </div>
    );
};

const SecurityCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    description: string;
    variant: 'success' | 'info' | 'warning' | 'gray';
}> = ({ icon, title, value, description, variant }) => {
    const colors = {
        success: 'bg-success-50 border-success-200',
        info: 'bg-info-50 border-info-200',
        warning: 'bg-warning-50 border-warning-200',
        gray: 'bg-gray-50 border-gray-200',
    };

    return (
        <div className={`p-6 rounded-xl border ${colors[variant]}`}>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">{icon}</div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
};

const SecurityEventItem: React.FC<{ event: SecurityEvent }> = ({ event }) => {
    const typeLabels = {
        login: 'Login',
        logout: 'Logout',
        failed_login: 'Login Falhado',
        role_change: 'Mudança de Permissão',
        data_access: 'Acesso a Dados',
    };

    const typeVariants = {
        login: 'success' as const,
        logout: 'gray' as const,
        failed_login: 'error' as const,
        role_change: 'warning' as const,
        data_access: 'info' as const,
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
            <Badge variant={typeVariants[event.type]} size="sm">
                {typeLabels[event.type]}
            </Badge>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                    {event.userName && <span className="font-semibold">{event.userName}</span>}
                    {event.details && <span className="ml-2 text-gray-600">{event.details}</span>}
                </p>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>{formatTime(event.timestamp)}</span>
                    {event.ipAddress && <span>IP: {event.ipAddress}</span>}
                    {event.userAgent && <span className="truncate max-w-[200px]">{event.userAgent}</span>}
                </div>
            </div>
        </div>
    );
};

const RecommendationItem: React.FC<{
    title: string;
    description: string;
    status: 'active' | 'pending';
}> = ({ title, description, status }) => {
    return (
        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex-shrink-0 mt-0.5">
                {status === 'active' ? (
                    <div className="h-2 w-2 bg-success-500 rounded-full" />
                ) : (
                    <div className="h-2 w-2 bg-gray-300 rounded-full" />
                )}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{description}</p>
            </div>
            <Badge variant={status === 'active' ? 'success' : 'gray'} size="sm">
                {status === 'active' ? 'Ativo' : 'Pendente'}
            </Badge>
        </div>
    );
};
