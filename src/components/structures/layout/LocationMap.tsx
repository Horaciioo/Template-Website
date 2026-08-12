import { ActionLink } from '@/components/elements/actions/ActionLink'
import { SURFACES } from '@/declarations/ui/tokens'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NavigationService } from '@/services/NavigationService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface LocationMapProps extends Styleable {
  // Iframe accessible title
  title: string
  directionsLabel: string
}

const { address } = ConfigurationService.identity

/**
 * Location map with directions
 * @param {LocationMapProps} props - Location map props
 * @return {JSX.Element} - Rendered map
 */

export const LocationMap = ({ title, directionsLabel, className }: LocationMapProps) => (
  <div className={cn('flex flex-col gap-3', className)}>
    <iframe
      src={NavigationService.mapEmbedUrlOf(address)}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn('h-64 w-full overflow-hidden', SURFACES.outline)}
    />
    <ActionLink
      href={NavigationService.mapDirectionsUrlOf(address)}
      variant="secondary"
      icon="location">
      {directionsLabel}
    </ActionLink>
  </div>
)
