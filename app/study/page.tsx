'use client'

import Link from 'next/link'
import { ArrowLeft, Layers, Trash2 } from 'lucide-react'
import { useStudyList } from '@/contexts/study-list-context'
import { getDictionaryEntryById } from '@/lib/dictionary-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StudyPage() {
  const {
    hydrated,
    wordIds,
    answerMode,
    setAnswerMode,
    removeStudyWord,
    getProgress,
  } = useStudyList()

  function formatDue(dueAt: number) {
    const ms = dueAt - Date.now()
    if (ms <= 0) return 'Due now'
    const mins = Math.round(ms / 60_000)
    if (mins < 120) return `in ~${mins} min`
    const hours = Math.round(ms / 3_600_000)
    if (hours < 72) return `in ~${hours} h`
    const days = Math.round(ms / 86_400_000)
    return `in ~${days} d`
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3 justify-between">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Dictionary
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Study list</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Words you bookmark appear here. Choose what you want to recall on flashcards, then start a
            session.
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Flashcard prompt</p>
                <p className="text-xs text-muted-foreground max-w-md">
                  Pick which language you are trying to produce. The card hides that side until you tap
                  Show answer.
                </p>
                <Select
                  value={answerMode}
                  onValueChange={(v) =>
                    setAnswerMode(v as 'fuzhounese' | 'mandarin' | 'english')
                  }
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Recall language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuzhounese">Recall Fuzhounese (see Mandarin + English)</SelectItem>
                    <SelectItem value="mandarin">Recall Mandarin (see Fuzhounese + English)</SelectItem>
                    <SelectItem value="english">Recall English (see Fuzhounese + Mandarin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {wordIds.length === 0 ? (
                <Button className="shrink-0 gap-2" disabled type="button">
                  <Layers className="h-4 w-4" />
                  Start flashcards
                </Button>
              ) : (
                <Button className="shrink-0 gap-2" asChild>
                  <Link href="/study/flashcards">
                    <Layers className="h-4 w-4" />
                    Start flashcards
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {wordIds.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-border/60">
            <p className="text-muted-foreground mb-4">Your study list is empty.</p>
            <Button variant="outline" asChild>
              <Link href="/">Find words in the dictionary</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {wordIds.map((id) => {
              const entry = getDictionaryEntryById(id)
              const p = getProgress(id)
              if (!entry) return null
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/50 px-4 py-3"
                >
                  <Link
                    href={`/word/${id}`}
                    className="flex-1 min-w-0 font-serif text-lg text-foreground hover:text-primary transition-colors"
                  >
                    {entry.fuzhounese}
                    <span className="block text-xs font-sans text-muted-foreground font-normal mt-0.5">
                      {entry.romanization} · {entry.english}
                    </span>
                    {p && (
                      <span className="block text-xs text-muted-foreground/80 mt-1">
                        Next review {formatDue(p.dueAt)}
                      </span>
                    )}
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label={`Remove ${entry.fuzhounese} from study list`}
                    onClick={() => removeStudyWord(id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}
