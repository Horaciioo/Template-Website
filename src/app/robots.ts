import type { MetadataRoute } from 'next'

import { ConfigurationService } from '@/services/ConfigurationService'
import { EnvironmentService } from '@/services/EnvironmentService'

/**
 * Robots metadata
 * @return {MetadataRoute.Robots} - Robots config
 */

export default function robots(): MetadataRoute.Robots {
  const { index } = ConfigurationService.seo.robots

  return {
    rules: { userAgent: '*', [index ? 'allow' : 'disallow']: '/' },
    sitemap: EnvironmentService.absoluteUrl('/sitemap.xml'),
  }
}
