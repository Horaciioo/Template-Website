'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

import { TABS_STYLES } from '@/declarations/ui/variants'
import { NamingService } from '@/services/NamingService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface TabEntry {
  id: string
  label: string
  content: ReactNode
}

export interface TabsProps extends Styleable {
  entries: TabEntry[]
  // ID prefix
  name: string
  defaultId?: string
}

/**
 * Tabs
 * @param {TabsProps} props - Tabs props
 * @return {JSX.Element} - Rendered tabs
 */

export const Tabs = ({ entries, name, defaultId, className }: TabsProps) => {
  const [activeId, setActiveId] = useState(defaultId ?? entries[0]?.id ?? '')
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0]

  return (
    <div className={className}>
      <div role="tablist" className={TABS_STYLES.list}>
        {entries.map((entry) => {
          const isActive = entry.id === active?.id

          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={NamingService.toDomId(name, entry.id, 'tab')}
              aria-selected={isActive}
              aria-controls={NamingService.toDomId(name, entry.id, 'panel')}
              className={cn(TABS_STYLES.trigger, isActive && TABS_STYLES.triggerActive)}
              onClick={() => setActiveId(entry.id)}>
              {entry.label}
            </button>
          )
        })}
      </div>
      {active && (
        <div
          role="tabpanel"
          id={NamingService.toDomId(name, active.id, 'panel')}
          aria-labelledby={NamingService.toDomId(name, active.id, 'tab')}
          className={TABS_STYLES.panel}>
          {active.content}
        </div>
      )}
    </div>
  )
}
