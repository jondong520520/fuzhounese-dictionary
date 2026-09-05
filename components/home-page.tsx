'use client'

import { useMemo, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { WordCard } from '@/components/word-card'
import { dictionaryEntries } from '@/lib/dictionary-data'
import './home-title.css'

function matchesQuery(query: string, entry: (typeof dictionaryEntries)[number]) {
  const normalized = query.toLowerCase()
  return (
    entry.fuzhounese.includes(query) ||
    entry.romanization.toLowerCase().includes(normalized) ||
    entry.chinese.includes(query) ||
    entry.english.toLowerCase().includes(normalized)
  )
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const trimmedQuery = searchQuery.trim()
  const isSearching = trimmedQuery.length > 0

  const results = useMemo(() => {
    if (!isSearching) return []
    return dictionaryEntries.filter((entry) => matchesQuery(trimmedQuery, entry))
  }, [isSearching, trimmedQuery])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
      <main>
        <section className="px-4 pb-10 pt-16 sm:pb-14 sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="home-title-word">Fuzhounese</span>{' '}
              <span className="home-title-word home-title-word--delay">Dictionary</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Search a word in English or Mandarin
            </p>

            <div className="mt-8 sm:mt-10">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search a word in English or Mandarin"
                size="hero"
                autoFocus
              />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            {isSearching ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {results.length} {results.length === 1 ? 'word' : 'words'} found
                </p>
                {results.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {results.map((entry) => (
                      <WordCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/40 bg-card/60 px-6 py-14 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                      <BookOpen className="h-7 w-7 text-muted-foreground" aria-hidden />
                    </div>
                    <h2 className="font-serif text-xl text-foreground">No words found</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try a different English or Mandarin spelling
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </section>

        <section className="border-t border-border bg-secondary px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                About Fuzhounese
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Fuzhounese (福州話) is a variety of Eastern Min spoken in and around Fuzhou,
                Fujian. It has its own sound system, tones, and vocabulary that set it apart from
                Mandarin. Placeholder copy for now — this section will later introduce the language,
                writing conventions, and who speaks it today.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                Why This Dictionary Exists
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Many speakers grow up with Fuzhounese at home but have few tools for looking up
                words or teaching them to the next generation. This project aims to make everyday
                vocabulary easier to find, hear, and remember. Placeholder copy for now — more
                context on the community and preservation goals will go here.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Preserving the beautiful language of Fuzhou
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            福州話 • Eastern Min • 閩東語
          </p>
        </div>
      </footer>
    </div>
  )
}
