import React from 'react';
import { ActivityLog } from '../tabs/types';
import { Badge } from '../../Badge';

interface ActivityLogItemProps {
    log: ActivityLog;
}

export const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ log }) => {
    const severityVariant = {
        info: 'info' as const,
        warning: 'warning' as const,
        error: 'error' as const,
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'agora mesmo';
        if (diffMins < 60) return `${diffMins}min atrás`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h atrás`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d atrás`;
    };

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
                <Badge variant={severityVariant[log.severity]} size="sm">
                    {log.severity.toUpperCase()}
                </Badge>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{log.userName}</span> {log.action}
                    {log.target && <span className="text-gray-500"> em "{log.target}"</span>}
                </p>
                {log.details && (
                    <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatTime(log.timestamp)}</p>
            </div>
        </div>
    );
};
