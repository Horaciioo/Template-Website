import type { RouteDeclaration } from '@/types/navigation'

/**
 * Site routes
 * @type {Object}
 */

export const ROUTES = {
  home: { path: '/', icon: 'home' },
  showcase: { path: '/showcase', icon: 'sparkles' },
  contact: { path: '/contact', icon: 'mail' },
  legalNotice: { path: '/legal-notice', icon: 'scale' },
  privacyPolicy: { path: '/privacy-policy', icon: 'shield' },
} as const satisfies Record<string, RouteDeclaration>

/**
 * Section anchors
 * @type {Object}
 */

export const SECTION_ANCHORS = {
  hero: 'hero',
  features: 'features',
  stats: 'stats',
  gallery: 'gallery',
  pricing: 'pricing',
  testimonials: 'testimonials',
  faq: 'faq',
  callToAction: 'call-to-action',
} as const
