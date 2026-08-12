import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { LegalSection } from '@/components/sections/LegalSection'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { Breadcrumb } from '@/components/structures/navigation/Breadcrumb'
import { NavigationService } from '@/services/NavigationService'
import { Page } from '@/structures/Page'
import type { PageRenderContext } from '@/structures/Page'

export interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>
}

class PrivacyPolicyPage extends Page {
  constructor() {
    super('privacyPolicy')
  }

  render({ translate, breadcrumb }: PageRenderContext): ReactNode {
    return (
      <>
        <PageHeader
          title={translate('label')}
          description={translate('metaDescription')}
          breadcrumb={breadcrumb}
        />
        <LegalSection page="privacyPolicy" />
      </>
    )
  }
}

const page = new PrivacyPolicyPage()

/**
 * Generate page metadata
 * @param {PrivacyPolicyPageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: PrivacyPolicyPageProps): Promise<Metadata> => {
  const { locale } = await params

  return page.metadata({ locale, translate: await getTranslations() })
}

/**
 * Privacy policy page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function PrivacyPolicyPageRoute() {
  const navigationTranslate = await getTranslations()

  return page.render({
    translate: await getTranslations('routes.privacyPolicy'),
    breadcrumb: (
      <Breadcrumb
        entries={NavigationService.breadcrumbOf('privacyPolicy', navigationTranslate)}
        label={navigationTranslate('navigation.breadcrumb')}
      />
    ),
  })
}
