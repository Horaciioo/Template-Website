'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

import { Icon } from '@/components/elements/media/Icon'
import { ACCORDION_STYLES } from '@/declarations/ui/variants'
import { NamingService } from '@/services/NamingService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface AccordionEntry {
  id: string
  title: string
  content: ReactNode
}

export interface AccordionProps extends Styleable {
  entries: AccordionEntry[]
  // ID prefix
  name: string
  // Exclusive mode
  exclusive?: boolean
}

/**
 * Accordion
 * @param {AccordionProps} props - Accordion props
 * @return {JSX.Element} - Rendered accordion
 */

export const Accordion = ({ entries, name, exclusive = true, className }: AccordionProps) => {
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggle = (id: string) =>
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id)

      return exclusive ? [id] : [...current, id]
    })

  return (
    <div className={cn(ACCORDION_STYLES.list, className)}>
      {entries.map((entry) => {
        const isOpen = openIds.includes(entry.id)
        const panelId = NamingService.toDomId(name, entry.id, 'panel')

        return (
          <div key={entry.id} className={ACCORDION_STYLES.item}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={ACCORDION_STYLES.trigger}
              onClick={() => toggle(entry.id)}>
              {entry.title}
              <Icon
                name="chevronDown"
                size="sm"
                className={ACCORDION_STYLES.indicator}
                data-open={isOpen}
              />
            </button>
            {isOpen && (
              <div id={panelId} className={ACCORDION_STYLES.panel}>
                {entry.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
