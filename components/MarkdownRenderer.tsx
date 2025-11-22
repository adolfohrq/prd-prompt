
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Simple parser to handle basic Markdown
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith('```') && part.endsWith('```')) {
          const rawContent = part.slice(3, -3);
          // Remove first line (language identifier) if present
          const codeContent = rawContent.replace(/^[^\n]*\n/, '');
          return (
            <pre key={index} className="bg-gray-800 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono border border-gray-700 shadow-inner">
              <code>{codeContent.trim() || rawContent}</code>
            </pre>
          );
        }

        // Handle Bold text (**text**)
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={index}>
            {boldParts.map((subPart, subIndex) => {
              if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return <strong key={subIndex} className="font-bold text-gray-900">{subPart.slice(2, -2)}</strong>;
              }
              return subPart;
            })}
          </span>
        );
      })}
    </div>
  );
};
