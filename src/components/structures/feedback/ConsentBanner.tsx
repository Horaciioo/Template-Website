'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/elements/actions/Button'
import { Text } from '@/components/elements/typography/Text'
import { Container } from '@/components/structures/layout/Container'
import { LAYERS } from '@/declarations/ui/tokens'
import { CONSENT_BANNER_STYLES } from '@/declarations/ui/variants'
import { Link } from '@/i18n/routing'
import { ConfigurationService } from '@/services/ConfigurationService'
import { ConsentService } from '@/services/ConsentService'
import { NavigationService } from '@/services/NavigationService'
import { cn } from '@/utils/classnames'

const hasStickyActionBar = ConfigurationService.isEnabled('stickyActionBar')

/**
 * Cookie consent banner
 * @return {JSX.Element | null} - Rendered banner
 */

export const ConsentBanner = () => {
  const status = ConsentService.use()
  const t = useTranslations('consent')
  const actions = useTranslations('actions')

  if (status !== 'pending') return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
      className={cn(
        CONSENT_BANNER_STYLES.frame,
        LAYERS.toast,
        hasStickyActionBar && 'bottom-20 md:bottom-0'
      )}>
      <Container>
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Text appearance="blockTitle" as="p">
              {t('title')}
            </Text>
            <Text appearance="description">
              {t('description')}{' '}
              <Link href={NavigationService.pathOf('privacyPolicy')} className="underline">
                {t('privacyLink')}
              </Link>
            </Text>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" onClick={ConsentService.deny}>
              {actions('decline')}
            </Button>
            <Button onClick={ConsentService.grant}>{actions('accept')}</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
