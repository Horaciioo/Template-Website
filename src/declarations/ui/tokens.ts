import type { Alignment, Size, Tone } from '@/types/common'

/**
 * Focus ring styles
 * @type {string}
 */

export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/**
 * Color transition
 * @type {string}
 */

export const TRANSITION = 'transition-colors duration-base ease-out'

/**
 * All properties transition
 * @type {string}
 */

export const TRANSITION_ALL = 'transition-all duration-base ease-out'

/**
 * Disabled state styles
 * @type {string}
 */

export const DISABLED = 'disabled:pointer-events-none disabled:opacity-50'

/**
 * Tone and size order
 * @type {Tone[]}
 */

export const TONES: Tone[] = [
  'neutral',
  'primary',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
]

/**
 * Size order
 * @type {Size[]}
 */

export const SIZES: Size[] = ['sm', 'md', 'lg']

/**
 * Surface styles
 * @type {Object}
 */

export const SURFACES = {
  page: 'bg-background',
  card: 'bg-surface border border-border rounded-lg',
  raised: 'bg-background border border-border rounded-lg shadow-sm',
  inset: 'bg-surface-strong rounded-md',
  outline: 'border border-border rounded-lg',
  ghost: 'bg-transparent',
} as const

/**
 * Surface name
 * @typedef {keyof typeof SURFACES} SurfaceName
 */

export type SurfaceName = keyof typeof SURFACES

/**
 * Tone text colors
 * @type {Record<Tone, string>}
 */

export const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-foreground-muted',
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}

/**
 * Tone soft surfaces
 * @type {Record<Tone, string>}
 */

export const TONE_SOFT: Record<Tone, string> = {
  neutral: 'bg-surface-strong text-foreground-muted',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
}

/**
 * Tone solid surfaces
 * @type {Record<Tone, string>}
 */

export const TONE_SOLID: Record<Tone, string> = {
  neutral: 'bg-foreground-muted text-background',
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  success: 'bg-success text-background',
  warning: 'bg-warning text-background',
  danger: 'bg-danger text-background',
  info: 'bg-info text-background',
}

/**
 * Tone border colors
 * @type {Record<Tone, string>}
 */

export const TONE_BORDER: Record<Tone, string> = {
  neutral: 'border-border',
  primary: 'border-primary/30',
  accent: 'border-accent/30',
  success: 'border-success/30',
  warning: 'border-warning/30',
  danger: 'border-danger/30',
  info: 'border-info/30',
}

/**
 * Alignment styles
 * @type {Record<Alignment, string>}
 */

export const ALIGNMENTS: Record<Alignment, string> = {
  start: 'items-start text-left',
  center: 'items-center text-center',
  end: 'items-end text-right',
}

/**
 * Gap sizes
 * @type {Record<Size, string>}
 */

export const GAPS: Record<Size, string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
}

/**
 * Section spacing
 * @type {Record<Size, string>}
 */

export const SECTION_SPACING: Record<Size, string> = {
  sm: 'py-10 sm:py-12',
  md: 'py-16 sm:py-20',
  lg: 'py-24 sm:py-32',
}

/**
 * Grid column counts
 * @type {Object}
 */

export const GRID_COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const

/**
 * Grid column count
 * @typedef {keyof typeof GRID_COLUMNS} GridColumnCount
 */

export type GridColumnCount = keyof typeof GRID_COLUMNS

/**
 * Container width sizes
 * @type {Object}
 */

export const CONTAINER_WIDTHS = {
  prose: 'max-w-prose',
  narrow: 'max-w-3xl',
  default: 'max-w-container',
  full: 'max-w-none',
} as const

/**
 * Container width name
 * @typedef {keyof typeof CONTAINER_WIDTHS} ContainerWidth
 */

export type ContainerWidth = keyof typeof CONTAINER_WIDTHS

/**
 * Z-index layers
 * @type {Object}
 */

export const LAYERS = {
  header: 'z-30',
  dropdown: 'z-40',
  overlay: 'z-50',
  toast: 'z-[60]',
} as const
