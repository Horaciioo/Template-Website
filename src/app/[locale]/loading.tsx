import { PageSkeleton } from '@/components/elements/feedback/PageSkeleton'
import { Container } from '@/components/structures/layout/Container'
import { SECTION_SPACING } from '@/declarations/ui/tokens'

/**
 * Loading placeholder
 * @return {JSX.Element} - Skeleton
 */

export default function Loading() {
  return (
    <div className={SECTION_SPACING.md}>
      <Container>
        <PageSkeleton
          blocks={[
            { shape: 'card', rows: 1 },
            { shape: 'row', rows: 3 },
          ]}
        />
      </Container>
    </div>
  )
}
