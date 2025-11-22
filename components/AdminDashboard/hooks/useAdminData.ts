import { useState, useEffect, useCallback } from 'react';
import { User } from '../../../types';
import { AdminStats, UserWithStats, ActivityLog } from '../tabs/types';
import { db } from '../../../services/databaseService';

export const useAdminData = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<AdminStats>({
        users: 0,
        prds: 0,
        prompts: 0,
        storageUsage: '0 KB',
        activeUsers: 0,
        totalDocuments: 0,
    });
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [allUsers, sysStats] = await Promise.all([
                db.getAllUsers(),
                db.getSystemStats()
            ]);

            setUsers(allUsers);

            // Calcula métricas adicionais
            const totalDocs = sysStats.prds + sysStats.prompts;
            const activeUsers = allUsers.filter(u => u.role === 'admin' || u.role === 'user').length;

            setStats({
                users: sysStats.users,
                prds: sysStats.prds,
                prompts: sysStats.prompts,
                storageUsage: sysStats.storageUsage,
                activeUsers,
                totalDocuments: totalDocs,
            });

            // Carrega logs de atividade (se disponível)
            const logs = await db.getActivityLogs?.() || [];
            setActivityLogs(logs);

        } catch (error) {
            console.error('Erro ao carregar dados admin:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        loading,
        users,
        stats,
        activityLogs,
        refresh: loadData,
    };
};
