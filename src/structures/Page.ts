import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { LoggerService } from '@/services/LoggerService'
import { SeoService } from '@/services/SeoService'
import type { Translate } from '@/services/NavigationService'
import type { RouteId } from '@/types/navigation'

export interface PageMetadataContext {
  locale: string
  translate: Translate
}

export interface PageRenderContext {
  translate: Translate
  breadcrumb?: ReactNode
  action?: ReactNode
}

// Technical base
export abstract class Page {
  protected readonly routeId: RouteId

  /**
   * @param {RouteId} routeId - Declared route
   */

  constructor(routeId: RouteId) {
    this.routeId = routeId
  }

  /**
   * SEO builder
   * @return {typeof SeoService} - SEO service
   */

  protected get seo(): typeof SeoService {
    return SeoService
  }

  /**
   * Scoped logger
   * @return {typeof LoggerService} - Logger
   */

  protected get logger(): typeof LoggerService {
    return LoggerService
  }

  /**
   * Route metadata
   * @param {PageMetadataContext} context - Locale and translate
   * @return {Promise<Metadata>} - Metadata
   */

  async metadata(context: PageMetadataContext): Promise<Metadata> {
    return this.seo.buildMetadata({
      routeId: this.routeId,
      locale: context.locale,
      translate: context.translate,
    })
  }

  /**
   * Page body, override per route
   * @param {PageRenderContext} _context - Translate
   * @return {ReactNode} - Rendered body
   */

  render(_context: PageRenderContext): ReactNode {
    this.logger.warn(`page.${this.routeId}`, 'render not implemented')

    return null
  }
}
