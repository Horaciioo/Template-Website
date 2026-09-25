'use client'

import { useEffect } from 'react'

import en from '../../messages/en.json'
import fr from '../../messages/fr.json'
import { I18nService } from '@/services/I18nService'
import { LoggerService } from '@/services/LoggerService'

// Default locale messages
const MESSAGES = { en, fr } as const

export interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Root error fallback
 * @param {GlobalErrorProps} props - Error props
 * @return {JSX.Element} - Whole document
 */

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const locale = I18nService.defaultLocale as keyof typeof MESSAGES
  const { errors, actions } = MESSAGES[locale] ?? MESSAGES.fr

  useEffect(() => LoggerService.error('root.render', error), [error])

  return (
    <html lang={locale}>
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}>
        <h1>{errors.unknown}</h1>
        <p>{errors.retryHint}</p>
        <button type="button" onClick={reset}>
          {actions.retry}
        </button>
      </body>
    </html>
  )
}
