import React, { useState } from 'react';
import { View } from '../types';
import { ShieldIcon } from '../components/icons/Icons';
import { Skeleton } from '../components/Skeleton';
import { useAdminData, useUserManagement, useSystemOps } from '../components/AdminDashboard/hooks';
import { OverviewTab, UsersTab, SystemTab, ActivityTab, SecurityTab } from '../components/AdminDashboard/tabs';

interface AdminDashboardProps {
    setActiveView: (view: View) => void;
    userId: string;
}

type Tab = 'overview' | 'users' | 'system' | 'activity' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveView, userId }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Hooks
    const { loading, users, stats, activityLogs, refresh } = useAdminData();
    const { actionLoading, updateUserRole } = useUserManagement(refresh);
    const { loading: systemLoading, clearDatabase, exportData, clearCache } = useSystemOps(refresh);

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    const tabs: { id: Tab; label: string; count?: number }[] = [
        { id: 'overview', label: 'Visão Geral' },
        { id: 'users', label: 'Usuários', count: users.length },
        { id: 'activity', label: 'Atividades', count: activityLogs.length },
        { id: 'system', label: 'Sistema' },
        { id: 'security', label: 'Segurança' },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldIcon className="h-8 w-8 text-primary-600" />
                        Painel Administrativo
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Gerencie usuários, monitore atividades e configure o sistema.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`ml-2 text-xs ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`}>
                                    ({tab.count})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
                {activeTab === 'overview' && (
                    <OverviewTab userId={userId} stats={stats} onRefresh={refresh} />
                )}

                {activeTab === 'users' && (
                    <UsersTab
                        userId={userId}
                        users={users}
                        actionLoading={actionLoading}
                        onUpdateRole={updateUserRole}
                        onRefresh={refresh}
                    />
                )}

                {activeTab === 'activity' && (
                    <ActivityTab userId={userId} activityLogs={activityLogs} onRefresh={refresh} />
                )}

                {activeTab === 'system' && (
                    <SystemTab
                        userId={userId}
                        onClearDatabase={clearDatabase}
                        onExportData={exportData}
                        onClearCache={clearCache}
                        systemLoading={systemLoading}
                        onRefresh={refresh}
                    />
                )}

                {activeTab === 'security' && (
                    <SecurityTab userId={userId} onRefresh={refresh} />
                )}
            </div>
        </div>
    );
};
