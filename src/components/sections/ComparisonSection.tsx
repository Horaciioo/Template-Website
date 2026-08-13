'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { IconButton } from '@/components/elements/actions/IconButton'
import { Picture } from '@/components/elements/media/Picture'
import { Text } from '@/components/elements/typography/Text'
import { Section } from '@/components/structures/layout/Section'
import { COMPARISONS } from '@/declarations/content'
import { COMPARISON_STYLES } from '@/declarations/ui/variants'
import { ConfigurationService } from '@/services/ConfigurationService'
import type { Styleable } from '@/types/common'
import type { ComparisonItem } from '@/types/content'
import { cn } from '@/utils/classnames'

const { carouselIntervalMs } = ConfigurationService.timings
const { reducedMotion } = ConfigurationService.viewport.mediaQueries

// Ordered pair of every slide
const STAGES = ['before', 'after'] as const

export interface ComparisonSectionProps extends Styleable {
  items?: ComparisonItem[]
}

/**
 * Before and after carousel
 * @param {ComparisonSectionProps} props - Comparison section props
 * @return {JSX.Element} - Rendered section
 */

export const ComparisonSection = ({ items = COMPARISONS, className }: ComparisonSectionProps) => {
  const t = useTranslations('sections.comparisons')
  const actions = useTranslations('actions')

  const viewportRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(reducedMotion)
    setPrefersReducedMotion(media.matches)

    const onChange = () => setPrefersReducedMotion(media.matches)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [])

  // Slides all share a width, the offset alone gives the active one
  const goTo = useCallback(
    (next: number) => {
      const viewport = viewportRef.current
      if (!viewport || items.length === 0) return

      const target = ((next % items.length) + items.length) % items.length
      viewport.scrollTo({ left: target * viewport.clientWidth })
      setIndex(target)
    },
    [items.length]
  )

  // A swipe moves the scroller, the dots follow it back
  const handleScroll = () => {
    const viewport = viewportRef.current
    if (!viewport || viewport.clientWidth === 0) return

    setIndex(Math.round(viewport.scrollLeft / viewport.clientWidth))
  }

  useEffect(() => {
    if (prefersReducedMotion || isPaused || items.length < 2) return undefined

    const timer = window.setInterval(() => goTo(index + 1), carouselIntervalMs)

    return () => window.clearInterval(timer)
  }, [goTo, index, isPaused, items.length, prefersReducedMotion])

  const renderPanel = (item: ComparisonItem, stage: (typeof STAGES)[number]) => (
    <div key={stage} className={COMPARISON_STYLES.panel}>
      <span className={COMPARISON_STYLES.panelLabel}>{t(stage)}</span>
      <Picture
        src={item[stage].src}
        alt={t(`items.${item.translationKey}.${stage}Alt`)}
        stretch
        className="absolute inset-0"
      />
    </div>
  )

  return (
    <Section anchor="comparisons" title={t('title')} description={t('description')} width="wide">
      <div
        className={cn(COMPARISON_STYLES.frame, className)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}>
        <div className={COMPARISON_STYLES.viewportWrapper}>
          <div
            ref={viewportRef}
            onScroll={handleScroll}
            aria-label={t('title')}
            className={COMPARISON_STYLES.viewport}>
            {items.map((item, slide) => (
              <div
                key={item.id}
                role="group"
                aria-label={t('position', {
                  position: String(slide + 1),
                  total: String(items.length),
                })}
                className={COMPARISON_STYLES.slide}>
                <article
                  className={cn(
                    COMPARISON_STYLES.card,
                    slide === index ? COMPARISON_STYLES.cardActive : COMPARISON_STYLES.cardInactive
                  )}>
                  <div className={COMPARISON_STYLES.pair}>
                    {STAGES.map((stage) => renderPanel(item, stage))}
                  </div>

                  <div className={COMPARISON_STYLES.caption}>
                    <h3 className={COMPARISON_STYLES.captionTitle}>
                      {t(`items.${item.translationKey}.title`)}
                    </h3>
                    <Text appearance="description">
                      {t(`items.${item.translationKey}.description`)}
                    </Text>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <IconButton
            icon="chevronLeft"
            size="md"
            label={actions('previous')}
            className={cn(COMPARISON_STYLES.arrow, COMPARISON_STYLES.arrowLeft)}
            onClick={() => goTo(index - 1)}
          />
          <IconButton
            icon="chevronRight"
            size="md"
            label={actions('next')}
            className={cn(COMPARISON_STYLES.arrow, COMPARISON_STYLES.arrowRight)}
            onClick={() => goTo(index + 1)}
          />
        </div>

        <div className={COMPARISON_STYLES.controls}>
          <div className={COMPARISON_STYLES.dots}>
            {items.map((item, slide) => (
              <button
                key={item.id}
                type="button"
                aria-current={slide === index}
                aria-label={t('position', {
                  position: String(slide + 1),
                  total: String(items.length),
                })}
                className={cn(
                  COMPARISON_STYLES.dot,
                  slide === index && COMPARISON_STYLES.dotActive
                )}
                onClick={() => goTo(slide)}
              />
            ))}
          </div>

          <p className={COMPARISON_STYLES.counter}>
            {t('position', { position: String(index + 1), total: String(items.length) })}
          </p>
        </div>
      </div>
    </Section>
  )
}
