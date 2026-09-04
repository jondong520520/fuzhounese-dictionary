'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { useStudyList } from '@/contexts/study-list-context'
import { cn } from '@/lib/utils'

export function StudyNavLink({ className }: { className?: string }) {
  const { studyCount } = useStudyList()

  return (
    <Link
      href="/study"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/70',
        className
      )}
    >
      <GraduationCap className="h-4 w-4 text-primary" aria-hidden />
      Study
      {studyCount > 0 ? (
        <span className="tabular-nums rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
          {studyCount}
        </span>
      ) : null}
    </Link>
  )
}
