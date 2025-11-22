
import React from 'react';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/Icons';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isMagicFilling?: boolean;
  maxLength?: number;
  showCounter?: boolean;
  tooltipText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, isMagicFilling, maxLength, showCounter, value, tooltipText, ...props }) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm";
    const magicFillClasses = isMagicFilling ? 'ring-2 ring-violet-300 animate-pulse' : '';
    const valueAsString = value as string || '';

  return (
    <div>
      <div className="flex justify-between items-baseline">
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
        {showCounter && maxLength && (
            <div className="text-right text-xs text-gray-400">
                {valueAsString.length} / {maxLength}
            </div>
        )}
      </div>
      <textarea
        id={id}
        rows={4}
        className={`${baseClasses} ${magicFillClasses}`}
        value={value}
        {...props}
      />
    </div>
  );
};
