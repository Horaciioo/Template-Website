import { Inter, Sora } from 'next/font/google'

/**
 * Project fonts
 * @type {Object}
 */

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

/**
 * Font CSS variables
 * @type {string}
 */

export const FONT_VARIABLES = `${sans.variable} ${display.variable}`
