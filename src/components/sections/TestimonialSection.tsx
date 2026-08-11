'use client'

import { useTranslations } from 'next-intl'

import { Avatar } from '@/components/elements/data/Avatar'
import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import { Card } from '@/components/structures/layout/Card'
import { Grid } from '@/components/structures/layout/Grid'
import { Section } from '@/components/structures/layout/Section'
import { TESTIMONIALS } from '@/declarations/content'
import type { TestimonialItem } from '@/types/content'

// Max rating
const MAX_RATING = 5

export interface TestimonialSectionProps {
  items?: TestimonialItem[]
}

/**
 * Testimonial section
 * @param {TestimonialSectionProps} props - Testimonial section props
 * @return {JSX.Element} - Rendered section
 */

export const TestimonialSection = ({ items = TESTIMONIALS }: TestimonialSectionProps) => {
  const t = useTranslations('sections.testimonials')

  return (
    <Section anchor="testimonials" overline={t('overline')} title={t('title')} centered>
      <Grid columns={3}>
        {items.map((item) => {
          const author = t(`items.${item.translationKey}.author`)

          return (
            <Card key={item.id}>
              <Icon name="quote" size="md" className="text-primary/60" />
              <Text appearance="body">{t(`items.${item.translationKey}.quote`)}</Text>
              {item.rating !== undefined && (
                <span className="flex gap-0.5" aria-label={String(item.rating)}>
                  {Array.from({ length: MAX_RATING }, (_, index) => (
                    <Icon
                      key={index}
                      name="star"
                      size="xs"
                      className={index < item.rating! ? 'text-warning' : 'text-border-strong'}
                    />
                  ))}
                </span>
              )}
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={author} src={item.avatar} size="sm" />
                <div>
                  <Text appearance="label" as="p">
                    {author}
                  </Text>
                  <Text appearance="meta" as="p">
                    {t(`items.${item.translationKey}.role`)}
                  </Text>
                </div>
              </div>
            </Card>
          )
        })}
      </Grid>
    </Section>
  )
}
