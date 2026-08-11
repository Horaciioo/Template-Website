import type { RouteId } from '@/types/navigation'

/**
 * Page metadata input
 * @typedef PageMetadataInput
 * @property {RouteId} routeId - Route identifier
 * @property {string} locale - Active locale
 * @property {string} [title] - Dynamic page title
 * @property {string} [description] - Meta description
 * @property {string} [image] - OG image
 * @property {boolean} [noIndex] - Noindex flag
 */

export interface PageMetadataInput {
  routeId: RouteId
  locale: string
  // Dynamic page title
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

/**
 * Structured data input
 * @typedef StructuredDataInput
 * @property {string} locale - Active locale
 * @property {string} path - Page pathname
 */

export interface StructuredDataInput {
  locale: string
  path: string
}
