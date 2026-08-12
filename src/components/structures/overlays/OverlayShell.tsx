'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { LAYERS } from '@/declarations/ui/tokens'
import { OVERLAY_STYLES } from '@/declarations/ui/variants'
import { Overlay } from '@/structures/Overlay'
import { isBrowser } from '@/utils/guards'
import { cn } from '@/utils/classnames'

export interface OverlayShellProps {
  isOpen: boolean
  onClose: () => void
  // Panel wrapper
  frameClassName?: string
  children: ReactNode
}

/**
 * Overlay shell
 * @param {OverlayShellProps} props - Overlay shell props
 * @return {JSX.Element | null} - Rendered portal
 */

export const OverlayShell = ({ isOpen, onClose, frameClassName, children }: OverlayShellProps) => {
  useEffect(() => {
    if (!isOpen) return

    return new Overlay(onClose).open()
  }, [isOpen, onClose])

  if (!isOpen || !isBrowser()) return null

  return createPortal(
    <div className={cn('fixed inset-0', LAYERS.overlay)}>
      <div className={OVERLAY_STYLES.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={cn('relative h-full', frameClassName)}>{children}</div>
    </div>,
    document.body
  )
}
