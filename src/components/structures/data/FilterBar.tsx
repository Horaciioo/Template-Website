'use client'

import { Icon } from '@/components/elements/media/Icon'
import { Button } from '@/components/elements/actions/Button'
import { FIELD_STYLES } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface FilterOption {
  id: string
  label: string
}

export interface FilterBarProps extends Styleable {
  // Search query
  query?: string
  searchLabel?: string
  onQueryChange?: (query: string) => void
  options: FilterOption[]
  activeId: string
  onSelect: (id: string) => void
}

/**
 * Filter bar
 * @param {FilterBarProps} props - Filter bar props
 * @return {JSX.Element} - Rendered filter bar
 */

export const FilterBar = ({
  query,
  searchLabel,
  onQueryChange,
  options,
  activeId,
  onSelect,
  className,
}: FilterBarProps) => (
  <div
    className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
    {onQueryChange && (
      <div className="relative w-full sm:max-w-xs">
        <Icon name="search" size="sm" className={FIELD_STYLES.icon} />
        <input
          type="search"
          value={query ?? ''}
          aria-label={searchLabel}
          placeholder={searchLabel}
          className={cn(
            FIELD_STYLES.control,
            FIELD_STYLES.controlHeight,
            FIELD_STYLES.controlWithIcon
          )}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
    )}
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.id}
          size="sm"
          variant={option.id === activeId ? 'primary' : 'secondary'}
          aria-pressed={option.id === activeId}
          onClick={() => onSelect(option.id)}>
          {option.label}
        </Button>
      ))}
    </div>
  </div>
)
