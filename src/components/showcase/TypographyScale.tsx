import { Text } from '@/components/elements/typography/Text'
import { TEXT_STYLES } from '@/declarations/ui/variants'
import type { TextStyle } from '@/declarations/ui/variants'

export interface TypographyScaleProps {
  // Sample text
  sample: string
}

/**
 * Typography scale
 * @param {TypographyScaleProps} props - Typography scale props
 * @return {JSX.Element} - Rendered scale
 */

export const TypographyScale = ({ sample }: TypographyScaleProps) => (
  <div className="flex w-full flex-col gap-4">
    {(Object.keys(TEXT_STYLES) as TextStyle[]).map((name) => (
      <div key={name} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0">
        <Text appearance="meta" as="span">
          {name}
        </Text>
        <Text appearance={name} as="p">
          {sample}
        </Text>
      </div>
    ))}
  </div>
)
