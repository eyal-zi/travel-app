import type { ReactNode } from 'react'

export type AdminPageShellProps = {
  title: string
  subtitle: string
  // Cap on the content column width. Defaults to the standard admin width; pass
  // a larger value for pages (e.g. file search) that need more horizontal room.
  maxWidth?: number
  children: ReactNode
}
