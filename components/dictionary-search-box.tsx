'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import {
  findUniqueExactMatch,
  getAutocompleteSuggestions,
} from '@/lib/dictionary-search'
import { cn } from '@/lib/utils'
import type { DictionaryEntry } from '@/types/dictionary'

interface DictionarySearchBoxProps {
  entries: DictionaryEntry[]
  initialQuery?: string
  size?: 'default' | 'hero'
  autoFocus?: boolean
  placeholder?: string
  className?: string
}

export function DictionarySearchBox({
  entries,
  initialQuery = '',
  size = 'default',
  autoFocus = false,
  placeholder = 'Search a word in English or Mandarin',
  className,
}: DictionarySearchBoxProps) {
  const router = useRouter()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const suggestions = useMemo(
    () => getAutocompleteSuggestions(query, entries, 6),
    [query, entries]
  )

  const showDropdown = open && query.trim().length > 0 && suggestions.length > 0

  useEffect(() => {
    setHighlightIndex(-1)
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setHighlightIndex(-1)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function goToWord(entry: DictionaryEntry) {
    setOpen(false)
    setHighlightIndex(-1)
    router.push(`/word/${entry.id}`)
  }

  function submitSearch(rawQuery: string) {
    const trimmed = rawQuery.trim()
    if (!trimmed) return

    const exact = findUniqueExactMatch(trimmed, entries)
    if (exact) {
      setOpen(false)
      router.push(`/word/${exact.id}`)
      return
    }

    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      if (!suggestions.length) return
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
      return
    }

    if (event.key === 'ArrowUp') {
      if (!suggestions.length) return
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      )
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setHighlightIndex(-1)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (showDropdown && highlightIndex >= 0 && suggestions[highlightIndex]) {
        goToWord(suggestions[highlightIndex])
        return
      }
      submitSearch(query)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative w-full text-left', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submitSearch(query)
        }}
      >
        <SearchBar
          value={query}
          onChange={(value) => {
            setQuery(value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          size={size}
          autoFocus={autoFocus}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && highlightIndex >= 0
              ? `${listId}-option-${highlightIndex}`
              : undefined
          }
        />
      </form>

      {showDropdown ? (
        <ul
          id={listId}
          role="listbox"
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-white shadow-md',
            size === 'hero' && 'rounded-2xl'
          )}
        >
          {suggestions.map((entry, index) => {
            const selected = index === highlightIndex
            return (
              <li key={entry.id} role="presentation">
                <button
                  type="button"
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(e) => {
                    // Prevent input blur before click navigates
                    e.preventDefault()
                  }}
                  onClick={() => goToWord(entry)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                    selected ? 'bg-secondary' : 'hover:bg-secondary/70'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {entry.english}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      <span className="font-serif text-foreground/90">
                        {entry.fuzhounese}
                      </span>
                      {entry.romanization ? (
                        <>
                          <span className="mx-1.5 text-border">·</span>
                          <span className="italic text-primary">
                            {entry.romanization}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">
                    {entry.chinese}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
