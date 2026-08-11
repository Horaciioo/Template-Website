import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { LegalSection } from '@/components/sections/LegalSection'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { SeoService } from '@/services/SeoService'

export interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>
}

/**
 * Generate page metadata
 * @param {PrivacyPolicyPageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: PrivacyPolicyPageProps): Promise<Metadata> => {
  const { locale } = await params

  return SeoService.buildMetadata({
    routeId: 'privacyPolicy',
    locale,
    translate: await getTranslations(),
  })
}

/**
 * Privacy policy page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('routes.privacyPolicy')

  return (
    <>
      <PageHeader title={t('label')} description={t('metaDescription')} />
      <LegalSection page="privacyPolicy" />
    </>
  )
}
