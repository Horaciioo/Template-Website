import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { EmptyState } from '@/components/elements/feedback/EmptyState'
import { Container } from '@/components/structures/layout/Container'
import { Breadcrumb } from '@/components/structures/navigation/Breadcrumb'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { NavigationService } from '@/services/NavigationService'
import { Page } from '@/structures/Page'
import type { PageRenderContext } from '@/structures/Page'

export interface ThankYouPageProps {
  params: Promise<{ locale: string }>
}

class ThankYouPage extends Page {
  constructor() {
    super('thankYou')
  }

  render({ translate, breadcrumb, action }: PageRenderContext): ReactNode {
    return (
      <div className={SECTION_SPACING.lg}>
        <Container width="narrow">
          {breadcrumb}
          <EmptyState
            figure="message"
            title={translate('label')}
            description={translate('metaDescription')}
            action={action}
          />
        </Container>
      </div>
    )
  }
}

const page = new ThankYouPage()

/**
 * Generate page metadata
 * @param {ThankYouPageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: ThankYouPageProps): Promise<Metadata> => {
  const { locale } = await params

  return page.metadata({ locale, translate: await getTranslations() })
}

/**
 * Thank-you page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function ThankYouPageRoute() {
  const navigationTranslate = await getTranslations()
  const homeTranslate = await getTranslations('routes.home')

  return page.render({
    translate: await getTranslations('routes.thankYou'),
    breadcrumb: (
      <Breadcrumb
        entries={NavigationService.breadcrumbOf('thankYou', navigationTranslate)}
        label={navigationTranslate('navigation.breadcrumb')}
      />
    ),
    action: (
      <ActionLink route="home" icon="home">
        {homeTranslate('label')}
      </ActionLink>
    ),
  })
}
