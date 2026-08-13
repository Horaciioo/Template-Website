import { Icon } from '@/components/elements/media/Icon'
import { NAVIGATION_STYLES } from '@/declarations/ui/variants'
import { Link } from '@/i18n/routing'
import type { Direction, Styleable } from '@/types/common'
import type { NavigationEntry } from '@/types/navigation'
import { cn } from '@/utils/classnames'

export interface NavigationListProps extends Styleable {
  entries: NavigationEntry[]
  direction?: Direction
  withIcons?: boolean
  onNavigate?: () => void
}

/**
 * Navigation list
 * @param {NavigationListProps} props - Navigation list props
 * @return {JSX.Element} - Rendered list
 */

export const NavigationList = ({
  entries,
  direction = 'horizontal',
  withIcons = false,
  onNavigate,
  className,
}: NavigationListProps) => {
  const isVertical = direction === 'vertical'

  return (
    <ul
      className={cn(isVertical ? NAVIGATION_STYLES.mobileList : NAVIGATION_STYLES.list, className)}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={entry.href}
            onClick={onNavigate}
            aria-current={entry.isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2',
              isVertical ? NAVIGATION_STYLES.mobileLink : NAVIGATION_STYLES.link,
              entry.isActive && NAVIGATION_STYLES.linkActive
            )}>
            {withIcons && entry.icon && <Icon name={entry.icon} size="sm" />}
            {entry.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
