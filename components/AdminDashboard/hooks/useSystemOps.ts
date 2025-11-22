import { useState, useCallback } from 'react';
import { db } from '../../../services/databaseService';

export const useSystemOps = (onSuccess?: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearDatabase = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await db.clearDatabase();

            await db.logActivity?.({
                action: 'limpou todo o banco de dados',
                severity: 'error',
                details: 'Todos os PRDs, Prompts e Configurações foram apagados',
            });

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Erro ao limpar banco de dados');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [onSuccess]);

    const exportData = useCallback(async (format: 'json' | 'csv' = 'json') => {
        setLoading(true);
        setError(null);
        try {
            const data = await db.exportAllData?.();

            if (format === 'json') {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `prd-prompt-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }

            await db.logActivity?.({
                action: `exportou dados do sistema (${format.toUpperCase()})`,
                severity: 'info',
            });

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Erro ao exportar dados');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [onSuccess]);

    const clearCache = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Limpa apenas caches temporários, mantém dados principais
            sessionStorage.clear();

            await db.logActivity?.({
                action: 'limpou cache do sistema',
                severity: 'info',
            });

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Erro ao limpar cache');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [onSuccess]);

    return {
        loading,
        error,
        clearDatabase,
        exportData,
        clearCache,
    };
};
