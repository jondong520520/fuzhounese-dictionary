'use client'

import { useState, useMemo } from 'react'
import { WordCard } from '@/components/word-card'
import { SearchBar } from '@/components/search-bar'
import { CategoryFilter } from '@/components/category-filter'
import { dictionaryEntries } from '@/lib/dictionary-data'
import { BookOpen, Volume2 } from 'lucide-react'

export function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredEntries = useMemo(() => {
    return dictionaryEntries.filter((entry) => {
      // Category filter
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          entry.fuzhounese.includes(searchQuery) ||
          entry.romanization.toLowerCase().includes(query) ||
          entry.chinese.includes(searchQuery) ||
          entry.english.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">
              Hók-ciŭ-uâ
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            A modern Fuzhounese dictionary with audio pronunciations
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search and filters */}
        <div className="space-y-4 mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter 
            selected={selectedCategory} 
            onSelect={setSelectedCategory} 
          />
        </div>

        {/* Audio tip */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-secondary/50 rounded-xl">
          <Volume2 className="h-4 w-4 text-primary" />
          <span>Click the speaker icon on any word to hear the pronunciation</span>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'word' : 'words'} found
        </p>

        {/* Word grid */}
        {filteredEntries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEntries.map((entry) => (
              <WordCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">No words found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Preserving the beautiful language of Fuzhou
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            福州話 • Eastern Min • 閩東語
          </p>
        </div>
      </footer>
    </div>
  )
}
