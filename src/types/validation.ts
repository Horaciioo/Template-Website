import type validation from '@/configurations/system/validation.json'
import type { RegistryKey } from '@/types/common'

export type LimitName = RegistryKey<typeof validation.limits>
