'use client'

import { StudyListProvider } from '@/contexts/study-list-context'

export function StudyProviders({ children }: { children: React.ReactNode }) {
  return <StudyListProvider>{children}</StudyListProvider>
}
