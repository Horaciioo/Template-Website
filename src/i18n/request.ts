import type { AbstractIntlMessages } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { ConfigurationService } from '@/services/ConfigurationService'
import { I18nService } from '@/services/I18nService'

/**
 * i18n request config
 * @type {Object}
 */

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = I18nService.resolve(await requestLocale)

  return {
    locale,
    messages: (await I18nService.loadMessages(locale)) as AbstractIntlMessages,
    timeZone: ConfigurationService.localization.timeZone,
  }
})
