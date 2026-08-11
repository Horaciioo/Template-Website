'use client'

import type { ReactNode } from 'react'

import { IconButton } from '@/components/elements/actions/IconButton'
import { Heading } from '@/components/elements/typography/Heading'
import { OverlayShell } from '@/components/structures/overlays/OverlayShell'
import { DRAWER_STYLES } from '@/declarations/ui/variants'
import { NamingService } from '@/services/NamingService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface DrawerProps extends Styleable {
  isOpen: boolean
  onClose: () => void
  name: string
  title: string
  closeLabel: string
  children: ReactNode
}

/**
 * Drawer
 * @param {DrawerProps} props - Drawer props
 * @return {JSX.Element} - Rendered drawer
 */

export const Drawer = ({
  isOpen,
  onClose,
  name,
  title,
  closeLabel,
  children,
  className,
}: DrawerProps) => {
  const titleId = NamingService.toDomId(name, 'title')

  return (
    <OverlayShell isOpen={isOpen} onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(DRAWER_STYLES.panel, className)}>
        <div className={DRAWER_STYLES.header}>
          <Heading level={2} appearance={3} id={titleId}>
            {title}
          </Heading>
          <IconButton icon="close" label={closeLabel} size="sm" onClick={onClose} />
        </div>
        <div className={DRAWER_STYLES.body}>{children}</div>
      </div>
    </OverlayShell>
  )
}
