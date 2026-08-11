import type viewport from '@/configurations/system/viewport.json'
import type { RegistryKey } from '@/types/common'

export type BreakpointName = RegistryKey<typeof viewport.breakpoints>
export type MediaQueryName = RegistryKey<typeof viewport.mediaQueries>
