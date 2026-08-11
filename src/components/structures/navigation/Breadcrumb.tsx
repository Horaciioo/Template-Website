import { Icon } from '@/components/elements/media/Icon'
import { TEXT_STYLES } from '@/declarations/ui/variants'
import { Link } from '@/i18n/routing'
import type { Styleable } from '@/types/common'
import type { BreadcrumbEntry } from '@/types/navigation'
import { cn } from '@/utils/classnames'

export interface BreadcrumbProps extends Styleable {
  entries: BreadcrumbEntry[]
  // Accessible label
  label: string
}

/**
 * Breadcrumb
 * @param {BreadcrumbProps} props - Breadcrumb props
 * @return {JSX.Element} - Rendered breadcrumb
 */

export const Breadcrumb = ({ entries, label, className }: BreadcrumbProps) => (
  <nav aria-label={label} className={cn(TEXT_STYLES.meta, className)}>
    <ol className="flex flex-wrap items-center gap-1.5">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1

        return (
          <li key={entry.href} className="flex items-center gap-1.5">
            {index > 0 && <Icon name="chevronRight" size="xs" />}
            {isLast ? (
              <span aria-current="page" className="text-foreground-muted">
                {entry.label}
              </span>
            ) : (
              <Link href={entry.href} className="hover:text-foreground">
                {entry.label}
              </Link>
            )}
          </li>
        )
      })}
    </ol>
  </nav>
)
