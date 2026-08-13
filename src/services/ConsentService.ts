import { CONSENT_CATEGORIES, STORAGE_KEYS } from '@/declarations/analytics'
import type { ConsentCategory } from '@/declarations/analytics'
import { createStore } from '@/services/core/StoreService'
import { StorageService } from '@/services/StorageService'
import { Service } from '@/structures/Service'
import type {
  ConsentCategoryDeclaration,
  ConsentPreferences,
  ConsentState,
  ConsentStatus,
} from '@/types/consent'
import { isDefined } from '@/utils/guards'

const CATEGORIES: Record<ConsentCategory, ConsentCategoryDeclaration> = CONSENT_CATEGORIES
const CATEGORY_IDS = Object.keys(CATEGORIES) as ConsentCategory[]

const buildPreferences = (isAccepted: boolean): ConsentPreferences =>
  Object.fromEntries(
    CATEGORY_IDS.map((id) => [id, CATEGORIES[id].isRequired || isAccepted])
  ) as ConsentPreferences

const INITIAL_STATE: ConsentState = { status: 'pending', preferences: buildPreferences(false) }

// Anything but a full state falls back to a pending choice
const readStored = (): ConsentState => {
  const stored = StorageService.read<Partial<ConsentState>>(STORAGE_KEYS.consent)

  if (!isDefined(stored?.status) || !isDefined(stored.preferences)) return INITIAL_STATE

  return {
    status: stored.status,
    preferences: {
      ...INITIAL_STATE.preferences,
      ...stored.preferences,
    },
  }
}

const store = createStore<ConsentState>(INITIAL_STATE, {
  activate: (setState) => {
    setState(readStored())

    return () => undefined
  },
})

// A choice counts as granted as soon as one optional category is kept
const statusOf = (preferences: ConsentPreferences): ConsentStatus =>
  CATEGORY_IDS.some((id) => !CONSENT_CATEGORIES[id].isRequired && preferences[id])
    ? 'granted'
    : 'denied'

class ConsentServiceClass extends Service {
  /**
   * Follow consent state
   * @return {ConsentState} - Current state
   */

  use = (): ConsentState => store.use()

  /**
   * Offered categories
   * @return {ConsentCategory[]} - Categories of this project
   */

  categories = (): ConsentCategory[] =>
    CATEGORY_IDS.filter((id) => {
      const { feature } = CATEGORIES[id]

      return !isDefined(feature) || this.config.isEnabled(feature)
    })

  /**
   * Anything to actually choose
   * @return {boolean} - At least one optional category
   */

  hasChoices = (): boolean => this.categories().some((id) => !this.isRequired(id))

  /**
   * Locked category
   * @param {ConsentCategory} category - Category
   * @return {boolean} - Required flag
   */

  isRequired = (category: ConsentCategory): boolean => CATEGORIES[category].isRequired

  /**
   * Read one category
   * @param {ConsentCategory} category - Category
   * @return {boolean} - Accepted flag
   */

  allows = (category: ConsentCategory): boolean => store.getState().preferences[category]

  /**
   * Store a choice
   * @param {ConsentPreferences} preferences - Chosen categories
   * @return {void}
   */

  save = (preferences: ConsentPreferences): void => {
    const state: ConsentState = { status: statusOf(preferences), preferences }

    StorageService.write(STORAGE_KEYS.consent, state)
    store.setState(state)
  }

  /**
   * Accept every category
   * @return {void}
   */

  grant = (): void => this.save(buildPreferences(true))

  /**
   * Keep the required categories only
   * @return {void}
   */

  deny = (): void => this.save(buildPreferences(false))

  /**
   * Forget the choice
   * @return {void}
   */

  reset = (): void => {
    StorageService.write(STORAGE_KEYS.consent, INITIAL_STATE)
    store.setState(INITIAL_STATE)
  }
}

// Cookie consent state
export const ConsentService = new ConsentServiceClass('consent')
