
import React from 'react';
import { Button } from './Button';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  size?: EmptyStateSize;
  className?: string;
}

/**
 * Componente EmptyState - Para exibir estados vazios de forma consistente
 *
 * @param icon - Ícone opcional a ser exibido (SVG ou componente)
 * @param title - Título do estado vazio
 * @param description - Descrição explicativa
 * @param action - Ação opcional com botão
 * @param size - Tamanho do componente (sm, md, lg)
 *
 * @example
 * <EmptyState
 *   icon={<DocumentIcon />}
 *   title="Nenhum documento encontrado"
 *   description="Comece criando seu primeiro PRD"
 *   action={{
 *     label: "Criar PRD",
 *     onClick: () => navigate('generate-prd')
 *   }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      container: 'py-12',
      iconContainer: 'w-12 h-12 mb-3',
      iconSize: 'w-6 h-6',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-16',
      iconContainer: 'w-16 h-16 mb-4',
      iconSize: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'py-24',
      iconContainer: 'w-20 h-20 mb-6',
      iconSize: 'w-10 h-10',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={`flex flex-col items-center justify-center ${styles.container} px-4 text-center ${className}`}
    >
      {icon && (
        <div className={`${styles.iconContainer} bg-secondary-100 rounded-full flex items-center justify-center`}>
          <div className={`${styles.iconSize} text-secondary-400`}>
            {icon}
          </div>
        </div>
      )}

      <h3 className={`${styles.title} font-semibold text-secondary-900 mb-2`}>
        {title}
      </h3>

      <p className={`${styles.description} text-secondary-600 max-w-md mb-6`}>
        {description}
      </p>

      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
