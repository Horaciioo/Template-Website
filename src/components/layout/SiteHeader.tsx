'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { IconButton } from '@/components/elements/actions/IconButton'
import { Logo } from '@/components/elements/media/Logo'
import { Container } from '@/components/structures/layout/Container'
import { LanguageSwitcher } from '@/components/structures/navigation/LanguageSwitcher'
import { NavigationList } from '@/components/structures/navigation/NavigationList'
import { ThemeSwitcher } from '@/components/structures/navigation/ThemeSwitcher'
import { Drawer } from '@/components/structures/overlays/Drawer'
import { LAYERS } from '@/declarations/ui/tokens'
import { NAVIGATION_STYLES } from '@/declarations/ui/variants'
import { Link, usePathname } from '@/i18n/routing'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NavigationService } from '@/services/NavigationService'
import { ScrollService } from '@/services/ScrollService'
import { cn } from '@/utils/classnames'

/**
 * Site header
 * @return {JSX.Element} - Rendered header
 */

export const SiteHeader = () => {
  const pathname = usePathname()
  const t = useTranslations()
  const navigation = useTranslations('navigation')
  const actions = useTranslations('actions')
  const { isScrolled } = ScrollService.use()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const entries = NavigationService.headerEntries({ pathname, translate: t })
  const callToAction = NavigationService.callToActionRoute()

  return (
    <header className={cn(NAVIGATION_STYLES.header, LAYERS.header, isScrolled && 'shadow-sm')}>
      <Container>
        <div className={NAVIGATION_STYLES.bar}>
          <Link href={NavigationService.pathOf('home')} className={NAVIGATION_STYLES.brand}>
            <Logo />
          </Link>

          <nav aria-label={navigation('primary')} className={NAVIGATION_STYLES.list}>
            <NavigationList entries={entries} />
          </nav>

          <div className={NAVIGATION_STYLES.actions}>
            {ConfigurationService.isEnabled('languageSwitcher') && (
              <LanguageSwitcher className="hidden sm:flex" />
            )}
            {ConfigurationService.isEnabled('themeSwitcher') && <ThemeSwitcher />}
            <ActionLink route={callToAction} size="sm" className="hidden md:inline-flex">
              {actions(callToAction)}
            </ActionLink>
            <IconButton
              icon="menu"
              label={actions('open')}
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      </Container>

      <Drawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        name="navigation"
        title={navigation('primary')}
        closeLabel={actions('close')}>
        <NavigationList
          entries={entries}
          direction="vertical"
          withIcons
          onNavigate={() => setIsMenuOpen(false)}
        />
        <div className="mt-6 flex flex-col gap-3">
          <ActionLink route={callToAction} fullWidth>
            {actions(callToAction)}
          </ActionLink>
          {ConfigurationService.isEnabled('languageSwitcher') && <LanguageSwitcher />}
        </div>
      </Drawer>
    </header>
  )
}
