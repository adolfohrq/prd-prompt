import { User } from '../../../types';

export interface AdminTabProps {
    userId: string; // Admin user ID
    onRefresh?: () => void;
}

export interface AdminStats {
    users: number;
    prds: number;
    prompts: number;
    storageUsage: string;
    activeUsers: number;
    totalDocuments: number;
}

export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    target?: string;
    timestamp: Date;
    details?: string;
    severity: 'info' | 'warning' | 'error';
}

export interface UserWithStats extends User {
    documentCount: number;
    lastActive?: Date;
    storageUsed: string;
}

export interface SecurityEvent {
    id: string;
    type: 'login' | 'logout' | 'failed_login' | 'role_change' | 'data_access';
    userId?: string;
    userName?: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    details: string;
}
