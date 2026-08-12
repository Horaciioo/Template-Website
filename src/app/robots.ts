import type { MetadataRoute } from 'next'

import { ConfigurationService } from '@/services/ConfigurationService'

/**
 * Robots metadata
 * @return {MetadataRoute.Robots} - Robots config
 */

export default function robots(): MetadataRoute.Robots {
  const { environment, seo } = ConfigurationService
  const index = seo.robots.index && !environment.seo.noindex

  return {
    rules: { userAgent: '*', [index ? 'allow' : 'disallow']: '/' },
    sitemap: environment.absoluteUrl('/sitemap.xml'),
  }
}
