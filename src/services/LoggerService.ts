import { LOG_LEVELS } from '@/declarations/analytics'
import type { LogLevel } from '@/declarations/analytics'
import { ConfigurationService } from '@/services/ConfigurationService'
import { EnvironmentService } from '@/services/EnvironmentService'

// Silent in production
const isSilent = (level: LogLevel): boolean =>
  EnvironmentService.isProduction && (level === LOG_LEVELS.debug || level === LOG_LEVELS.info)

const emit = (level: LogLevel, scope: string, payload?: unknown) => {
  if (isSilent(level)) return
  const prefix = `[${ConfigurationService.site.shortName}:${scope}]`

  if (payload === undefined) console[level](prefix)
  else console[level](prefix, payload)
}

// Console logging
export const LoggerService = {
  debug: (scope: string, payload?: unknown): void => emit(LOG_LEVELS.debug, scope, payload),
  info: (scope: string, payload?: unknown): void => emit(LOG_LEVELS.info, scope, payload),
  warn: (scope: string, payload?: unknown): void => emit(LOG_LEVELS.warn, scope, payload),
  error: (scope: string, payload?: unknown): void => emit(LOG_LEVELS.error, scope, payload),
} as const
