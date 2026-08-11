import Image from 'next/image'

import { NAVIGATION_STYLES } from '@/declarations/ui/variants'
import { ConfigurationService } from '@/services/ConfigurationService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface LogoProps extends Styleable {
  // Wordmark visibility
  withName?: boolean
}

const { logo, name } = ConfigurationService.site

/**
 * Site logo
 * @param {LogoProps} props - Logo props
 * @return {JSX.Element} - Rendered logo
 */

export const Logo = ({ withName = true, className }: LogoProps) => (
  <span className={cn('flex items-center gap-2', className)}>
    {logo.image ? (
      <Image
        src={logo.image}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
      />
    ) : (
      <span className={NAVIGATION_STYLES.brandSymbol}>{logo.symbol}</span>
    )}
    {withName && <span>{name}</span>}
  </span>
)
