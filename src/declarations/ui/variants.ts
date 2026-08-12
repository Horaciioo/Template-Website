import {
  DISABLED,
  FOCUS_RING,
  SURFACES,
  TONE_SOFT,
  TRANSITION,
  TRANSITION_ALL,
} from '@/declarations/ui/tokens'
import type { Size, Tone } from '@/types/common'

/**
 * Button base styles
 * @type {string}
 */

export const BUTTON_BASE = `inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap ${TRANSITION} ${FOCUS_RING} ${DISABLED}`

/**
 * Button sizes
 * @type {Record<Size, string>}
 */

export const BUTTON_SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

/**
 * Button variants
 * @type {Object}
 */

export const BUTTON_VARIANTS = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs',
  secondary: 'bg-surface text-foreground border border-border hover:bg-surface-strong',
  outline: 'border border-border-strong text-foreground hover:bg-surface',
  ghost: 'text-foreground-muted hover:bg-surface-strong hover:text-foreground',
  link: 'text-primary underline-offset-4 hover:underline px-0 h-auto',
  danger: 'bg-danger text-background hover:opacity-90',
} as const

/**
 * Button variant name
 * @typedef {keyof typeof BUTTON_VARIANTS} ButtonVariant
 */

export type ButtonVariant = keyof typeof BUTTON_VARIANTS

/**
 * Button size name
 * @typedef {Size} ButtonSize
 */

export type ButtonSize = Size

/**
 * Icon button sizes
 * @type {Record<Size, string>}
 */

export const ICON_BUTTON_SIZES: Record<Size, string> = {
  sm: 'h-8 w-8 p-0',
  md: 'h-10 w-10 p-0',
  lg: 'h-12 w-12 p-0',
}

/**
 * Action icon size
 * @type {Record<Size, 'xs' | 'sm' | 'md'>}
 */

export const ACTION_ICON_SIZES: Record<Size, 'xs' | 'sm' | 'md'> = { sm: 'xs', md: 'sm', lg: 'md' }

/**
 * Icon button size
 * @type {Record<Size, 'sm' | 'md'>}
 */

export const ICON_BUTTON_ICON_SIZES: Record<Size, 'sm' | 'md'> = { sm: 'sm', md: 'sm', lg: 'md' }

/**
 * Badge base styles
 * @type {string}
 */

export const BADGE_BASE =
  'inline-flex items-center gap-1.5 rounded-pill font-medium whitespace-nowrap'

/**
 * Badge sizes
 * @type {Record<Size, string>}
 */

export const BADGE_SIZES: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

/**
 * Badge variants
 * @type {Object}
 */

export const BADGE_VARIANTS = {
  soft: TONE_SOFT,
  outline: {
    neutral: 'border border-border text-foreground-muted',
    primary: 'border border-primary/40 text-primary',
    accent: 'border border-accent/40 text-accent',
    success: 'border border-success/40 text-success',
    warning: 'border border-warning/40 text-warning',
    danger: 'border border-danger/40 text-danger',
    info: 'border border-info/40 text-info',
  },
} as const satisfies Record<string, Record<Tone, string>>

/**
 * Badge variant name
 * @typedef {keyof typeof BADGE_VARIANTS} BadgeVariant
 */

export type BadgeVariant = keyof typeof BADGE_VARIANTS

/**
 * Text styles
 * @type {Object}
 */

export const TEXT_STYLES = {
  pageTitle: 'text-3xl sm:text-4xl font-semibold tracking-tight text-foreground',
  sectionTitle: 'text-2xl sm:text-3xl font-semibold tracking-tight text-foreground',
  blockTitle: 'text-lg font-semibold text-foreground',
  lead: 'text-lg text-foreground-muted leading-relaxed',
  body: 'text-sm text-foreground leading-relaxed',
  description: 'text-sm text-foreground-muted leading-relaxed',
  meta: 'text-xs text-foreground-subtle',
  label: 'text-sm font-medium text-foreground',
  overline: 'text-xs font-semibold uppercase tracking-[0.18em] text-primary',
  code: 'font-mono text-xs text-foreground-muted',
} as const

/**
 * Text style name
 * @typedef {keyof typeof TEXT_STYLES} TextStyle
 */

export type TextStyle = keyof typeof TEXT_STYLES

/**
 * Heading styles
 * @type {Object}
 */

