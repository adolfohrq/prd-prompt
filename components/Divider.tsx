
import React from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerThickness = 'thin' | 'medium' | 'thick';

interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  thickness?: DividerThickness;
  className?: string;
  label?: string; // Optional text label in the middle of divider
}

/**
 * Componente Divider - Para separação visual consistente
 *
 * @param orientation - Orientação do divisor (horizontal ou vertical)
 * @param variant - Estilo da linha (solid, dashed, dotted)
 * @param thickness - Espessura da linha (thin, medium, thick)
 * @param label - Texto opcional no centro do divisor
 *
 * @example
 * // Divisor horizontal simples
 * <Divider />
 *
 * @example
 * // Divisor com label
 * <Divider label="ou" />
 *
 * @example
 * // Divisor vertical
 * <Divider orientation="vertical" className="h-32" />
 *
 * @example
 * // Divisor tracejado
 * <Divider variant="dashed" thickness="medium" />
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  className = '',
  label,
}) => {
  const thicknessStyles: Record<DividerThickness, string> = {
    thin: orientation === 'horizontal' ? 'border-t' : 'border-l',
    medium: orientation === 'horizontal' ? 'border-t-2' : 'border-l-2',
    thick: orientation === 'horizontal' ? 'border-t-4' : 'border-l-4',
  };

  const variantStyles: Record<DividerVariant, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const orientationStyles =
    orientation === 'horizontal'
      ? 'w-full'
      : 'h-full inline-block';

  const baseClasses = `
    border-secondary-200
    ${thicknessStyles[thickness]}
    ${variantStyles[variant]}
    ${orientationStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Divider with label (only for horizontal orientation)
  if (label && orientation === 'horizontal') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`flex-1 ${thicknessStyles[thickness]} ${variantStyles[variant]} border-secondary-200`} />
        <span className="px-4 text-sm font-medium text-secondary-500">{label}</span>
        <div className={`flex-1 ${thicknessStyles[thickness]} ${variantStyles[variant]} border-secondary-200`} />
      </div>
    );
  }

  // Simple divider
  if (orientation === 'horizontal') {
    return <hr className={baseClasses} />;
  }

  // Vertical divider
  return <div className={baseClasses} />;
};
