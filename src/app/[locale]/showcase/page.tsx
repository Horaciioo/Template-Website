import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ShowcaseCatalog } from '@/components/showcase/ShowcaseCatalog'
import { Container } from '@/components/structures/layout/Container'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { Breadcrumb } from '@/components/structures/navigation/Breadcrumb'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { NavigationService } from '@/services/NavigationService'
import { Page } from '@/structures/Page'
import type { PageRenderContext } from '@/structures/Page'

export interface ShowcasePageProps {
  params: Promise<{ locale: string }>
}

class ShowcasePage extends Page {
  constructor() {
    super('showcase')
  }

  render({ translate, breadcrumb }: PageRenderContext): ReactNode {
    return (
      <>
        <PageHeader
          title={translate('title')}
          description={translate('description')}
          breadcrumb={breadcrumb}
        />
        <div className={SECTION_SPACING.sm}>
          <Container>
            <ShowcaseCatalog />
          </Container>
        </div>
      </>
    )
  }
}

const page = new ShowcasePage()

/**
 * Generate page metadata
 * @param {ShowcasePageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: ShowcasePageProps): Promise<Metadata> => {
  const { locale } = await params

  return page.metadata({ locale, translate: await getTranslations() })
}

/**
 * Showcase page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function ShowcasePageRoute() {
  const navigationTranslate = await getTranslations()

  return page.render({
    translate: await getTranslations('showcase'),
    breadcrumb: (
      <Breadcrumb
        entries={NavigationService.breadcrumbOf('showcase', navigationTranslate)}
        label={navigationTranslate('navigation.breadcrumb')}
      />
    ),
  })
}
