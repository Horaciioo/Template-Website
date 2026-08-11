'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { IconButton } from '@/components/elements/actions/IconButton'
import type { IconName } from '@/declarations/ui/icons'
import { AnalyticsService } from '@/services/AnalyticsService'
import { ThemeService } from '@/services/ThemeService'
import type { Styleable } from '@/types/common'
import type { ThemeMode } from '@/types/theme'

// Theme cycle config
const CYCLE: Record<ThemeMode, { icon: IconName; next: ThemeMode }> = {
  light: { icon: 'themeLight', next: 'dark' },
  dark: { icon: 'themeDark', next: 'system' },
  system: { icon: 'themeSystem', next: 'light' },
}

/**
 * Theme switcher
 * @param {Styleable} props - Theme switcher props
 * @return {JSX.Element} - Rendered switcher
 */

export const ThemeSwitcher = ({ className }: Styleable) => {
  const t = useTranslations('navigation.theme')
  const [mode, setMode] = useState<ThemeMode>(ThemeService.defaultMode)

  // Sync with storage
  useEffect(() => {
    setMode(ThemeService.readMode())

    return ThemeService.watchSystem(() => ThemeService.apply(ThemeService.readMode()))
  }, [])

  const select = () => {
    const next = CYCLE[mode].next

    setMode(next)
    ThemeService.select(next)
    AnalyticsService.track('themeChanged', { mode: next })
  }

  return (
    <IconButton
      icon={CYCLE[mode].icon}
      label={t(mode)}
      size="sm"
      className={className}
      onClick={select}
    />
  )
}
