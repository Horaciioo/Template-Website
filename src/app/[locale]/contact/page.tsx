import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ContactSection } from '@/components/sections/ContactSection'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { SeoService } from '@/services/SeoService'

export interface ContactPageProps {
  params: Promise<{ locale: string }>
}

/**
 * Generate page metadata
 * @param {ContactPageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: ContactPageProps): Promise<Metadata> => {
  const { locale } = await params

  return SeoService.buildMetadata({
    routeId: 'contact',
    locale,
    translate: await getTranslations(),
  })
}

/**
 * Contact page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function ContactPage() {
  const t = await getTranslations('routes.contact')

  return (
    <>
      <PageHeader title={t('label')} description={t('metaDescription')} />
      <ContactSection />
    </>
  )
}
