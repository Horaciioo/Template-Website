import { Text } from '@/components/elements/typography/Text'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NamingService } from '@/services/NamingService'
import { SURFACES } from '@/declarations/ui/tokens'
import { cn } from '@/utils/classnames'

const { colors, radii, shadows } = ConfigurationService.theme

/**
 * Theme palette
 * @return {JSX.Element} - Rendered palette
 */

export const ThemePalette = () => (
  <div className="flex w-full flex-col gap-8">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {Object.keys(colors.light).map((name) => (
        <div key={name} className="flex flex-col gap-1.5">
          <span
            className={cn('h-14 w-full rounded-md border border-border')}
            style={{ background: `rgb(var(${NamingService.toCssVariable('color', name)}))` }}
          />
          <Text appearance="meta" as="span">
            {name}
          </Text>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap gap-4">
      {Object.keys(radii).map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <span
            className="h-14 w-14 border border-border-strong bg-surface-strong"
            style={{ borderRadius: `var(${NamingService.toCssVariable('radius', name)})` }}
          />
          <Text appearance="meta" as="span">
            {name}
          </Text>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap gap-4">
      {Object.keys(shadows).map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <span
            className={cn(SURFACES.raised, 'h-14 w-24')}
            style={{ boxShadow: `var(${NamingService.toCssVariable('shadow', name)})` }}
          />
          <Text appearance="meta" as="span">
            {name}
          </Text>
        </div>
      ))}
    </div>
  </div>
)
