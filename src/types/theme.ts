import type theme from '@/configurations/theme.json'
import type { RegistryKey } from '@/types/common'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeScheme = 'light' | 'dark'

export type ColorName = RegistryKey<(typeof theme.colors)['light']>
export type RadiusName = RegistryKey<typeof theme.radii>
export type ShadowName = RegistryKey<typeof theme.shadows>
export type DurationName = RegistryKey<typeof theme.durations>
export type LayoutName = RegistryKey<typeof theme.layout>
