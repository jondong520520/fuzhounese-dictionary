'use client'

import Link from 'next/link'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { DictionaryEntry } from '@/types/dictionary'
import { StudyBookmarkButton } from '@/components/study-bookmark-button'
import { useDictionaryAudio } from '@/hooks/use-dictionary-audio'
import { cn } from '@/lib/utils'

interface WordDetailProps {
  entry: DictionaryEntry
}

export function WordDetail({ entry }: WordDetailProps) {
  const { playAudio, isPlaying, hasError } = useDictionaryAudio(entry.chinese)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
            <Link href="/browse">
              <ArrowLeft className="h-4 w-4" />
              Back to browse
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/study">Study list</Link>
            </Button>
            <StudyBookmarkButton wordId={entry.id} className="h-11 w-11" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Fuzhounese
                  </p>
                  <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-wide">
                    {entry.fuzhounese}
                  </h1>
                  <p className="text-xl md:text-2xl text-primary font-medium mt-3 italic">
                    {entry.romanization}
                  </p>
                </div>

                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Mandarin
                    </dt>
                    <dd className="text-lg text-foreground">{entry.chinese}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      English
                    </dt>
                    <dd className="text-lg text-foreground/90">{entry.english}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Category
                    </dt>
                    <dd>
                      <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-secondary text-secondary-foreground">
                        {entry.category}
                      </span>
                    </dd>
                  </div>
                </dl>

                {entry.examples && entry.examples.length > 0 && (
                  <div className="pt-6 border-t border-border/30">
                    <h2 className="text-sm font-medium text-foreground mb-4">Example sentences</h2>
                    <ul className="space-y-5">
                      {entry.examples.map((example, idx) => (
                        <li
                          key={idx}
                          className="pl-4 border-l-2 border-accent/50 space-y-1.5"
                        >
                          <p className="font-serif text-xl text-foreground">{example.fuzhounese}</p>
                          <p className="text-base text-primary italic">{example.romanization}</p>
                          <p className="text-sm text-muted-foreground">{example.english}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={playAudio}
                disabled={hasError}
                className={cn(
                  'h-14 w-14 rounded-full border-2 shrink-0 transition-all duration-300',
                  isPlaying
                    ? 'bg-primary text-primary-foreground border-primary scale-110'
                    : 'border-primary/30 text-primary hover:bg-primary/10 hover:border-primary'
                )}
                aria-label="Play pronunciation"
              >
                {hasError ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className={cn('h-6 w-6 transition-transform', isPlaying && 'animate-pulse')} />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
