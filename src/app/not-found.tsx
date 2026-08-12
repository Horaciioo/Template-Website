import { I18nService } from '@/services/I18nService'

import LocaleLayout from './[locale]/layout'
import NotFoundPage from './[locale]/not-found'

/**
 * Root 404 fallback
 * @return {Promise<JSX.Element>} - Localized not-found page
 */

export default async function GlobalNotFoundPage() {
  return (
    <LocaleLayout params={Promise.resolve({ locale: I18nService.defaultLocale })}>
      <NotFoundPage />
    </LocaleLayout>
  )
}
