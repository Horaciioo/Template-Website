'use client'

import { useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { Picture } from '@/components/elements/media/Picture'
import { Heading } from '@/components/elements/typography/Heading'
import { Text } from '@/components/elements/typography/Text'
import { Container } from '@/components/structures/layout/Container'
import { PLACEHOLDER_IMAGE } from '@/declarations/content'
import { SECTION_ANCHORS } from '@/declarations/routes'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NavigationService } from '@/services/NavigationService'
import type { Styleable } from '@/types/common'
import type { RouteId } from '@/types/navigation'
import { cn } from '@/utils/classnames'

const { lg } = ConfigurationService.viewport.breakpoints

export interface HeroSectionProps extends Styleable {
  // Primary CTA route
  primaryRoute?: RouteId
  secondaryRoute?: RouteId
  image?: string
}

/**
 * Hero section
 * @param {HeroSectionProps} props - Hero section props
 * @return {JSX.Element} - Rendered hero
 */

export const HeroSection = ({
  primaryRoute,
  secondaryRoute,
  image = PLACEHOLDER_IMAGE,
  className,
}: HeroSectionProps) => {
  const t = useTranslations('sections.hero')
  const actions = useTranslations('actions')
  const primary = primaryRoute ?? NavigationService.callToActionRoute()

  return (
    <section id={SECTION_ANCHORS.hero} className={cn(SECTION_SPACING.lg, className)}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Text appearance="overline" as="p">
              {t('overline')}
            </Text>
            <Heading level={1} className="text-4xl sm:text-5xl lg:text-6xl">
              {t('title')}
            </Heading>
            <Text appearance="lead">{t('description')}</Text>
            <div className="flex flex-wrap gap-3 pt-2">
              <ActionLink route={primary} size="lg" icon="arrowRight" iconPosition="right">
                {actions(NavigationService.ctaActionOf(primary))}
              </ActionLink>
              {secondaryRoute && (
                <ActionLink route={secondaryRoute} variant="secondary" size="lg">
                  {actions(NavigationService.ctaActionOf(secondaryRoute))}
                </ActionLink>
              )}
            </div>
          </div>
          <Picture
            src={image}
            alt={t('imageAlt')}
            ratio="landscape"
            priority
            sizes={`(max-width: ${lg}px) 100vw, 50vw`}
            className="rounded-xl shadow-md"
          />
        </div>
      </Container>
    </section>
  )
}
