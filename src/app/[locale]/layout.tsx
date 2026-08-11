import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/react'

import { SiteLayout } from '@/components/layout/SiteLayout'
import { FONT_VARIABLES } from '@/declarations/ui/fonts'
import { EnvironmentService } from '@/services/EnvironmentService'
import { I18nService } from '@/services/I18nService'
import { SeoService } from '@/services/SeoService'
import { ThemeService } from '@/services/ThemeService'

import '@/styles/globals.css'

export interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Generate static params for all supported locales
 * @return {Array<{ locale: string }>} - Static params
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
        </NextIntlClientProvider>
        {EnvironmentService.analytics.isEnabled && <Analytics />}
      </body>
    </html>
  )
}
