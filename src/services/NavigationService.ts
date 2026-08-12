import { ROUTES, SECTION_ANCHORS } from '@/declarations/routes'
import type { ActionName } from '@/declarations/naming'
import { NamingService } from '@/services/NamingService'
import { Service } from '@/structures/Service'
import type {
  BreadcrumbEntry,
  NavigationEntry,
  PostalAddress,
  RouteDeclaration,
  RouteId,
} from '@/types/navigation'

// Translation function
export type Translate = (key: string) => string

// Unwrap frozen registry
const declarationOf = (id: RouteId): RouteDeclaration => ROUTES[id]

const isActivePath = (pathname: string, path: string): boolean =>
  path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)

// Single-line query text
const addressQueryOf = (address: PostalAddress): string =>
  `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`

class NavigationServiceClass extends Service {
  /**
   * Route pathname
   * @param {RouteId} id - Route ID
   * @return {string} - Pathname
   */

  pathOf = (id: RouteId): string => declarationOf(id).path

  /**
   * Route declaration
   * @param {RouteId} id - Route ID
   * @return {RouteDeclaration} - Declaration
   */

  declarationOf = declarationOf

  /**
   * Route key
   * @param {RouteId} id - Route ID
   * @return {string} - Key
   */

  keyOf = (id: RouteId): string => NamingService.toTranslationKey('routes', id)

  /**
   * Anchor href
   * @param {keyof typeof SECTION_ANCHORS} anchor - Anchor ID
   * @return {string} - Href
   */

  anchorOf = (anchor: keyof typeof SECTION_ANCHORS): string => `#${SECTION_ANCHORS[anchor]}`

  /**
   * Email link
   * @param {string} email - Email address
   * @return {string} - Link
   */

  mailtoOf = (email: string): string => `mailto:${email}`

  /**
   * Phone link
   * @param {string} phone - Phone number
   * @return {string} - Link
   */

  telOf = (phone: string): string => `tel:${phone}`

  /**
   * Navigation entries
   * @param {RouteId[]} ids - Route IDs
   * @param {Object} context - Context
   * @param {string} context.pathname - Pathname
   * @param {Translate} context.translate - Translate
   * @return {NavigationEntry[]} - Entries
   */

  buildEntries = (
    ids: readonly RouteId[],
    context: { pathname: string; translate: Translate }
  ): NavigationEntry[] =>
    ids.map((id) => ({
      id,
      href: declarationOf(id).path,
      label: context.translate(`${this.keyOf(id)}.label`),
      icon: declarationOf(id).icon,
      isActive: isActivePath(context.pathname, declarationOf(id).path),
    }))

  /**
   * Header entries
   * @param {Object} context - Context
   * @param {string} context.pathname - Pathname
   * @param {Translate} context.translate - Translate
   * @return {NavigationEntry[]} - Entries
   */

  headerEntries = (context: { pathname: string; translate: Translate }): NavigationEntry[] =>
    this.buildEntries(this.config.navigation.header as RouteId[], context)

  /**
   * Footer columns
   * @param {Object} context - Context
   * @param {string} context.pathname - Pathname
   * @param {Translate} context.translate - Translate
   * @return {Object[]} - Columns
   */

  footerColumns = (context: {
    pathname: string
    translate: Translate
  }): { id: string; entries: NavigationEntry[] }[] =>
    Object.entries(this.config.navigation.footer).map(([id, ids]) => ({
      id,
      entries: this.buildEntries(ids as RouteId[], context),
    }))

  /**
   * CTA route
   * @return {RouteId} - Route ID
   */

  callToActionRoute = (): RouteId => this.config.navigation.callToAction as RouteId

  /**
   * CTA action name
   * @param {RouteId} id - Route ID
   * @return {ActionName} - Action name
   */

  ctaActionOf = (id: RouteId): ActionName => {
    const action = declarationOf(id).ctaAction

    if (action) return action

    this.logger.warn('ctaActionOf', { id })

    return 'submit'
  }

  /**
   * Route breadcrumb
   * @param {RouteId} id - Route ID
   * @param {Translate} translate - Translate
   * @return {BreadcrumbEntry[]} - Trail
   */

  breadcrumbOf = (id: RouteId, translate: Translate): BreadcrumbEntry[] => {
    const home = {
      href: declarationOf('home').path,
      label: translate(`${this.keyOf('home')}.label`),
    }
    if (id === 'home') return [home]

    return [home, { href: declarationOf(id).path, label: translate(`${this.keyOf(id)}.label`) }]
  }

  /**
   * Indexable routes
   * @return {RouteId[]} - Routes
   */

  indexableRoutes = (): RouteId[] =>
    (Object.keys(ROUTES) as RouteId[]).filter((id) => declarationOf(id).indexable !== false)

  /**
   * Keyless embed URL
   * @param {PostalAddress} address - Location
   * @return {string} - Embed src
   */

  mapEmbedUrlOf = (address: PostalAddress): string =>
    `https://www.google.com/maps?q=${encodeURIComponent(addressQueryOf(address))}&output=embed`

  /**
   * Directions URL
   * @param {PostalAddress} address - Destination
   * @return {string} - Directions link
   */

  mapDirectionsUrlOf = (address: PostalAddress): string =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressQueryOf(address))}`
}

// Route navigation entries
export const NavigationService: NavigationServiceClass = new NavigationServiceClass('navigation')
