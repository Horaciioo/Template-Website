'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/elements/actions/Button'
import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import { Modal } from '@/components/structures/overlays/Modal'
import type { ConsentCategory } from '@/declarations/analytics'
import type { IconName } from '@/declarations/ui/icons'
import { LAYERS } from '@/declarations/ui/tokens'
import { CONSENT_STYLES, FIELD_STYLES } from '@/declarations/ui/variants'
import { Link } from '@/i18n/routing'
import { ConsentService } from '@/services/ConsentService'
import { NamingService } from '@/services/NamingService'
import { NavigationService } from '@/services/NavigationService'
import type { ConsentPreferences } from '@/types/consent'
import { cn } from '@/utils/classnames'

// One glyph per declared category, extend when a new category is added
const CATEGORY_ICONS: Record<ConsentCategory, IconName> = {
  necessary: 'shield',
  analytics: 'trend',
}

/**
 * Cookie preferences bubble and dialog
 * @return {JSX.Element | null} - Rendered manager
 */

export const ConsentManager = () => {
  const { preferences } = ConsentService.use()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<ConsentPreferences>(preferences)
  const t = useTranslations('consent')
  const actions = useTranslations('actions')
  const categories = ConsentService.categories()

  if (!ConsentService.hasChoices()) return null

  // Seeds toggles on open
  const open = () => {
    setDraft(preferences)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const toggle = (category: ConsentCategory) =>
    setDraft((current) => ({ ...current, [category]: !current[category] }))

  const commit = (save: () => void) => {
    save()
    close()
  }

  return (
    <>
      <button
        type="button"
        aria-label={actions('manageCookies')}
        title={actions('manageCookies')}
        className={cn(CONSENT_STYLES.trigger, LAYERS.dropdown)}
        onClick={open}>
        <Image
          src="/cookies/cookie.png"
          alt=""
          width={512}
          height={512}
          className={CONSENT_STYLES.triggerImage}
        />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        name="consent"
        size="md"
        title={t('title')}
        closeLabel={actions('close')}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => commit(ConsentService.deny)}>
              {t('actions.declineAll')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => commit(() => ConsentService.save(draft))}>
              {t('actions.saveChoices')}
            </Button>
            <Button size="sm" onClick={() => commit(ConsentService.grant)}>
              {t('actions.acceptAll')}
            </Button>
          </>
        }>
        <div className={CONSENT_STYLES.body}>
          <Text appearance="description">
            {t('description')}{' '}
            <Link href={NavigationService.pathOf('privacyPolicy')} className="underline">
              {t('privacyLink')}
            </Link>
          </Text>

          <div className={CONSENT_STYLES.categories}>
            {categories.map((category) => {
              const labelId = NamingService.toDomId('consent', category, 'label')
              const isRequired = ConsentService.isRequired(category)
              const checked = draft[category]

              return (
                <div key={category} className={CONSENT_STYLES.category}>
                  <span className={CONSENT_STYLES.categoryIcon}>
                    <Icon name={CATEGORY_ICONS[category]} size="sm" />
                  </span>

                  <div className={CONSENT_STYLES.categoryBody}>
                    <p id={labelId} className={CONSENT_STYLES.categoryLabel}>
                      {t(`categories.${category}.label`)}
                      {isRequired && (
                        <span className={CONSENT_STYLES.lock}> · {t('required')}</span>
                      )}
                    </p>
                    <Text appearance="meta">{t(`categories.${category}.description`)}</Text>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-labelledby={labelId}
                    data-checked={checked}
                    disabled={isRequired}
                    className={FIELD_STYLES.switchTrack}
                    onClick={() => toggle(category)}>
                    <span data-checked={checked} className={FIELD_STYLES.switchThumb} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>
    </>
  )
}
