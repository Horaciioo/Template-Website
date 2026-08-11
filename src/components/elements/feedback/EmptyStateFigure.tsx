import type { Styleable } from '@/types/common'

// Documents figure
const Documents = ({ className }: Styleable) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <rect x="18" y="14" width="46" height="60" rx="6" stroke="currentColor" strokeWidth="3" />
    <rect
      x="32"
      y="22"
      width="46"
      height="60"
      rx="6"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      opacity="0.45"
    />
    <path
      d="M42 40h26M42 52h26M42 64h16"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
)

// Search figure
const Search = ({ className }: Styleable) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <circle cx="42" cy="42" r="24" stroke="currentColor" strokeWidth="3" />
    <path d="M60 60l18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 42h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
  </svg>
)

// Message figure
const Message = ({ className }: Styleable) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <path
      d="M16 26a8 8 0 018-8h48a8 8 0 018 8v34a8 8 0 01-8 8H44L28 80V68h-4a8 8 0 01-8-8z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M32 38h32M32 50h20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.55"
    />
  </svg>
)

export const EMPTY_STATE_FIGURES = {
  documents: Documents,
  search: Search,
  message: Message,
} as const

export type EmptyStateFigureName = keyof typeof EMPTY_STATE_FIGURES
