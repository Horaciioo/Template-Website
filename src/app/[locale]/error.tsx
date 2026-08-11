'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/elements/actions/Button'
import { EmptyState } from '@/components/elements/feedback/EmptyState'
import { Container } from '@/components/structures/layout/Container'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { LoggerService } from '@/services/LoggerService'

export interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary
 * @param {ErrorPageProps} props - Error and retry handler
 * @return {JSX.Element} - Boundary
 */

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('errors')
  const actions = useTranslations('actions')

  useEffect(() => LoggerService.error('route.render', error), [error])

  return (
    <div className={SECTION_SPACING.lg}>
      <Container width="narrow">
        <EmptyState
          figure="message"
          icon="warning"
          title={t('unknown')}
          description={t('retryHint')}
          action={
            <Button icon="arrowRight" onClick={reset}>
              {actions('retry')}
            </Button>
          }
        />
      </Container>
    </div>
  )
}
