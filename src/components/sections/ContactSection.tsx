'use client'

import { useTranslations } from 'next-intl'

import { Badge } from '@/components/elements/data/Badge'
import { FormRenderer } from '@/components/elements/forms/FormRenderer'
import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import { LocationMap } from '@/components/structures/layout/LocationMap'
import { Section } from '@/components/structures/layout/Section'
import { PROMISES } from '@/declarations/content'
import type { IconName } from '@/declarations/ui/icons'
import { FOOTER_STYLES } from '@/declarations/ui/variants'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NavigationService } from '@/services/NavigationService'

const { identity } = ConfigurationService

// Contact channels
const CHANNELS: { id: string; icon: IconName; value: string; href: string }[] = [
  {
    id: 'email',
    icon: 'mail',
    value: identity.email,
    href: NavigationService.mailtoOf(identity.email),
  },
  {
    id: 'phone',
    icon: 'phone',
    value: identity.phone,
    href: NavigationService.telOf(identity.phone),
  },
  {
    id: 'address',
    icon: 'location',
    value: `${identity.address.street}, ${identity.address.postalCode} ${identity.address.city}`,
    href: '',
  },
]

/**
 * Contact section
 * @return {JSX.Element} - Rendered section
 */

export const ContactSection = () => {
  const t = useTranslations('sections.contact')
  const actions = useTranslations('actions')

  return (
    <Section overline={t('overline')} title={t('title')} description={t('description')}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            {CHANNELS.map((channel) => (
              <li key={channel.id} className="flex items-start gap-3">
                <Icon name={channel.icon} size="sm" className="mt-0.5 text-primary" />
                <div>
                  <Text appearance="label" as="p">
                    {t(`channels.${channel.id}`)}
                  </Text>
                  {channel.href ? (
                    <a href={channel.href} className={FOOTER_STYLES.link}>
                      {channel.value}
                    </a>
                  ) : (
                    <Text appearance="description">{channel.value}</Text>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {PROMISES.map((item) => (
              <Badge key={item.id} icon={item.icon} tone={item.tone}>
                {t(`promises.${item.translationKey}.label`)}
              </Badge>
            ))}
          </div>

          {ConfigurationService.isEnabled('locationMap') && (
            <LocationMap title={t('map.title')} directionsLabel={actions('getDirections')} />
          )}
        </div>
        <FormRenderer id="contact" />
      </div>
    </Section>
  )
}
