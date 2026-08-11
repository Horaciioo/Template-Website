import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

/**
 * Internationalization middleware
 * @return {Function} - Next.js middleware handler
 */

export default createMiddleware(routing)

export const config = {
  // Match paths
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
