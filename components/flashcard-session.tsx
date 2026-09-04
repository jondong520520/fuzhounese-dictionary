'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { useStudyList } from '@/contexts/study-list-context'
import { requeueAfterRating, sortStudyIdsByDue } from '@/lib/study-persistence'
import type { FlashcardAnswerMode, ReviewRating } from '@/lib/study-persistence'
import { getDictionaryEntryById } from '@/lib/dictionary-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDictionaryAudio } from '@/hooks/use-dictionary-audio'
import { cn } from '@/lib/utils'

function formatNextReview(dueAt: number) {
  const ms = dueAt - Date.now()
  if (ms <= 0) return 'Due now'
  const mins = Math.round(ms / 60_000)
  if (mins < 60) return `~${mins} min`
  const hours = Math.round(ms / 3_600_000)
  if (hours < 48) return `~${hours} h`
  const days = Math.round(ms / 86_400_000)
  return `~${days} d`
}

function practiceLabel(mode: FlashcardAnswerMode) {
  switch (mode) {
    case 'fuzhounese':
      return 'Recall Fuzhounese (characters & pronunciation)'
    case 'mandarin':
      return 'Recall Mandarin'
    case 'english':
      return 'Recall English'
  }
}

function PromptBlock({
  entry,
  mode,
}: {
  entry: NonNullable<ReturnType<typeof getDictionaryEntryById>>
  mode: FlashcardAnswerMode
}) {
  if (mode === 'fuzhounese') {
    return (
      <div className="space-y-4 text-center">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mandarin</p>
          <p className="text-2xl md:text-3xl text-foreground">{entry.chinese}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">English</p>
          <p className="text-lg md:text-xl text-foreground/90">{entry.english}</p>
        </div>
      </div>
    )
  }
  if (mode === 'mandarin') {
    return (
      <div className="space-y-4 text-center">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Fuzhounese</p>
          <p className="font-serif text-3xl md:text-4xl text-foreground">{entry.fuzhounese}</p>
          <p className="text-lg text-primary italic mt-2">{entry.romanization}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">English</p>
          <p className="text-lg md:text-xl text-foreground/90">{entry.english}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-4 text-center">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Fuzhounese</p>
        <p className="font-serif text-3xl md:text-4xl text-foreground">{entry.fuzhounese}</p>
        <p className="text-lg text-primary italic mt-2">{entry.romanization}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mandarin</p>
        <p className="text-2xl md:text-3xl text-foreground">{entry.chinese}</p>
      </div>
    </div>
  )
}

function AnswerFuzhouneseBlock({
  entry,
}: {
  entry: NonNullable<ReturnType<typeof getDictionaryEntryById>>
}) {
  const { playAudio, isPlaying, hasError } = useDictionaryAudio(entry.chinese)
  return (
    <div className="space-y-5 text-center pt-2">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Fuzhounese</p>
        <p className="font-serif text-4xl md:text-5xl text-foreground">{entry.fuzhounese}</p>
        <p className="text-xl text-primary italic mt-2">{entry.romanization}</p>
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={playAudio}
          disabled={hasError}
          className={cn(
            'h-12 w-12 rounded-full border-2',
            isPlaying ? 'bg-primary text-primary-foreground border-primary' : 'border-primary/30'
          )}
          aria-label="Play Mandarin pronunciation"
        >
          {hasError ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {entry.chinese} · {entry.english}
      </p>
    </div>
  )
}

function AnswerBlock({
  entry,
  mode,
}: {
  entry: NonNullable<ReturnType<typeof getDictionaryEntryById>>
  mode: FlashcardAnswerMode
}) {
  if (mode === 'fuzhounese') {
    return <AnswerFuzhouneseBlock entry={entry} />
  }
  if (mode === 'mandarin') {
    return (
      <div className="text-center pt-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Mandarin</p>
        <p className="text-3xl md:text-4xl text-foreground">{entry.chinese}</p>
      </div>
    )
  }
  return (
    <div className="text-center pt-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">English</p>
      <p className="text-2xl md:text-3xl text-foreground/95">{entry.english}</p>
    </div>
  )
}

export function FlashcardSession() {
  const { wordIds, hydrated, progress, answerMode, recordReview } = useStudyList()
  const [queue, setQueue] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [reviewsCount, setReviewsCount] = useState(0)

  useEffect(() => {
    if (!hydrated) return
    setQueue((prev) => {
      const kept = prev.filter((id) => wordIds.includes(id))
      const missing = wordIds.filter((id) => !kept.includes(id))
      const combined = [...kept, ...missing]
      if (combined.length === 0) return []
      if (prev.length === 0) return sortStudyIdsByDue(combined, progress)
      if (missing.length > 0 || kept.length !== prev.length) {
        return sortStudyIdsByDue(combined, progress)
      }
      return prev
    })
  }, [hydrated, wordIds, progress])

  const currentId = queue[0]
  const entry = useMemo(() => (currentId ? getDictionaryEntryById(currentId) : undefined), [currentId])
  const nextDue = currentId ? progress[currentId]?.dueAt : undefined

  const handleRate = (rating: ReviewRating) => {
    if (!currentId) return
    recordReview(currentId, rating)
    setQueue((q) => requeueAfterRating(q, currentId, rating))
    setRevealed(false)
    setReviewsCount((c) => c + 1)
  }

  if (!hydrated) {
    return (
      <p className="text-center text-muted-foreground py-20 text-sm">Loading study data…</p>
    )
  }

  if (wordIds.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <p className="text-muted-foreground mb-6">Add words from the dictionary to your study list first.</p>
        <Button asChild>
          <Link href="/">Browse dictionary</Link>
        </Button>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <p className="text-muted-foreground mb-6">Could not load this card.</p>
        <Button variant="outline" asChild>
          <Link href="/study">Back to study list</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground shrink-0" asChild>
            <Link href="/study">
              <ArrowLeft className="h-4 w-4" />
              Study list
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground truncate">
            {queue.length} in queue · {reviewsCount} rated this session
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 flex flex-col">
        <p className="text-center text-xs text-muted-foreground mb-2">{practiceLabel(answerMode)}</p>
        {nextDue !== undefined && (
          <p className="text-center text-xs text-muted-foreground/80 mb-6">
            Next scheduled review: {formatNextReview(nextDue)}
          </p>
        )}

        <Card className="border-border/50 shadow-md flex-1 flex flex-col">
          <CardContent className="p-6 md:p-8 flex flex-col flex-1 justify-center min-h-[280px]">
            {!revealed ? (
              <>
                <PromptBlock entry={entry} mode={answerMode} />
                <div className="mt-10 flex justify-center">
                  <Button type="button" size="lg" className="min-w-[200px]" onClick={() => setRevealed(true)}>
                    Show answer
                  </Button>
                </div>
              </>
            ) : (
              <>
                <PromptBlock entry={entry} mode={answerMode} />
                <div className="my-6 border-t border-border/40" />
                <AnswerBlock entry={entry} mode={answerMode} />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRate('again')}
                  >
                    Don&apos;t know
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleRate('medium')}>
                    Medium
                  </Button>
                  <Button type="button" onClick={() => handleRate('good')}>
                    Know it
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Don&apos;t know returns soon; Medium later; Know it schedules farther out.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
