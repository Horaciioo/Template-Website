import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

/**
 * Internationalization proxy
 * @return {Function} - Next.js proxy handler
 */

export default createMiddleware(routing)

export const config = {
  // Match paths
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