export const HEADING_STYLES = {
  1: TEXT_STYLES.pageTitle,
  2: TEXT_STYLES.sectionTitle,
  3: TEXT_STYLES.blockTitle,
  4: 'text-base font-semibold text-foreground',
} as const

/**
 * Heading level name
 * @typedef {keyof typeof HEADING_STYLES} HeadingLevel
 */

export type HeadingLevel = keyof typeof HEADING_STYLES

/**
 * Field styles
 * @type {Object}
 */

export const FIELD_STYLES = {
  wrapper: 'flex flex-col gap-1.5',
  label: `${TEXT_STYLES.label} flex items-center gap-1`,
  required: 'text-danger',
  control: `w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-foreground-subtle ${TRANSITION} ${FOCUS_RING} ${DISABLED} hover:border-border-strong`,
  controlHeight: 'h-10',
  controlWithIcon: 'pl-10',
  textarea: 'min-h-32 py-2.5 resize-y',
  invalid: 'border-danger focus-visible:ring-danger/40',
  icon: 'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle',
  hint: TEXT_STYLES.meta,
  error: 'text-xs text-danger',
  choice: `flex items-start gap-2.5 text-sm text-foreground cursor-pointer ${DISABLED}`,
  checkbox: `h-4 w-4 mt-0.5 shrink-0 rounded-xs border border-border-strong text-primary accent-primary ${FOCUS_RING}`,
  switchTrack: `relative h-6 w-11 shrink-0 rounded-pill border border-transparent bg-border-strong ${TRANSITION} ${FOCUS_RING} data-[checked=true]:bg-primary`,
  switchThumb:
    'block h-5 w-5 translate-x-0.5 rounded-pill bg-background shadow-xs transition-transform duration-base data-[checked=true]:translate-x-[1.375rem]',
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
  wide: 'sm:col-span-2',
} as const

/**
 * Skeleton base styles
 * @type {string}
 */

export const SKELETON_BASE = 'surface-shimmer animate-shimmer rounded-md'

/**
 * Skeleton shapes
 * @type {Object}
 */

export const SKELETON_SHAPES = {
  line: 'h-3 w-full',
  title: 'h-6 w-2/5',
  text: 'h-3 w-3/4',
  row: 'h-12 w-full',
  card: 'h-40 w-full rounded-lg',
  avatar: 'h-10 w-10 rounded-pill',
  button: 'h-10 w-28',
} as const

/**
 * Skeleton shape name
 * @typedef {keyof typeof SKELETON_SHAPES} SkeletonShape
 */

export type SkeletonShape = keyof typeof SKELETON_SHAPES

/**
 * Page skeleton styles
 * @type {Object}
 */

export const PAGE_SKELETON_STYLES = {
  header: 'flex flex-col gap-3',
  title: 'h-8 w-1/3',
  description: 'h-4 w-2/3',
  block: `${SURFACES.card} p-5`,
} as const

/**
 * Empty state styles
 * @type {Object}
 */

export const EMPTY_STATE_STYLES = {
  frame: 'flex flex-col items-center justify-center gap-3 rounded-lg px-6 py-12 text-center',
  start: {
    frame: `${SURFACES.card} border-dashed`,
    iconTile: `flex h-12 w-12 items-center justify-center rounded-pill ${TONE_SOFT.primary}`,
    icon: 'h-6 w-6',
    figure: 'h-28 w-28 text-primary/70',
  },
  filter: {
    frame: SURFACES.inset,
    iconTile: `flex h-12 w-12 items-center justify-center rounded-pill ${TONE_SOFT.neutral}`,
    icon: 'h-6 w-6',
    figure: 'h-28 w-28 text-foreground-subtle',
  },
} as const

/**
 * Empty state variant name
 * @typedef {Exclude<keyof typeof EMPTY_STATE_STYLES, 'frame'>} EmptyStateVariant
 */

export type EmptyStateVariant = Exclude<keyof typeof EMPTY_STATE_STYLES, 'frame'>

/**
 * Alert styles
 * @type {Object}
 */

export const ALERT_STYLES = {
  frame: 'flex items-start gap-3 rounded-lg border p-4',
  icon: 'mt-0.5 h-5 w-5 shrink-0',
  content: 'flex flex-col gap-1',
  title: 'text-sm font-semibold',
  description: 'text-sm opacity-90',
} as const

