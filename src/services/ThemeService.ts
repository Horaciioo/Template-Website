import { STORAGE_KEYS } from '@/declarations/analytics'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NamingService } from '@/services/NamingService'
import { StorageService } from '@/services/StorageService'
import { Service } from '@/structures/Service'
import type { ThemeMode, ThemeScheme } from '@/types/theme'
import { isBrowser } from '@/utils/guards'

const { colors, radii, shadows, durations, layout, defaultMode } = ConfigurationService.theme
const { darkScheme } = ConfigurationService.viewport.mediaQueries

// Theme attribute
const THEME_ATTRIBUTE = 'data-theme'

const declare = (group: string, entries: Record<string, string>): string =>
  Object.entries(entries)
    .map(([name, value]) => `${NamingService.toCssVariable(group, name)}:${value}`)
    .join(';')

class ThemeServiceClass extends Service {
  modes = ['light', 'dark', 'system'] as ThemeMode[]
  defaultMode = defaultMode as ThemeMode

  /**
   * Theme stylesheet
   * @return {string} - CSS
   */

  buildStyleSheet = (): string => {
    const base = [
      declare('color', colors.light),
      declare('radius', radii),
      declare('shadow', shadows),
      declare('duration', durations),
      declare('layout', layout),
    ].join(';')
    const dark = declare('color', colors.dark)

    return [
      `:root{${base}}`,
      `:root[${THEME_ATTRIBUTE}="dark"]{${dark}}`,
      `@media(prefers-color-scheme:dark){:root:not([${THEME_ATTRIBUTE}="light"]){${dark}}}`,
    ].join('')
  }

  /**
   * Boot script for theme
   * @return {string} - Script code
   */

  buildBootScript = (): string => {
    const key = StorageService.buildKey(STORAGE_KEYS.themeMode)

    return `try{var m=JSON.parse(localStorage.getItem('${key}'))||'${defaultMode}';var d=m==='dark'||(m==='system'&&matchMedia('${darkScheme}').matches);document.documentElement.setAttribute('${THEME_ATTRIBUTE}',d?'dark':'light')}catch(e){}`
  }

  /**
   * Resolve scheme
   * @param {ThemeMode} mode - Mode
   * @return {ThemeScheme} - Scheme
   */

  resolveScheme = (mode: ThemeMode): ThemeScheme => {
    if (mode !== 'system') return mode
    if (!isBrowser()) return 'light'

    return window.matchMedia(darkScheme).matches ? 'dark' : 'light'
  }

  /**
   * Read mode
   * @return {ThemeMode} - Mode
   */

  readMode = (): ThemeMode => {
    const stored = StorageService.read<ThemeMode>(STORAGE_KEYS.themeMode)

    return stored && this.modes.includes(stored) ? stored : (defaultMode as ThemeMode)
  }

  /**
   * Select mode
   * @param {ThemeMode} mode - Mode
   * @return {void}
   */

  select = (mode: ThemeMode): void => {
    StorageService.write(STORAGE_KEYS.themeMode, mode)
    this.apply(mode)
  }

  /**
   * Apply scheme
   * @param {ThemeMode} mode - Mode
   * @return {void}
   */

  apply = (mode: ThemeMode): void => {
    if (!isBrowser()) return
    document.documentElement.setAttribute(THEME_ATTRIBUTE, this.resolveScheme(mode))
  }

  /**
   * Follow the operating system preference while the visitor stays on `system`
   * @param {() => void} onChange - Reaction to a system change
   * @return {() => void} - Teardown
   */

  watchSystem = (onChange: () => void): (() => void) => {
    if (!isBrowser()) return () => undefined

    const media = window.matchMedia(darkScheme)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }
}

// Theme CSS variables
export const ThemeService = new ThemeServiceClass('theme')
