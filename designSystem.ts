/**
 * Design System - PRD-Prompt.ai
 *
 * Sistema centralizado de design tokens para garantir consistência visual
 * em toda a aplicação. Todos os componentes devem usar estes tokens.
 *
 * @version 1.0.0
 * @date 2025-11-22
 */

// ============================================================================
// CORES
// ============================================================================

export const colors = {
  // Cores Primárias
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',    // primary-light
    600: '#6D28D9',    // primary (DEFAULT)
    700: '#5B21B6',    // primary-dark
    800: '#4C1D95',
    900: '#2E1065',
  },

  // Cores Secundárias (Cinza)
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',    // secondary (DEFAULT)
    200: '#E5E7EB',    // light
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Cores Semânticas
  semantic: {
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
    },
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
    },
  },

  // Cores de Suporte
  accent: {
    purple: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      500: '#A855F7',
      600: '#9333EA',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      400: '#FBBF24',
      500: '#F59E0B',
    },
    cyan: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      500: '#06B6D4',
      600: '#0891B2',
    },
  },

  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#F3F4F6',
    tertiary: '#F9FAFB',
    overlay: 'rgba(17, 24, 39, 0.6)',  // gray-900 com 60% opacidade
  },
} as const;

// ============================================================================
// TIPOGRAFIA
// ============================================================================

export const typography = {
  // Tamanhos de Fonte
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  // Pesos de Fonte
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Altura de Linha
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Famílias de Fonte
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  },
} as const;

// ============================================================================
// ESPAÇAMENTO
// ============================================================================

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // círculo perfeito
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 100,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

/**
 * Variantes pré-definidas para componentes
 * Usar estas variantes garante consistência visual
 */

export const componentVariants = {
  button: {
    primary: {
      bg: colors.primary[600],
      bgHover: colors.primary[700],
      text: colors.background.primary,
      ring: colors.primary[500],
    },
    secondary: {
      bg: colors.secondary[200],
      bgHover: colors.secondary[300],
      text: colors.secondary[800],
      ring: colors.secondary[400],
    },
    danger: {
      bg: colors.semantic.error[600],
      bgHover: colors.semantic.error[700],
      text: colors.background.primary,
      ring: colors.semantic.error[500],
    },
    ghost: {
      bg: 'transparent',
      bgHover: colors.secondary[100],
      text: colors.secondary[600],
      textHover: colors.secondary[900],
      ring: colors.secondary[200],
    },
  },

  badge: {
    primary: {
      bg: colors.primary[100],
      text: colors.primary[700],
    },
    success: {
      bg: colors.semantic.success[100],
      text: colors.semantic.success[700],
    },
    error: {
      bg: colors.semantic.error[100],
      text: colors.semantic.error[700],
    },
    warning: {
      bg: colors.semantic.warning[100],
      text: colors.semantic.warning[700],
    },
    info: {
      bg: colors.semantic.info[100],
      text: colors.semantic.info[700],
    },
    gray: {
      bg: colors.secondary[100],
      text: colors.secondary[700],
    },
  },

  alert: {
    success: {
      bg: colors.semantic.success[50],
      border: colors.semantic.success[200],
      text: colors.semantic.success[800],
      icon: colors.semantic.success[600],
    },
    error: {
      bg: colors.semantic.error[50],
      border: colors.semantic.error[200],
      text: colors.semantic.error[800],
      icon: colors.semantic.error[600],
    },
    warning: {
      bg: colors.semantic.warning[50],
      border: colors.semantic.warning[200],
      text: colors.semantic.warning[800],
      icon: colors.semantic.warning[600],
    },
    info: {
      bg: colors.semantic.info[50],
      border: colors.semantic.info[200],
      text: colors.semantic.info[800],
      icon: colors.semantic.info[600],
    },
  },
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  componentVariants,
} as const;

export default designSystem;
