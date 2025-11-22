
import React from 'react';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/Icons';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
  tooltipText?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, tooltipText, ...props }) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <InfoIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
          </Tooltip>
        )}
      </div>
      <select
        id={id}
        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
