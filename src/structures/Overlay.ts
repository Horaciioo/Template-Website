import { LoggerService } from '@/services/LoggerService'
import { ScrollService } from '@/services/ScrollService'

// Overlay technical base
export class Overlay {
  protected readonly onClose: () => void

  /**
   * @param {() => void} onClose - Close handler
   */

  constructor(onClose: () => void) {
    this.onClose = onClose
  }

  /**
   * Scoped logger
   * @return {typeof LoggerService} - Logger
   */

  protected get logger(): typeof LoggerService {
    return LoggerService
  }

  /**
   * Escape key hook, override for custom behaviour
   * @return {void}
   */

  onEscape(): void {
    this.onClose()
  }

  /**
   * Mount shared overlay behaviour
   * @return {() => void} - Teardown
   */

  open(): () => void {
    const release = ScrollService.lock()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.onEscape()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      release()
      window.removeEventListener('keydown', onKeyDown)
    }
  }
}
