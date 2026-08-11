import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { LegalSection } from '@/components/sections/LegalSection'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { SeoService } from '@/services/SeoService'

export interface LegalNoticePageProps {
  params: Promise<{ locale: string }>
}

/**
 * Generate page metadata
 * @param {LegalNoticePageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: LegalNoticePageProps): Promise<Metadata> => {
  const { locale } = await params

  return SeoService.buildMetadata({
    routeId: 'legalNotice',
    locale,
    translate: await getTranslations(),
  })
}

/**
 * Legal notice page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function LegalNoticePage() {
  const t = await getTranslations('routes.legalNotice')

  return (
    <>
      <PageHeader title={t('label')} description={t('metaDescription')} />
      <LegalSection page="legalNotice" />
    </>
  )
}
