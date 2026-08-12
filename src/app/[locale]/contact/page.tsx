import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ContactSection } from '@/components/sections/ContactSection'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { Breadcrumb } from '@/components/structures/navigation/Breadcrumb'
import { NavigationService } from '@/services/NavigationService'
import { Page } from '@/structures/Page'
import type { PageRenderContext } from '@/structures/Page'

export interface ContactPageProps {
  params: Promise<{ locale: string }>
}

class ContactPage extends Page {
  constructor() {
    super('contact')
  }

  render({ translate, breadcrumb }: PageRenderContext): ReactNode {
    return (
      <>
        <PageHeader
          title={translate('label')}
          description={translate('metaDescription')}
          breadcrumb={breadcrumb}
        />
        <ContactSection />
      </>
    )
  }
}

const page = new ContactPage()

/**
 * Generate page metadata
 * @param {ContactPageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: ContactPageProps): Promise<Metadata> => {
  const { locale } = await params

  return page.metadata({ locale, translate: await getTranslations() })
}

/**
 * Contact page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function ContactPageRoute() {
  const navigationTranslate = await getTranslations()

  return page.render({
    translate: await getTranslations('routes.contact'),
    breadcrumb: (
      <Breadcrumb
        entries={NavigationService.breadcrumbOf('contact', navigationTranslate)}
        label={navigationTranslate('navigation.breadcrumb')}
      />
    ),
  })
}
