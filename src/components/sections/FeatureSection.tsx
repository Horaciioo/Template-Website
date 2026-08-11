'use client'

import { useTranslations } from 'next-intl'

import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import { Card } from '@/components/structures/layout/Card'
import { Grid } from '@/components/structures/layout/Grid'
import { Section } from '@/components/structures/layout/Section'
import { FEATURES } from '@/declarations/content'
import { TONE_SOFT } from '@/declarations/ui/tokens'
import { STAT_STYLES } from '@/declarations/ui/variants'
import type { FeatureItem } from '@/types/content'
import { cn } from '@/utils/classnames'

export interface FeatureSectionProps {
  items?: FeatureItem[]
}

/**
 * Feature section
 * @param {FeatureSectionProps} props - Feature section props
 * @return {JSX.Element} - Rendered section
 */

export const FeatureSection = ({ items = FEATURES }: FeatureSectionProps) => {
  const t = useTranslations('sections.features')

  return (
    <Section
      anchor="features"
      overline={t('overline')}
      title={t('title')}
      description={t('description')}
      centered>
      <Grid columns={3}>
        {items.map((item) => (
          <Card key={item.id}>
            <span className={cn(STAT_STYLES.iconTile, TONE_SOFT[item.tone ?? 'primary'])}>
              <Icon name={item.icon} size="sm" />
            </span>
            <Text appearance="blockTitle" as="h3">
              {t(`items.${item.translationKey}.title`)}
            </Text>
            <Text appearance="description">{t(`items.${item.translationKey}.description`)}</Text>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}
