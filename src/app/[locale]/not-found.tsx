import { getTranslations } from 'next-intl/server'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { EmptyState } from '@/components/elements/feedback/EmptyState'
import { Container } from '@/components/structures/layout/Container'
import { SECTION_SPACING } from '@/declarations/ui/tokens'

/**
 * 404 page
 * @return {Promise<JSX.Element>} - Rendered page
 */

export default async function NotFoundPage() {
  const t = await getTranslations('errors')
  const routes = await getTranslations('routes')

  return (
    <div className={SECTION_SPACING.lg}>
      <Container width="narrow">
        <EmptyState
          figure="search"
          icon="searchEmpty"
          title={t('notFound')}
          description={t('notFoundHint')}
          action={
            <ActionLink route="home" icon="home">
              {routes('home.label')}
            </ActionLink>
          }
        />
      </Container>
    </div>
  )
}
