'use client'

import { useLocale, useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { Badge } from '@/components/elements/data/Badge'
import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import { Card } from '@/components/structures/layout/Card'
import { Grid } from '@/components/structures/layout/Grid'
import { Section } from '@/components/structures/layout/Section'
import { PRICING } from '@/declarations/content'
import { FormatService } from '@/services/FormatService'
import { NavigationService } from '@/services/NavigationService'
import type { PricingItem } from '@/types/content'
import { cn } from '@/utils/classnames'

export interface PricingSectionProps {
  items?: PricingItem[]
}

/**
 * Pricing section
 * @param {PricingSectionProps} props - Pricing section props
 * @return {JSX.Element} - Rendered section
 */

export const PricingSection = ({ items = PRICING }: PricingSectionProps) => {
  const t = useTranslations('sections.pricing')
  const actions = useTranslations('actions')
  const format = FormatService.for(useLocale())
  const route = NavigationService.callToActionRoute()

  return (
    <Section
      anchor="pricing"
      overline={t('overline')}
      title={t('title')}
      description={t('description')}
      centered>
      <Grid columns={3}>
        {items.map((item) => {
          const price = format.currencyParts(item.amountCents)

          return (
            <Card
              key={item.id}
              className={cn('flex flex-col', item.featured && 'border-primary shadow-md')}>
              <div className="flex items-center justify-between gap-2">
                <Text appearance="blockTitle" as="h3">
                  {t(`items.${item.translationKey}.name`)}
                </Text>
                {item.featured && (
                  <Badge tone="primary" icon="star">
                    {t('featured')}
                  </Badge>
                )}
              </div>
              <Text appearance="description">{t(`items.${item.translationKey}.description`)}</Text>
              <p className="flex items-baseline gap-1 pt-2">
                <span className="font-display text-3xl font-semibold text-foreground">
                  {price.amount}
                </span>
                <span className="text-sm text-foreground-muted">{price.symbol}</span>
                {item.period && (
                  <span className="text-sm text-foreground-subtle">
                    {t(`periods.${item.period}`)}
                  </span>
                )}
              </p>
              <ul className="flex flex-col gap-2 py-4">
                {item.includedKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-foreground-muted">
                    <Icon name="check" size="xs" className="mt-1 text-success" />
                    {t(`included.${key}`)}
                  </li>
                ))}
              </ul>
              <ActionLink
                route={route}
                variant={item.featured ? 'primary' : 'secondary'}
                fullWidth
                className="mt-auto">
                {actions(NavigationService.ctaActionOf(route))}
              </ActionLink>
            </Card>
          )
        })}
      </Grid>
    </Section>
  )
}