/**
 * Spinner sizes
 * @type {Record<Size, string>}
 */

export const SPINNER_SIZES: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9',
}

/**
 * Avatar sizes
 * @type {Record<Size, string>}
 */

export const AVATAR_SIZES: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

/**
 * Avatar pixel sizes
 * @type {Record<Size, number>}
 */

export const AVATAR_PIXELS: Record<Size, number> = { sm: 32, md: 40, lg: 56 }

/**
 * Avatar styles
 * @type {Object}
 */

export const AVATAR_STYLES = {
  frame: `flex shrink-0 items-center justify-center overflow-hidden rounded-pill font-semibold ${TONE_SOFT.primary}`,
  image: 'h-full w-full object-cover',
} as const

/**
 * Progress bar styles
 * @type {Object}
 */

export const PROGRESS_STYLES = {
  track: 'h-2 w-full overflow-hidden rounded-pill bg-surface-strong',
  bar: 'h-full rounded-pill transition-[width] duration-slow ease-out',
} as const

/**
 * Overlay styles
 * @type {Object}
 */

export const OVERLAY_STYLES = {
  backdrop: 'fixed inset-0 bg-overlay/50 backdrop-blur-sm animate-fade-in',
  centered: 'fixed inset-0 flex items-end justify-center p-4 sm:items-center',
  panel: `relative w-full ${SURFACES.raised} shadow-lg animate-slide-up`,
  panelSizes: {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  } satisfies Record<Size, string>,
  header: 'flex items-start justify-between gap-4 border-b border-border px-5 py-4',
  body: 'px-5 py-4',
  footer: 'flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4',
} as const

/**
 * Drawer styles
 * @type {Object}
 */

export const DRAWER_STYLES = {
  panel: `fixed inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background shadow-lg animate-slide-left`,
  header: OVERLAY_STYLES.header,
  body: 'flex-1 overflow-y-auto px-5 py-4',
} as const

/**
 * Tooltip styles
 * @type {Object}
 */

export const TOOLTIP_STYLES = {
  wrapper: 'relative inline-flex',
  bubble:
    'pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity duration-fast group-hover:opacity-100 group-focus-within:opacity-100',
} as const

/**
 * Tab styles
 * @type {Object}
 */

export const TABS_STYLES = {
  list: 'flex gap-1 overflow-x-auto border-b border-border',
  trigger: `-mb-px border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-foreground-muted ${TRANSITION} ${FOCUS_RING} hover:text-foreground`,
  triggerActive: 'border-primary text-foreground',
  panel: 'pt-5 animate-fade-in',
} as const

/**
 * Accordion styles
 * @type {Object}
 */

export const ACCORDION_STYLES = {
  list: 'divide-y divide-border rounded-lg border border-border',
  item: 'group',
  trigger: `flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground ${TRANSITION} ${FOCUS_RING} hover:bg-surface`,
  indicator: `h-4 w-4 shrink-0 text-foreground-subtle ${TRANSITION_ALL} data-[open=true]:rotate-180`,
  panel: 'px-5 pb-4 text-sm text-foreground-muted animate-fade-in',
} as const

/**
 * Table styles
 * @type {Object}
 */

export const TABLE_STYLES = {
  scroller: 'w-full overflow-x-auto',
  table: 'w-full border-collapse text-left text-sm',
  headCell:
    'border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle',
  row: `border-b border-border last:border-0 ${TRANSITION} hover:bg-surface`,
  cell: 'px-4 py-3 text-foreground',
  empty: 'px-4 py-10 text-center',
} as const

/**
 * Pagination styles
 * @type {Object}
 */

export const PAGINATION_STYLES = {
  frame: 'flex flex-wrap items-center justify-between gap-3 pt-1',
  actions: 'flex gap-2',
} as const

/**
 * Navigation header styles
 * @type {Object}
 */

export const NAVIGATION_STYLES = {
  header: `sticky top-0 w-full border-b border-border bg-background/80 backdrop-blur`,
  bar: 'flex h-header items-center justify-between gap-4',
  list: 'hidden items-center gap-1 md:flex',
  link: `rounded-md px-3 py-2 text-sm font-medium text-foreground-muted ${TRANSITION} ${FOCUS_RING} hover:bg-surface hover:text-foreground`,
  linkActive: 'bg-surface-strong text-foreground',
  actions: 'flex items-center gap-2',
  mobileList: 'flex flex-col gap-1',
  mobileLink: `rounded-md px-3 py-2.5 text-base font-medium text-foreground-muted ${TRANSITION} hover:bg-surface hover:text-foreground`,
  brand: `flex items-center gap-2 text-base font-semibold text-foreground ${FOCUS_RING} rounded-md`,
  brandSymbol: `flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold ${TONE_SOFT.primary}`,
} as const

