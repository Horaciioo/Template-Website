import type { Config } from 'tailwindcss'

import theme from './src/configurations/theme.json'
import timings from './src/configurations/system/timings.json'

// Tailwind needs static keys, the palette of theme.json is the only place a colour name is declared
const colors = Object.fromEntries(
  Object.keys(theme.colors.light).map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`])
)

const borderRadius = Object.fromEntries(
  Object.keys(theme.radii).map((name) => [name, `var(--radius-${name})`])
)

const boxShadow = Object.fromEntries(
  Object.keys(theme.shadows).map((name) => [name, `var(--shadow-${name})`])
)

const transitionDuration = Object.fromEntries(
  Object.keys(theme.durations).map((name) => [name, `var(--duration-${name})`])
)

// Layout rails
const layout = Object.fromEntries(
  Object.keys(theme.layout).map((name) => [name, `var(--layout-${name})`])
)

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      borderRadius,
      boxShadow,
      transitionDuration,
      maxWidth: layout,
      height: layout,
      minHeight: layout,
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(0.75rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          from: { opacity: '0', transform: 'translateX(0.75rem)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(1.5rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%, 55%': { backgroundPosition: '-140% 0' },
          '100%': { backgroundPosition: '240% 0' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(-0.35rem)' },
          '50%': { transform: 'translateY(0.35rem)' },
        },
        // The track holds the list twice, half a turn loops it seamlessly
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--duration-base) ease-out both',
        'slide-up': 'slide-up var(--duration-base) ease-out both',
        'slide-left': 'slide-left var(--duration-base) ease-out both',
        shimmer: `shimmer ${timings.shimmerDurationMs}ms linear infinite`,
        rise: 'rise var(--duration-slow) cubic-bezier(0.22, 1, 0.36, 1) both',
        shine: `shine ${timings.shineDurationMs}ms ease-in-out infinite`,
        drift: `drift ${timings.driftDurationMs}ms ease-in-out infinite`,
        marquee: `marquee ${timings.marqueeDurationMs}ms linear infinite`,
      },
    },
  },
  plugins: [],
}

export default config
