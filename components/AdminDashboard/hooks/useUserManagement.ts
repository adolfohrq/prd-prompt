import { useState, useCallback } from 'react';
import { db } from '../../../services/databaseService';

export const useUserManagement = (onSuccess?: () => void) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateUserRole = useCallback(async (userId: string, newRole: 'user' | 'admin') => {
        setActionLoading(userId);
        setError(null);
        try {
            await db.updateUserRole(userId, newRole);

            // Log da atividade
            await db.logActivity?.({
                action: newRole === 'admin' ? 'promoveu usuário a Admin' : 'rebaixou Admin a Usuário',
                target: userId,
                severity: 'info',
            });

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar permissão');
            throw err;
        } finally {
            setActionLoading(null);
        }
    }, [onSuccess]);

    const deleteUser = useCallback(async (userId: string, userName: string) => {
        setActionLoading(userId);
        setError(null);
        try {
            await db.deleteUser?.(userId);

            await db.logActivity?.({
                action: 'deletou usuário',
                target: userName,
                severity: 'warning',
            });

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Erro ao deletar usuário');
            throw err;
        } finally {
            setActionLoading(null);
        }
    }, [onSuccess]);

    const resetUserPassword = useCallback(async (userId: string, userName: string) => {
        setActionLoading(userId);
        setError(null);
        try {
            await db.resetUserPassword?.(userId);

            await db.logActivity?.({
                action: 'resetou senha de usuário',
                target: userName,
                severity: 'info',
            });

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Erro ao resetar senha');
            throw err;
        } finally {
            setActionLoading(null);
        }
    }, [onSuccess]);

    return {
        actionLoading,
        error,
        updateUserRole,
        deleteUser,
        resetUserPassword,
    };
};
