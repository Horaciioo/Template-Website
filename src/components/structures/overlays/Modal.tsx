'use client'

import type { ReactNode } from 'react'

import { IconButton } from '@/components/elements/actions/IconButton'
import { Heading } from '@/components/elements/typography/Heading'
import { OverlayShell } from '@/components/structures/overlays/OverlayShell'
import { OVERLAY_STYLES } from '@/declarations/ui/variants'
import { NamingService } from '@/services/NamingService'
import type { Size, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface ModalProps extends Styleable {
  isOpen: boolean
  onClose: () => void
  // Accessible ID source
  name: string
  title: string
  closeLabel: string
  size?: Size
  footer?: ReactNode
  children: ReactNode
}

/**
 * Modal
 * @param {ModalProps} props - Modal props
 * @return {JSX.Element} - Rendered modal
 */

export const Modal = ({
  isOpen,
  onClose,
  name,
  title,
  closeLabel,
  size = 'md',
  footer,
  children,
  className,
}: ModalProps) => {
  const titleId = NamingService.toDomId(name, 'title')

  return (
    <OverlayShell isOpen={isOpen} onClose={onClose} frameClassName={OVERLAY_STYLES.centered}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(OVERLAY_STYLES.panel, OVERLAY_STYLES.panelSizes[size], className)}>
        <div className={OVERLAY_STYLES.header}>
          <Heading level={2} appearance={3} id={titleId}>
            {title}
          </Heading>
          <IconButton icon="close" label={closeLabel} size="sm" onClick={onClose} />
        </div>
        <div className={OVERLAY_STYLES.body}>{children}</div>
        {footer && <div className={OVERLAY_STYLES.footer}>{footer}</div>}
      </div>
    </OverlayShell>
  )
}
