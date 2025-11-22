
import React from 'react';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/Icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isMagicFilling?: boolean;
  tooltipText?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, isMagicFilling, tooltipText, ...props }) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm";
  const magicFillClasses = isMagicFilling ? 'ring-2 ring-violet-300 animate-pulse' : '';

  return (
    <div>
      {label && (
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
      )}
      <input
        id={id}
        className={`${baseClasses} ${magicFillClasses}`}
        {...props}
      />
    </div>
  );
};
