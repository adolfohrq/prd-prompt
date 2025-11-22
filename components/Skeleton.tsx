
import React from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Componente Skeleton para estados de loading
 *
 * @param variant - Tipo de skeleton (text, circular, rectangular)
 * @param width - Largura customizada
 * @param height - Altura customizada
 * @param animation - Tipo de animação (pulse, wave, none)
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-secondary-200';

  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton para Avatar
 */
export const SkeletonAvatar: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return <Skeleton variant="circular" className={sizeMap[size]} />;
};

/**
 * Skeleton para Card completo
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 space-y-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height="100px" />
      <div className="space-y-2">
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="90%" />
      </div>
    </div>
  );
};

/**
 * Skeleton para Tabela
 */
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ rows = 3, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
