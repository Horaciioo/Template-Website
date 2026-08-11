import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { NotificationRegion } from '@/components/structures/feedback/NotificationRegion'
import { ScrollToTop } from '@/components/structures/navigation/ScrollToTop'
import { LAYOUT } from '@/declarations/ui/variants'
import { ConfigurationService } from '@/services/ConfigurationService'

export interface SiteLayoutProps {
  children: ReactNode
}

/**
 * Site layout
 * @param {SiteLayoutProps} props - Site layout props
 * @return {JSX.Element} - Rendered layout
 */

export const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div className={LAYOUT.page}>
    <SiteHeader />
    <main className={LAYOUT.main}>{children}</main>
    <SiteFooter />
    {ConfigurationService.isEnabled('scrollToTop') && <ScrollToTop />}
    {ConfigurationService.isEnabled('notifications') && <NotificationRegion />}
  </div>
)
