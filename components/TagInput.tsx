import React, { useState } from 'react';
import { XIcon } from './icons/Icons';
import { IconButton } from './IconButton';

interface TagInputProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  tooltipText?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ label, tags, onTagsChange, placeholder, tooltipText }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
        {tags.map(tag => (
          <div key={tag} className="flex items-center bg-primary/10 text-primary text-sm font-medium mr-2 mb-1 px-2 py-1 rounded">
            {tag}
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => removeTag(tag)}
              className="ml-1 h-4 w-4 p-0 hover:bg-primary/20 text-primary"
              ariaLabel={`Remover ${tag}`}
              icon={<XIcon className="w-3 h-3" />}
            />
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-grow bg-transparent focus:outline-none sm:text-sm"
          placeholder={placeholder || 'Adicione uma tag e tecle Enter...'}
        />
      </div>
    </div>
  );
};
