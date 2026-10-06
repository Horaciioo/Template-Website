import type { ComponentType, SVGProps } from 'react'

/**
 * Glyph component
 * @typedef {ComponentType<SVGProps<SVGSVGElement>>} IconComponent
 */

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

// Shared stroke attributes
const STROKE_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/**
 * Instagram glyph
 * @param {SVGProps<SVGSVGElement>} props - SVG props
 * @return {JSX.Element} - Glyph
 */

export const InstagramGlyph: IconComponent = (props) => (
  <svg {...STROKE_PROPS} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

/**
 * LinkedIn glyph
 * @param {SVGProps<SVGSVGElement>} props - SVG props
 * @return {JSX.Element} - Glyph
 */

export const LinkedinGlyph: IconComponent = (props) => (
  <svg {...STROKE_PROPS} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

/**
 * Facebook glyph
 * @param {SVGProps<SVGSVGElement>} props - SVG props
 * @return {JSX.Element} - Glyph
 */

export const FacebookGlyph: IconComponent = (props) => (
  <svg {...STROKE_PROPS} {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

/**
 * YouTube glyph
 * @param {SVGProps<SVGSVGElement>} props - SVG props
 * @return {JSX.Element} - Glyph
 */

export const YoutubeGlyph: IconComponent = (props) => (
  <svg {...STROKE_PROPS} {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
)

/**
 * GitHub glyph
 * @param {SVGProps<SVGSVGElement>} props - SVG props
 * @return {JSX.Element} - Glyph
 */

export const GithubGlyph: IconComponent = (props) => (
  <svg {...STROKE_PROPS} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

/**
 * X glyph
 * @param {SVGProps<SVGSVGElement>} props - SVG props
 * @return {JSX.Element} - Glyph
 */

export const XGlyph: IconComponent = (props) => (
  <svg {...STROKE_PROPS} {...props}>
    <path d="M4 4l11.7 16H20L8.3 4H4z" />
    <path d="M4 20l6.8-6.8M13.2 10.8L20 4" />
  </svg>
)
