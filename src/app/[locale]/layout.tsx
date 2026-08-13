import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { AnalyticsGate } from '@/components/layout/AnalyticsGate'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { ConsentManager } from '@/components/structures/feedback/ConsentManager'
import { FONT_VARIABLES } from '@/declarations/ui/fonts'
import { ConfigurationService } from '@/services/ConfigurationService'
import { I18nService } from '@/services/I18nService'
import { SeoService } from '@/services/SeoService'
import { ThemeService } from '@/services/ThemeService'

import '@/styles/globals.css'

const hasAnalytics =
  ConfigurationService.isEnabled('analytics') && ConfigurationService.environment.analytics.enabled

export interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Static params
 * @return {Array<{ locale: string }>} - Params
 */

export const generateStaticParams = () => I18nService.locales.map((locale) => ({ locale }))

/**
 * @type {Metadata}
 */

export const metadata: Metadata = SeoService.buildRootMetadata()

/**
 * Root layout
 * @param {LocaleLayoutProps} props - Page context
 * @return {Promise<JSX.Element>} - Document
 */

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!I18nService.isSupported(locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className={FONT_VARIABLES} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: ThemeService.buildStyleSheet() }} />
        <script dangerouslySetInnerHTML={{ __html: ThemeService.buildBootScript() }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SeoService.buildOrganizationSchema(locale)),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteLayout>{children}</SiteLayout>
          <ConsentManager />
        </NextIntlClientProvider>
        {hasAnalytics && <AnalyticsGate />}
      </body>
    </html>
  )
}
