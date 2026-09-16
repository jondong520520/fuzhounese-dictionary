'use client'

import { useState, useMemo } from 'react'
import { WordCard } from '@/components/word-card'
import { SearchBar } from '@/components/search-bar'
import { CategoryFilter, type CategoryOption } from '@/components/category-filter'
import type { DictionaryEntry } from '@/types/dictionary'
import { entryMatchesQuery } from '@/lib/dictionary-search'
import { BookOpen, Volume2 } from 'lucide-react'

function buildCategoryOptions(entries: DictionaryEntry[]): CategoryOption[] {
  const knownIcons: Record<string, string> = {
    greetings: '👋',
    food: '🍜',
    family: '👨‍👩‍👧',
    numbers: '🔢',
    daily: '☀️',
    'daily-life': '☀️',
    verb: '✏️',
    adjective: '🏷️',
    colors: '🎨',
    phrases: '💬',
    places: '📍',
  }

  const ids = Array.from(new Set(entries.map((e) => e.category).filter(Boolean))).sort()

  return [
    { id: 'all', label: 'All Words', icon: '📚' },
    ...ids.map((id) => ({
      id,
      label: id
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: knownIcons[id] ?? knownIcons[id.toLowerCase()] ?? '🔖',
    })),
  ]
}

interface DictionaryProps {
  entries: DictionaryEntry[]
}

export function Dictionary({ entries }: DictionaryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categoryOptions = useMemo(() => buildCategoryOptions(entries), [entries])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false
      }

      if (searchQuery.trim()) {
        return entryMatchesQuery(entry, searchQuery)
      }

      return true
    })
  }, [entries, searchQuery, selectedCategory])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <div className="mb-8 space-y-3">
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Browse</h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore the full word list by category, or refine with a search.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            categories={categoryOptions}
          />
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-xl bg-secondary/50 p-3 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4 text-primary" />
          <span>Click the speaker icon on any word to hear the pronunciation</span>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'word' : 'words'} found
        </p>

        {filteredEntries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEntries.map((entry) => (
              <WordCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-serif text-xl text-foreground">No words found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      <footer className="mt-8 border-t border-border/30">
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
