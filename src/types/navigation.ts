import type { ActionName } from '@/declarations/naming'
import type { ROUTES } from '@/declarations/routes'
import type { IconName } from '@/declarations/ui/icons'
import type { RegistryKey } from '@/types/common'

/**
 * Declared route identifier
 * @typedef {RegistryKey<typeof ROUTES>} RouteId
 */

export type RouteId = RegistryKey<typeof ROUTES>

/**
 * Route declaration
 * @typedef RouteDeclaration
 * @property {string} path - Route path
 * @property {IconName} [icon] - Navigation icon
 * @property {boolean} [indexable] - Sitemap indexing
 * @property {ActionName} [ctaAction] - Label when used as a CTA target
 */

export interface RouteDeclaration {
  // Route path
  path: string
  icon?: IconName
  // Sitemap indexing
  indexable?: boolean
  // CTA label action
  ctaAction?: ActionName
}

/**
 * Navigation entry
 * @typedef NavigationEntry
 * @property {RouteId} id - Route ID
 * @property {string} href - Pathname
 * @property {string} label - Display label
 * @property {IconName} [icon] - Navigation icon
 * @property {boolean} isActive - Current route flag
 */

export interface NavigationEntry {
  id: RouteId
  href: string
  label: string
  icon?: IconName
  isActive: boolean
}

/**
 * Breadcrumb entry
 * @typedef BreadcrumbEntry
 * @property {string} href - Link target
 * @property {string} label - Display text
 */

export interface BreadcrumbEntry {
  href: string
  label: string
}

/**
 * Postal address
 * @typedef PostalAddress
 * @property {string} street - Street line
 * @property {string} postalCode - Postal code
 * @property {string} city - City
 * @property {string} country - Country code
 */

export interface PostalAddress {
  street: string
  postalCode: string
  city: string
  country: string
}
