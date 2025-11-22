/**
 * Design System - PRD-Prompt.ai
 *
 * Sistema centralizado de design tokens para garantir consistência visual,
 * acessibilidade e estética moderna em toda a aplicação.
 *
 * @version 2.0.0 (Refined)
 * @date 2025-11-22
 */

// ============================================================================
// CORES (PALETA MODERN SAAS)
// ============================================================================

export const colors = {
  // Violeta Vibrante (Ação / Marca)
  primary: {
    25:  '#FCFBFF', // Ultra light background
    50:  '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED', // Primary Base (Melhor contraste)
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },

  // Slate (Neutros Profissionais - com tom azulado sutil)
  secondary: {
    25:  '#F8FAFC', // App Background
    50:  '#F8FAFC',
    100: '#F1F5F9', // Card Backgrounds / Hovers
    200: '#E2E8F0', // Borders / Dividers
    300: '#CBD5E1', // Disabled Text
    400: '#94A3B8', // Icons / Secondary Text
    500: '#64748B', // Body Text (Light)
    600: '#475569', // Body Text (Base)
    700: '#334155', // Headings (Secondary)
    800: '#1E293B', // Headings (Primary)
    900: '#0F172A', // Strong UI Elements
    950: '#020617',
  },

  // Semânticas (Feedback)
  semantic: {
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      500: '#EF4444',
      610: '#DC2626',
      600: '#DC2626',
      700: '#B91C1C',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
    },
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
  },

  // Cores de Destaque (Charts / Tags / Avatars)
  accent: {
    purple: '#A855F7',
    amber:  '#F59E0B',
    cyan:   '#06B6D4',
    rose:   '#F43F5E',
    emerald:'#10B981',
  },

  // Backgrounds Abstratos
  background: {
    canvas: '#F8FAFC',   // Fundo da aplicação
    surface: '#FFFFFF',  // Fundo de cards/paineis
    subtle: '#F1F5F9',   // Fundo de áreas secundárias
    overlay: 'rgba(15, 23, 42, 0.6)', // Modal backdrop
  },
} as const;

// ============================================================================
// TIPOGRAFIA (LEITURA OTIMIZADA)
// ============================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px (Body Small)
    base: '1rem',      // 16px (Body Base)
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px (Titles)
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',   // Padrão para leitura
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em', // Bom para títulos grandes
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',   // Bom para ALL CAPS
  },
} as const;

// ============================================================================
// ESPAÇAMENTO & LAYOUT
// ============================================================================

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px  (Tags, Inputs pequenos)
  md: '0.5rem',     // 8px  (Botões, Inputs padrão)
  lg: '0.75rem',    // 12px (Cards pequenos)
  xl: '1rem',       // 16px (Cards padrão, Modais)
  '2xl': '1.5rem',  // 24px (Cards grandes, Paineis)
  '3xl': '2rem',    // 32px (Container hero)
  full: '9999px',
} as const;

// ============================================================================
// EFEITOS VISUAIS (DEPTH & MOTION)
// ============================================================================

export const shadows = {
  none: 'none',
  // Sombras sutis e modernas (Diffuse shadows)
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  
  // Sombras coloridas (Glow effects)
  purple: '0 10px 30px -10px rgba(124, 58, 237, 0.3)',
  
  // Sombra interna para inputs
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
} as const;

export const blur = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
} as const;

