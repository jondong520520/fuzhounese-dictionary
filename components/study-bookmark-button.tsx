'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStudyList } from '@/contexts/study-list-context'
import { cn } from '@/lib/utils'

interface StudyBookmarkButtonProps {
  wordId: string
  className?: string
  stopPropagation?: boolean
}

export function StudyBookmarkButton({
  wordId,
  className,
  stopPropagation = false,
}: StudyBookmarkButtonProps) {
  const { isInStudyList, toggleStudyWord } = useStudyList()
  const saved = isInStudyList(wordId)

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation()
        toggleStudyWord(wordId)
      }}
      className={cn(
        'h-14 w-14 rounded-full border-2 shrink-0 transition-all duration-300',
        saved
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40',
        className
      )}
      aria-label={saved ? 'Remove from study list' : 'Add to study list'}
      aria-pressed={saved}
    >
      {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
    </Button>
  )
}
