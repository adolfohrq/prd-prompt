import React from 'react';
import { Card } from '../../Card';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    trend,
    color = 'bg-primary-50'
}) => (
    <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${color} shrink-0`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <span className={`text-xs font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    </Card>
);
