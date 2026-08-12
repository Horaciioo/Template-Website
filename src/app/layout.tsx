import type { ReactNode } from 'react'

export interface RootLayoutProps {
  children: ReactNode
}

// Next.js requires a root layout for not-found.tsx; html/body live in [locale]/layout.tsx
export default function RootLayout({ children }: RootLayoutProps) {
  return children
}