/**
 * Footer styles
 * @type {Object}
 */

export const FOOTER_STYLES = {
  frame: 'border-t border-border bg-surface',
  grid: 'grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4',
  columnTitle: 'text-xs font-semibold uppercase tracking-wider text-foreground-subtle',
  list: 'mt-4 flex flex-col gap-2',
  link: `text-sm text-foreground-muted ${TRANSITION} hover:text-foreground`,
  bottom:
    'flex flex-col gap-3 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between',
  socials: 'flex gap-2',
} as const

/**
 * Toast styles
 * @type {Object}
 */

export const TOAST_STYLES = {
  region:
    'pointer-events-none fixed inset-x-0 bottom-0 flex flex-col items-center gap-2 p-4 sm:items-end',
  toast: `pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-md animate-slide-up`,
} as const

/**
 * Card styles
 * @type {Object}
 */

export const CARD_STYLES = {
  frame: `${SURFACES.card} ${TRANSITION_ALL} overflow-hidden`,
  interactive: 'hover:border-border-strong hover:shadow-md',
  body: 'flex flex-col gap-2 p-5',
  media: 'relative aspect-[4/3] w-full overflow-hidden bg-surface-strong',
  mediaImage: `h-full w-full object-cover ${TRANSITION_ALL} group-hover:scale-105`,
} as const

/**
 * Stat tile styles
 * @type {Object}
 */

export const STAT_STYLES = {
  frame: `${SURFACES.card} flex flex-col gap-1 p-5`,
  value: 'font-display text-3xl font-semibold tracking-tight text-foreground',
  iconTile: `mb-2 flex h-10 w-10 items-center justify-center rounded-md`,
} as const

/**
 * Section styles
 * @type {Object}
 */

export const SECTION_STYLES = {
  header: 'flex flex-col gap-3',
  headerCentered: 'mx-auto max-w-narrow text-center',
  body: 'mt-10',
} as const

/**
 * Layout utilities
 * @type {Object}
 */

export const LAYOUT = {
  page: 'flex min-h-screen flex-col',
  main: 'flex-1',
  container: 'mx-auto w-full px-4 sm:px-6 lg:px-8',
  sectionStack: 'flex flex-col gap-8',
  stack: 'flex flex-col',
  row: 'flex items-center',
  between: 'flex items-center justify-between gap-4',
  center: 'flex items-center justify-center',
  grid: 'grid',
  divider: 'h-px w-full bg-border',
  dividerVertical: 'w-px self-stretch bg-border',
  srOnly: 'sr-only',
} as const

/**
 * Button class generator
 * @param {Object} [options] - Requested appearance
 * @param {ButtonVariant} [options.variant] - Variant declared above
 * @param {Size} [options.size] - Size declared above
 * @param {boolean} [options.fullWidth] - Stretch flag
 * @return {string} - Class list
 */

export const buttonClass = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: { variant?: ButtonVariant; size?: Size; fullWidth?: boolean } = {}): string =>
  [BUTTON_BASE, BUTTON_SIZES[size], BUTTON_VARIANTS[variant], fullWidth ? 'w-full' : '']
    .filter(Boolean)
    .join(' ')

/**
 * Scroll-to-top button styles
 * @type {Object}
 */

export const SCROLL_TO_TOP_STYLES = {
  // Clears the sticky action bar on mobile
  button: `fixed bottom-20 right-6 shadow-md md:bottom-6 ${TRANSITION_ALL}`,
  hidden: 'pointer-events-none translate-y-3 opacity-0',
} as const

/**
 * Sticky action bar styles
 * @type {Object}
 */

export const STICKY_ACTION_BAR_STYLES = {
  frame:
    'fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden',
} as const

/**
 * Consent banner styles
 * @type {Object}
 */

export const CONSENT_BANNER_STYLES = {
  // Clears the sticky action bar on mobile
  frame:
    'fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]',
} as const
