'use client'

import { useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { Heading } from '@/components/elements/typography/Heading'
import { Text } from '@/components/elements/typography/Text'
import { Container } from '@/components/structures/layout/Container'
import { SECTION_ANCHORS } from '@/declarations/routes'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { NavigationService } from '@/services/NavigationService'
import type { Styleable } from '@/types/common'
import type { RouteId } from '@/types/navigation'
import { cn } from '@/utils/classnames'

export interface CallToActionSectionProps extends Styleable {
  route?: RouteId
}

/**
 * Call-to-action
 * @param {CallToActionSectionProps} props - CTA section props
 * @return {JSX.Element} - Rendered section
 */

export const CallToActionSection = ({ route, className }: CallToActionSectionProps) => {
  const t = useTranslations('sections.callToAction')
  const actions = useTranslations('actions')
  const target = route ?? NavigationService.callToActionRoute()

  return (
    <section id={SECTION_ANCHORS.callToAction} className={cn(SECTION_SPACING.md, className)}>
      <Container>
        <div className="flex flex-col items-center gap-5 rounded-xl bg-primary px-6 py-14 text-center">
          <Heading level={2} className="text-primary-foreground">
            {t('title')}
          </Heading>
          <Text appearance="lead" className="max-w-xl text-primary-foreground/80">
            {t('description')}
          </Text>
          <ActionLink
            route={target}
            variant="secondary"
            size="lg"
            icon="arrowRight"
            iconPosition="right">
            {actions(NavigationService.ctaActionOf(target))}
          </ActionLink>
        </div>
      </Container>
    </section>
  )
}