export const transitions = {
  default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', // Efeito elástico sutil
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 100,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// COMPONENT VARIANTS (PADRÕES DE UI)
// ============================================================================

export const componentVariants = {
  button: {
    primary: {
      bg: colors.primary[600],
      bgHover: colors.primary[700],
      text: colors.background.surface,
      ring: colors.primary[200], // Foco sutil
      shadow: shadows.md,
    },
    secondary: {
      bg: colors.background.surface,
      bgHover: colors.secondary[50],
      text: colors.secondary[700],
      border: colors.secondary[200],
      ring: colors.secondary[200],
      shadow: shadows.sm,
    },
    danger: {
      bg: colors.semantic.error[600],
      bgHover: colors.semantic.error[700],
      text: colors.background.surface,
      ring: colors.semantic.error[200],
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
    // Modern: Soft backgrounds with darker text
    primary: {
      bg: colors.primary[50],
      text: colors.primary[700],
      border: colors.primary[100],
    },
    success: {
      bg: colors.semantic.success[50],
      text: colors.semantic.success[700],
      border: colors.semantic.success[100],
    },
    error: {
      bg: colors.semantic.error[50],
      text: colors.semantic.error[700],
      border: colors.semantic.error[100],
    },
    warning: {
      bg: colors.semantic.warning[50],
      text: colors.semantic.warning[700],
      border: colors.semantic.warning[100],
    },
    info: {
      bg: colors.semantic.info[50],
      text: colors.semantic.info[700],
      border: colors.semantic.info[100],
    },
    gray: {
      bg: colors.secondary[100],
      text: colors.secondary[600],
      border: colors.secondary[200],
    },
  },

  alert: {
    success: {
      bg: colors.semantic.success[50],
      border: colors.semantic.success[100],
      text: colors.semantic.success[700],
      icon: colors.semantic.success[600],
    },
    error: {
      bg: colors.semantic.error[50],
      border: colors.semantic.error[100],
      text: colors.semantic.error[700],
      icon: colors.semantic.error[600],
    },
    warning: {
      bg: colors.semantic.warning[50],
      border: colors.semantic.warning[100],
      text: colors.semantic.warning[700],
      icon: colors.semantic.warning[600],
    },
    info: {
      bg: colors.semantic.info[50],
      border: colors.semantic.info[100],
      text: colors.semantic.info[700],
      icon: colors.semantic.info[600],
    },
  },

  sidebar: {
    container: {
      width: '16rem',
      bg: colors.background.surface,
      border: colors.secondary[200],
      padding: spacing[4],
    },
    header: {
      marginBottom: spacing[8],
      logoColor: colors.primary[600],
      titleColor: colors.secondary[800],
    },
    navItem: {
      base: {
        paddingX: spacing[4],
        paddingY: spacing[3],
        radius: borderRadius.lg,
        font: typography.fontWeight.medium,
        fontSize: typography.fontSize.sm,
        transition: transitions.default,
      },
      active: {
        bg: '#7C3AED1A', // primary-600 (10% opacity)
        text: colors.primary[600],
        hoverBg: '#7C3AED26', // primary-600 (15% opacity)
      },
      inactive: {
        bg: 'transparent',
        text: colors.secondary[600],
        bgHover: '#E2E8F080', // secondary-200 (50% opacity)
        textHover: colors.secondary[900],
      },
      icon: {
        size: spacing[5],
        marginRight: spacing[3],
      }
    },
    section: {
      marginTop: spacing[2],
      paddingTop: spacing[2],
      borderTop: colors.secondary[100], // gray-100
      borderTopSecondary: colors.secondary[200], // gray-200
    },
    footer: {
      marginTop: 'auto',
      spacing: spacing[4],
      ideaCount: {
        bg: colors.secondary[100],
        text: colors.secondary[500],
        fontSize: typography.fontSize.xs,
        radius: borderRadius.md,
      },
      userBox: {
        bg: colors.secondary[50],
        border: colors.secondary[200],
        radius: borderRadius.lg,
        padding: spacing[3],
      }
    }
  },

  // Layout Container Standardization
  layout: {
    maxWidth: {
      default: '80rem', // max-w-7xl (1280px) - Padrão para Dashboards e Listas
      form: '64rem',    // max-w-5xl (1024px) - Padrão para Formulários (Gerar PRD)
      readable: '48rem',// max-w-3xl (768px)  - Padrão para Textos e Configurações
      full: '100%',     // Para layouts fluidos
    },
    padding: {
      base: spacing[6], // p-6 padrão
      mobile: spacing[4],
    }
  }
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
  blur,
  transitions,
  zIndex,
  breakpoints,
  componentVariants,
} as const;

export default designSystem;
