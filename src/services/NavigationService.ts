import { ROUTES, SECTION_ANCHORS } from '@/declarations/routes'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NamingService } from '@/services/NamingService'
import type {
  BreadcrumbEntry,
  NavigationEntry,
  RouteDeclaration,
  RouteId,
} from '@/types/navigation'

// Translate function of the active locale, passed in so this service stays usable on both sides
export type Translate = (key: string) => string

// Widens the frozen registry entry back to its declaration, so the optional flags stay readable
const declarationOf = (id: RouteId): RouteDeclaration => ROUTES[id]

const isActivePath = (pathname: string, path: string): boolean =>
  path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)

// Route navigation entries
export const NavigationService = {
  /**
   * Read the pathname of a route
   * @param {RouteId} id - Route declared in declarations/routes.ts
   * @return {string} - Pathname without the locale prefix
   */

  pathOf: (id: RouteId): string => declarationOf(id).path,

  /**
   * Read the declaration of a route, the widened shape carrying its optional flags
   * @param {RouteId} id - Route declared in declarations/routes.ts
   * @return {RouteDeclaration} - Path, icon and indexing flag
   */

  declarationOf,

  /**
   * Build the translation key of a route, the root of its label and of its metadata
   * @param {RouteId} id - Route declared in declarations/routes.ts
   * @return {string} - Dotted translation key
   */

  keyOf: (id: RouteId): string => NamingService.toTranslationKey('routes', id),

  /**
   * Build the href of a section anchor of the current page
   * @param {keyof typeof SECTION_ANCHORS} anchor - Anchor declared in declarations/routes.ts
   * @return {string} - Hash href
   */

  anchorOf: (anchor: keyof typeof SECTION_ANCHORS): string => `#${SECTION_ANCHORS[anchor]}`,

  /**
   * Build an e-mail link
   * @param {string} email - Address declared in configurations/identity.json
   * @return {string} - mailto href
   */

  mailtoOf: (email: string): string => `mailto:${email}`,

  /**
   * Build a phone link
   * @param {string} phone - Number declared in configurations/identity.json
   * @return {string} - tel href
   */

  telOf: (phone: string): string => `tel:${phone}`,

  /**
   * Build the entries of a navigation group
   * @param {RouteId[]} ids - Routes to render, in order
   * @param {Object} context - Rendering context
   * @param {string} context.pathname - Current pathname
   * @param {Translate} context.translate - Translate function
   * @return {NavigationEntry[]}
   */

  buildEntries: (
    ids: readonly RouteId[],
    context: { pathname: string; translate: Translate }
  ): NavigationEntry[] =>
    ids.map((id) => ({
      id,
      href: declarationOf(id).path,
      label: context.translate(`${NavigationService.keyOf(id)}.label`),
      icon: declarationOf(id).icon,
      isActive: isActivePath(context.pathname, declarationOf(id).path),
    })),

  /**
   * Build the header entries declared in configurations/navigation.json
   * @param {Object} context - Rendering context
   * @param {string} context.pathname - Current pathname, without the locale prefix
   * @param {Translate} context.translate - Translate function of the active locale
   * @return {NavigationEntry[]} - Header entries
   */

  headerEntries: (context: { pathname: string; translate: Translate }): NavigationEntry[] =>
    NavigationService.buildEntries(ConfigurationService.navigation.header as RouteId[], context),

  /**
   * Build the footer columns declared in configurations/navigation.json
   * @param {Object} context - Rendering context
   * @param {string} context.pathname - Current pathname, without the locale prefix
   * @param {Translate} context.translate - Translate function of the active locale
   * @return {Object[]} - Columns carrying their own translation key and entries
   */

  footerColumns: (context: {
    pathname: string
    translate: Translate
  }): { id: string; entries: NavigationEntry[] }[] =>
    Object.entries(ConfigurationService.navigation.footer).map(([id, ids]) => ({
      id,
      entries: NavigationService.buildEntries(ids as RouteId[], context),
    })),

  /**
   * Route the main call to action of the site points at
   * @return {RouteId} - Route declared in configurations/navigation.json
   */

  callToActionRoute: (): RouteId => ConfigurationService.navigation.callToAction as RouteId,

  /**
   * Build the breadcrumb of a route, the home entry always opening the trail
   * @param {RouteId} id - Current route
   * @param {Translate} translate - Translate function of the active locale
   * @return {BreadcrumbEntry[]} - Trail from the home page to the current route
   */

  breadcrumbOf: (id: RouteId, translate: Translate): BreadcrumbEntry[] => {
    const home = {
      href: declarationOf('home').path,
      label: translate(`${NavigationService.keyOf('home')}.label`),
    }
    if (id === 'home') return [home]

    return [
      home,
      { href: declarationOf(id).path, label: translate(`${NavigationService.keyOf(id)}.label`) },
    ]
  },

  /**
   * Routes exposed to search engines, the source of the sitemap
   * @return {RouteId[]} - Indexable routes
   */

  indexableRoutes: (): RouteId[] =>
    (Object.keys(ROUTES) as RouteId[]).filter((id) => declarationOf(id).indexable !== false),
} as const
