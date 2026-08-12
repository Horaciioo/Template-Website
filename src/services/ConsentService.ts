import { STORAGE_KEYS } from '@/declarations/analytics'
import { createStore } from '@/services/core/StoreService'
import { StorageService } from '@/services/StorageService'
import { Service } from '@/structures/Service'
import type { ConsentStatus } from '@/types/consent'

const readStored = (): ConsentStatus =>
  StorageService.read<ConsentStatus>(STORAGE_KEYS.consent) ?? 'pending'

const store = createStore<ConsentStatus>('pending', {
  activate: (setState) => {
    setState(readStored())

    return () => undefined
  },
})

class ConsentServiceClass extends Service {
  /**
   * Follow consent status
   * @return {ConsentStatus} - Current status
   */

  use = (): ConsentStatus => store.use()

  /**
   * Grant consent
   * @return {void}
   */

  grant = (): void => {
    StorageService.write(STORAGE_KEYS.consent, 'granted')
    store.setState('granted')
  }

  /**
   * Deny consent
   * @return {void}
   */

  deny = (): void => {
    StorageService.write(STORAGE_KEYS.consent, 'denied')
    store.setState('denied')
  }

  /**
   * Reset to pending
   * @return {void}
   */

  reset = (): void => {
    StorageService.write(STORAGE_KEYS.consent, 'pending')
    store.setState('pending')
  }
}

// Cookie consent status
export const ConsentService = new ConsentServiceClass('consent')
