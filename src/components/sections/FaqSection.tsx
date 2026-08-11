'use client'

import { useTranslations } from 'next-intl'

import { Accordion } from '@/components/structures/overlays/Accordion'
import { Section } from '@/components/structures/layout/Section'
import { FAQ } from '@/declarations/content'
import type { FaqItem } from '@/types/content'

export interface FaqSectionProps {
  items?: FaqItem[]
}

/**
 * FAQ section
 * @param {FaqSectionProps} props - FAQ section props
 * @return {JSX.Element} - Rendered section
 */

export const FaqSection = ({ items = FAQ }: FaqSectionProps) => {
  const t = useTranslations('sections.faq')

  return (
    <Section anchor="faq" overline={t('overline')} title={t('title')} centered width="narrow">
      <Accordion
        name="faq"
        entries={items.map((item) => ({
          id: item.id,
          title: t(`items.${item.translationKey}.question`),
          content: t(`items.${item.translationKey}.answer`),
        }))}
      />
    </Section>
  )
}
