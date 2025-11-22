
import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

/**
 * Componente Avatar com fallback para iniciais
 *
 * @param name - Nome completo do usuário (usado para gerar iniciais)
 * @param src - URL da imagem (opcional)
 * @param size - Tamanho do avatar (xs, sm, md, lg, xl)
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
}) => {
  const sizeStyles: Record<AvatarSize, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  // Gera iniciais a partir do nome
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Gera cor de fundo baseada no nome (consistente para o mesmo nome)
  const getBackgroundColor = (fullName: string): string => {
    const colors = [
      'bg-primary-500',
      'bg-info-500',
      'bg-success-500',
      'bg-warning-500',
      'bg-purple-500',
      'bg-cyan-500',
    ];
    const index = fullName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const bgColor = getBackgroundColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizeStyles[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${bgColor} ${sizeStyles[size]} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
