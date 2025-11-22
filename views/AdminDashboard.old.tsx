import React, { useState, useEffect } from 'react';
import { View, User } from '../types';
import { db } from '../services/databaseService';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ShieldIcon, UserGroupIcon, FileTextIcon, DatabaseIcon, TrashIcon, CheckCircleIcon } from '../components/icons/Icons';

interface AdminDashboardProps {
    setActiveView: (view: View) => void;
}

type Tab = 'overview' | 'users' | 'system';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveView }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({ users: 0, prds: 0, prompts: 0, storageUsage: '0 KB' });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [allUsers, sysStats] = await Promise.all([
                db.getAllUsers(),
                db.getSystemStats()
            ]);
            setUsers(allUsers);
            setStats(sysStats);
        } catch (error) {
            console.error("Erro ao carregar dados admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
        setActionLoading(userId);
        try {
            await db.updateUserRole(userId, newRole);
            await loadData(); // Recarrega para confirmar
        } catch (error) {
            alert("Erro ao atualizar permissão.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleClearDb = async () => {
        if (confirm("ATENÇÃO: Isso apagará TODOS os documentos e configurações do sistema. Usuários serão mantidos. Tem certeza?")) {
            try {
                await db.clearDatabase();
                alert("Banco de dados limpo com sucesso.");
                loadData();
            } catch (e) {
                alert("Erro ao limpar banco.");
            }
        }
    }

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldIcon className="h-8 w-8 text-primary" />
                        Painel Administrativo
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie usuários e monitore o sistema.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'users' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Usuários
                    </button>
                    <button
                        onClick={() => setActiveTab('system')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'system' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Sistema
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Métricas do Sistema</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard 
                                label="Total de Usuários" 
                                value={stats.users} 
                                icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />} 
                                color="bg-blue-50"
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
                                label="Armazenamento (Local)" 
                                value={stats.storageUsage} 
                                icon={<DatabaseIcon className="h-6 w-6 text-orange-600" />} 
                                color="bg-orange-50"
                            />
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                             <h2 className="text-lg font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-semibold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Função</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={u.role === 'admin' ? 'secondary' : 'default'} rounded="full">
                                                    {u.role === 'admin' ? 'Admin' : 'Usuário'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {u.role === 'admin' ? (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleUpdateRole(u.id, 'user')}
                                                        disabled={actionLoading === u.id}
                                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                    >
                                                        Rebaixar
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleUpdateRole(u.id, 'admin')}
                                                        disabled={actionLoading === u.id}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        Promover
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* SYSTEM TAB */}
                {activeTab === 'system' && (
                    <div className="p-6 space-y-8">
                         <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Manutenção de Dados</h2>
                            <div className="bg-red-50 border border-red-100 rounded-lg p-6 flex items-start gap-4">
                                <div className="p-3 bg-red-100 rounded-full shrink-0">
                                    <TrashIcon className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-red-900 font-bold mb-1">Limpar Banco de Dados</h3>
                                    <p className="text-red-700 text-sm mb-4">
                                        Esta ação irá apagar permanentemente todos os PRDs, Prompts, Histórico de Chats e Configurações de todos os usuários.
                                        As contas de usuário NÃO serão apagadas.
                                    </p>
                                    <Button variant="danger" onClick={handleClearDb}>
                                        Confirmar Limpeza
                                    </Button>
                                </div>
                            </div>
                        </div>

                         <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Técnicas</h2>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600 overflow-x-auto">
                                <p>App Version: 1.0.0 (v9)</p>
                                <p>Storage Engine: localStorage</p>
                                <p>User Agent: {navigator.userAgent}</p>
                                <p>Current Time: {new Date().toISOString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-lg ${color} shrink-0`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    </div>
);
