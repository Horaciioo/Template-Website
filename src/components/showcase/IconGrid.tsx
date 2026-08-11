import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import { ICONS } from '@/declarations/ui/icons'
import type { IconName } from '@/declarations/ui/icons'
import { SURFACES } from '@/declarations/ui/tokens'
import { cn } from '@/utils/classnames'

/**
 * Icon grid
 * @return {JSX.Element} - Rendered grid
 */

export const IconGrid = () => (
  <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-8">
    {(Object.keys(ICONS) as IconName[]).map((name) => (
      <div
        key={name}
        className={cn(SURFACES.inset, 'flex flex-col items-center gap-2 px-2 py-3 text-center')}>
        <Icon name={name} />
        <Text appearance="meta" as="span" className="break-all">
          {name}
        </Text>
      </div>
    ))}
  </div>
)
