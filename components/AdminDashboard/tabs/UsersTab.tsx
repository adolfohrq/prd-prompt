import React, { useState, useMemo } from 'react';
import { User } from '../../../types';
import { AdminTabProps } from './types';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import { Input } from '../../Input';
import { Modal } from '../../Modal';
import { SearchIcon, FilterIcon } from '../../icons/Icons';

interface UsersTabProps extends AdminTabProps {
    users: User[];
    actionLoading: string | null;
    onUpdateRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
}

export const UsersTab: React.FC<UsersTabProps> = ({
    users,
    actionLoading,
    onUpdateRole,
}) => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'role'>('name');
    const [confirmModal, setConfirmModal] = useState<{ userId: string; userName: string; newRole: 'user' | 'admin' } | null>(null);

    // Filtrar e ordenar usuários
    const filteredUsers = useMemo(() => {
        let result = users;

        // Filtro de busca
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(lowerSearch) ||
                u.email.toLowerCase().includes(lowerSearch)
            );
        }

        // Filtro por role
        if (roleFilter !== 'all') {
            result = result.filter(u => u.role === roleFilter);
        }

        // Ordenação
        result.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'email') return a.email.localeCompare(b.email);
            if (sortBy === 'role') return (a.role || 'user').localeCompare(b.role || 'user');
            return 0;
        });

        return result;
    }, [users, search, roleFilter, sortBy]);

    const handleRoleChange = async () => {
        if (!confirmModal) return;
        try {
            await onUpdateRole(confirmModal.userId, confirmModal.newRole);
            setConfirmModal(null);
        } catch (error) {
            // Error handling já feito no hook
        }
    };

    return (
        <div className="p-0 overflow-hidden">
            {/* Header com Filtros */}
            <div className="p-6 border-b border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
                        </p>
                    </div>
                </div>

                {/* Barra de Busca e Filtros */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<SearchIcon className="h-4 w-4" />}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">Todas as funções</option>
                            <option value="admin">Admin</option>
                            <option value="user">Usuário</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="name">Ordenar por Nome</option>
                            <option value="email">Ordenar por Email</option>
                            <option value="role">Ordenar por Função</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de Usuários */}
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
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <FilterIcon className="h-12 w-12 text-gray-300" />
                                        <p>Nenhum usuário encontrado</p>
                                        {search && (
                                            <button
                                                onClick={() => setSearch('')}
                                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                            >
                                                Limpar busca
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={u.role === 'admin' ? 'primary' : 'gray'} rounded="full">
                                            {u.role === 'admin' ? 'Admin' : 'Usuário'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.role === 'admin' ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setConfirmModal({ userId: u.id, userName: u.name, newRole: 'user' })}
                                                disabled={actionLoading === u.id}
                                                isLoading={actionLoading === u.id}
                                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                            >
                                                Rebaixar
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setConfirmModal({ userId: u.id, userName: u.name, newRole: 'admin' })}
                                                disabled={actionLoading === u.id}
                                                isLoading={actionLoading === u.id}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                Promover
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Confirmação */}
            {confirmModal && (
                <Modal
                    isOpen={true}
                    onClose={() => setConfirmModal(null)}
                    title={confirmModal.newRole === 'admin' ? 'Promover Usuário' : 'Rebaixar Admin'}
                >
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Tem certeza que deseja {confirmModal.newRole === 'admin' ? 'promover' : 'rebaixar'} <strong>{confirmModal.userName}</strong> para {confirmModal.newRole === 'admin' ? 'Admin' : 'Usuário'}?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setConfirmModal(null)}>
                                Cancelar
                            </Button>
                            <Button
                                variant={confirmModal.newRole === 'admin' ? 'primary' : 'danger'}
                                onClick={handleRoleChange}
                                isLoading={actionLoading === confirmModal.userId}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
