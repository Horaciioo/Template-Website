import type { Metadata } from 'next'

import { ConfigurationService } from '@/services/ConfigurationService'
import { I18nService } from '@/services/I18nService'
import { NavigationService } from '@/services/NavigationService'
import type { Translate } from '@/services/NavigationService'
import { Service } from '@/structures/Service'
import type { RouteId } from '@/types/navigation'

const { seo, site, identity, environment } = ConfigurationService

// Verification tokens
const bingToken: string | null = seo.verification.bing
const googleToken: string | null = seo.verification.google
const twitterHandle: string | null = seo.twitterHandle

// Localized path
const localizedPath = (locale: string, path: string): string =>
  locale === I18nService.defaultLocale ? path : `${`/${locale}`}${path === '/' ? '' : path}`

class SeoServiceClass extends Service {
  /**
   * Route metadata
   * @param {Object} input - Page context
   * @param {RouteId} input.routeId - Route ID
   * @param {string} input.locale - Locale
   * @param {Translate} input.translate - Translate function
   * @return {Metadata} - Metadata
   */

  buildMetadata = ({
    routeId,
    locale,
    translate,
  }: {
    routeId: RouteId
    locale: string
    translate: Translate
  }): Metadata => {
    const key = NavigationService.keyOf(routeId)
    const path = NavigationService.pathOf(routeId)
    const title = translate(`${key}.metaTitle`)
    const description = translate(`${key}.metaDescription`)
    const canonical = environment.absoluteUrl(localizedPath(locale, path))
    const isIndexable =
      NavigationService.declarationOf(routeId).indexable !== false &&
      seo.robots.index &&
      !environment.seo.noindex

    return {
      title,
      description,
      metadataBase: new URL(environment.site.url),
      alternates: {
        canonical,
        languages: Object.fromEntries(
          I18nService.locales.map((alternate) => [
            alternate,
            environment.absoluteUrl(localizedPath(alternate, path)),
          ])
        ),
      },
      openGraph: {
        type: 'website',
        siteName: site.name,
        locale,
        title,
        description,
        url: canonical,
        images: [environment.absoluteUrl(seo.defaultImage)],
      },
      twitter: {
        card: 'summary_large_image',
        site: twitterHandle ?? undefined,
        title,
        description,
      },
      robots: { index: isIndexable, follow: seo.robots.follow },
      verification: {
        google: googleToken ?? undefined,
        other: bingToken ? { 'msvalidate.01': bingToken } : undefined,
      },
    }
  }

  /**
   * Root metadata
   * @return {Metadata} - Metadata
   */

  buildRootMetadata = (): Metadata => ({
    title: { default: site.name, template: seo.titleTemplate },
    applicationName: site.name,
    metadataBase: new URL(environment.site.url),
  })

  /**
   * Organization schema
   * @param {string} locale - Locale
   * @return {Record<string, unknown>} - Schema
   */

  buildOrganizationSchema = (locale: string): Record<string, unknown> => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: identity.legalName,
    alternateName: identity.tradeName,
    url: environment.absoluteUrl(localizedPath(locale, NavigationService.pathOf('home'))),
    email: identity.email,
    telephone: identity.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: identity.address.street,
      postalCode: identity.address.postalCode,
      addressLocality: identity.address.city,
      addressCountry: identity.address.country,
    },
    sameAs: ConfigurationService.socialLinks().map((link) => link.href),
  })

  /**
   * Localized URL
   * @param {string} locale - Locale
   * @param {string} path - Path
   * @return {string} - URL
   */

  absoluteUrlOf = (locale: string, path: string): string =>
    environment.absoluteUrl(localizedPath(locale, path))
}

// Page metadata builder
export const SeoService = new SeoServiceClass('seo')
