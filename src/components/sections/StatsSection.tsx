'use client'

import { useLocale, useTranslations } from 'next-intl'

import { StatTile } from '@/components/elements/data/StatTile'
import { Grid } from '@/components/structures/layout/Grid'
import { Section } from '@/components/structures/layout/Section'
import { STATS } from '@/declarations/content'
import { FormatService } from '@/services/FormatService'
import type { StatItem } from '@/types/content'

export interface StatsSectionProps {
  items?: StatItem[]
}

/**
 * Stats section
 * @param {StatsSectionProps} props - Stats section props
 * @return {JSX.Element} - Rendered section
 */

export const StatsSection = ({ items = STATS }: StatsSectionProps) => {
  const t = useTranslations('sections.stats')
  const format = FormatService.for(useLocale())

  const render = (item: StatItem): string => {
    if (item.format === 'currency') return format.currency(item.value)
    if (item.format === 'percent') return format.percent(item.value)

    return format.number(item.value, 0)
  }

  return (
    <Section anchor="stats" title={t('title')} description={t('description')} centered spacing="sm">
      <Grid columns={4}>
        {items.map((item) => (
          <StatTile
            key={item.id}
            value={render(item)}
            label={t(`items.${item.translationKey}.label`)}
            icon={item.icon}
          />
        ))}
      </Grid>
    </Section>
  )
}
