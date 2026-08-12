import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { LegalSection } from '@/components/sections/LegalSection'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { Breadcrumb } from '@/components/structures/navigation/Breadcrumb'
import { NavigationService } from '@/services/NavigationService'
import { Page } from '@/structures/Page'
import type { PageRenderContext } from '@/structures/Page'

export interface LegalNoticePageProps {
  params: Promise<{ locale: string }>
}

class LegalNoticePage extends Page {
  constructor() {
    super('legalNotice')
  }

  render({ translate, breadcrumb }: PageRenderContext): ReactNode {
    return (
      <>
        <PageHeader
          title={translate('label')}
          description={translate('metaDescription')}
          breadcrumb={breadcrumb}
        />
        <LegalSection page="legalNotice" />
      </>
    )
  }
}

const page = new LegalNoticePage()

/**
 * Generate page metadata
 * @param {LegalNoticePageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: LegalNoticePageProps): Promise<Metadata> => {
  const { locale } = await params

  return page.metadata({ locale, translate: await getTranslations() })
}

/**
 * Legal notice page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function LegalNoticePageRoute() {
  const navigationTranslate = await getTranslations()

  return page.render({
    translate: await getTranslations('routes.legalNotice'),
    breadcrumb: (
      <Breadcrumb
        entries={NavigationService.breadcrumbOf('legalNotice', navigationTranslate)}
        label={navigationTranslate('navigation.breadcrumb')}
      />
    ),
  })
}
