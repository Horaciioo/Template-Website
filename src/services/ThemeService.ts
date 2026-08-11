import { STORAGE_KEYS } from '@/declarations/analytics'
import { ConfigurationService } from '@/services/ConfigurationService'
import { NamingService } from '@/services/NamingService'
import { StorageService } from '@/services/StorageService'
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

/**
 * Theme CSS variables
 */

export const ThemeService = {
  modes: ['light', 'dark', 'system'] as ThemeMode[],
  defaultMode: defaultMode as ThemeMode,

  /**
   * Build the stylesheet injected in the document head, the only source of the theme variables
   * @return {string} - CSS text
   */

  buildStyleSheet: (): string => {
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
  },

  /**
   * Boot script for theme
   * @return {string} - Script code
   */

  buildBootScript: (): string => {
    const key = StorageService.buildKey(STORAGE_KEYS.themeMode)

    return `try{var m=JSON.parse(localStorage.getItem('${key}'))||'${defaultMode}';var d=m==='dark'||(m==='system'&&matchMedia('${darkScheme}').matches);document.documentElement.setAttribute('${THEME_ATTRIBUTE}',d?'dark':'light')}catch(e){}`
  },

  /**
   * Resolve the scheme actually painted, `system` following the operating system
   * @param {ThemeMode} mode - Selected mode
   * @return {ThemeScheme} - Painted scheme
   */

  resolveScheme: (mode: ThemeMode): ThemeScheme => {
    if (mode !== 'system') return mode
    if (!isBrowser()) return 'light'

    return window.matchMedia(darkScheme).matches ? 'dark' : 'light'
  },

  /**
   * Read the mode remembered by the browser
   * @return {ThemeMode} - Stored mode, the configured default when nothing is stored
   */

  readMode: (): ThemeMode => {
    const stored = StorageService.read<ThemeMode>(STORAGE_KEYS.themeMode)

    return stored && ThemeService.modes.includes(stored) ? stored : (defaultMode as ThemeMode)
  },

  /**
   * Paint a mode and remember it
   * @param {ThemeMode} mode - Mode chosen by the visitor
   * @return {void}
   */

  select: (mode: ThemeMode): void => {
    StorageService.write(STORAGE_KEYS.themeMode, mode)
    ThemeService.apply(mode)
  },

  /**
   * Write the resolved scheme on the document, the single place the attribute is set
   * @param {ThemeMode} mode - Selected mode
   * @return {void}
   */

  apply: (mode: ThemeMode): void => {
    if (!isBrowser()) return
    document.documentElement.setAttribute(THEME_ATTRIBUTE, ThemeService.resolveScheme(mode))
  },

  /**
   * Follow the operating system preference while the visitor stays on `system`
   * @param {() => void} onChange - Reaction to a system change
   * @return {() => void} - Teardown
   */

  watchSystem: (onChange: () => void): (() => void) => {
    if (!isBrowser()) return () => undefined

    const media = window.matchMedia(darkScheme)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  },
} as const
