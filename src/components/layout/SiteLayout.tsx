import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { NotificationRegion } from '@/components/structures/feedback/NotificationRegion'
import { ScrollToTop } from '@/components/structures/navigation/ScrollToTop'
import { StickyActionBar } from '@/components/structures/navigation/StickyActionBar'
import { LAYOUT } from '@/declarations/ui/variants'
import { ConfigurationService } from '@/services/ConfigurationService'
import { cn } from '@/utils/classnames'

export interface SiteLayoutProps {
  children: ReactNode
}

const hasStickyActionBar = ConfigurationService.isEnabled('stickyActionBar')

/**
 * Site layout
 * @param {SiteLayoutProps} props - Site layout props
 * @return {JSX.Element} - Rendered layout
 */

export const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div className={LAYOUT.page}>
    <SiteHeader />
    <main className={cn(LAYOUT.main, hasStickyActionBar && 'pb-20 md:pb-0')}>{children}</main>
    <SiteFooter />
    {ConfigurationService.isEnabled('scrollToTop') && <ScrollToTop />}
    {ConfigurationService.isEnabled('notifications') && <NotificationRegion />}
    {hasStickyActionBar && <StickyActionBar />}
  </div>
)
