'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'

import { ConfigurationService } from '@/services/ConfigurationService'
import { ConsentService } from '@/services/ConsentService'

/**
 * Consent gated analytics
 * @return {JSX.Element | null} - Rendered scripts
 */

export const AnalyticsGate = () => {
  const status = ConsentService.use()
  const { googleAnalyticsId } = ConfigurationService.environment.analytics

  if (status !== 'granted') return null

  return (
    <>
      <Analytics />
      {googleAnalyticsId.length > 0 && <GoogleAnalytics gaId={googleAnalyticsId} />}
    </>
  )
}
