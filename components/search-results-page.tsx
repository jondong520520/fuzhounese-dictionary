'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { DictionarySearchBox } from '@/components/dictionary-search-box'
import { WordCard } from '@/components/word-card'
import { searchDictionary } from '@/lib/dictionary-search'
import type { DictionaryEntry } from '@/types/dictionary'

interface SearchResultsPageProps {
  entries: DictionaryEntry[]
}

export function SearchResultsPage({ entries }: SearchResultsPageProps) {
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()

  const results = useMemo(() => searchDictionary(query, entries), [query, entries])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <div className="mb-8 space-y-4">
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Search</h1>
          {query ? (
            <p className="text-muted-foreground">
              Search results for{' '}
              <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Enter a word in English, Mandarin, or Fuzhounese romanization.
            </p>
          )}

          <div className="max-w-2xl">
            <DictionarySearchBox
              entries={entries}
              initialQuery={query}
              autoFocus={!query}
            />
          </div>
        </div>

        {query ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>

            {results.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((entry) => (
                  <WordCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <BookOpen className="h-7 w-7 text-muted-foreground" aria-hidden />
                </div>
                <h2 className="font-serif text-xl text-foreground">
                  No results found for &ldquo;{query}&rdquo;
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different English or Mandarin spelling
                </p>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
