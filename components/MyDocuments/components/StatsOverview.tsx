import React from 'react';
import type { StatsOverviewProps } from './types';

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalPrds,
  totalPrompts,
  draftPrds,
  recentCount,
}) => {
  const stats = [
    {
      label: 'Total de PRDs',
      value: totalPrds,
      color: 'bg-primary-50 text-primary-700',
      icon: '📋',
    },
    {
      label: 'Prompts',
      value: totalPrompts,
      color: 'bg-secondary-50 text-secondary-700',
      icon: '⚡',
    },
    {
      label: 'Rascunhos',
      value: draftPrds,
      color: 'bg-warning-50 text-warning-700',
      icon: '📝',
    },
    {
      label: 'Últimos 7 dias',
      value: recentCount,
      color: 'bg-success-50 text-success-700',
      icon: '✨',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.color} rounded-lg p-4 border border-opacity-20`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
