import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ShowcaseCatalog } from '@/components/showcase/ShowcaseCatalog'
import { Container } from '@/components/structures/layout/Container'
import { PageHeader } from '@/components/structures/layout/PageHeader'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { SeoService } from '@/services/SeoService'

export interface ShowcasePageProps {
  params: Promise<{ locale: string }>
}

/**
 * Generate page metadata
 * @param {ShowcasePageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: ShowcasePageProps): Promise<Metadata> => {
  const { locale } = await params

  return SeoService.buildMetadata({
    routeId: 'showcase',
    locale,
    translate: await getTranslations(),
  })
}

/**
 * Showcase page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function ShowcasePage() {
  const t = await getTranslations('showcase')

  return (
    <>
      <PageHeader title={t('title')} description={t('description')} />
      <div className={SECTION_SPACING.sm}>
        <Container>
          <ShowcaseCatalog />
        </Container>
      </div>
    </>
  )
}
