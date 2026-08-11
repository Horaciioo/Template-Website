import { Skeleton, SkeletonList } from '@/components/elements/feedback/Skeleton'
import { LAYOUT, PAGE_SKELETON_STYLES } from '@/declarations/ui/variants'
import type { SkeletonShape } from '@/declarations/ui/variants'

export interface PageSkeletonBlock {
  shape: SkeletonShape
  rows?: number
}

export interface PageSkeletonProps {
  blocks: PageSkeletonBlock[]
}

/**
 * Page skeleton
 * @param {PageSkeletonProps} props - Skeleton blocks
 * @return {JSX.Element} - Rendered page placeholder
 */

export const PageSkeleton = ({ blocks }: PageSkeletonProps) => (
  <div className={LAYOUT.sectionStack}>
    <div className={PAGE_SKELETON_STYLES.header}>
      <Skeleton className={PAGE_SKELETON_STYLES.title} />
      <Skeleton className={PAGE_SKELETON_STYLES.description} />
    </div>
    {blocks.map((block, index) => (
      <div key={index} className={PAGE_SKELETON_STYLES.block}>
        <SkeletonList rows={block.rows ?? 1} shape={block.shape} />
      </div>
    ))}
  </div>
)
