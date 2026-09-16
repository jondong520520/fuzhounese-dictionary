import type { DictionaryEntry } from '@/types/dictionary'

export type MatchRank = 'exact' | 'prefix' | 'contains'

const RANK_SCORE: Record<MatchRank, number> = {
  exact: 0,
  prefix: 1,
  contains: 2,
}

function rankLatinField(field: string, query: string): MatchRank | null {
  const f = field.toLowerCase()
  const q = query.toLowerCase()
  if (!f) return null
  if (f === q) return 'exact'
  if (f.startsWith(q)) return 'prefix'
  if (f.includes(q)) return 'contains'
  return null
}

function rankCjkField(field: string, query: string): MatchRank | null {
  if (!field) return null
  if (field === query) return 'exact'
  if (field.startsWith(query)) return 'prefix'
  if (field.includes(query)) return 'contains'
  return null
}

function bestRankForEntry(entry: DictionaryEntry, query: string): MatchRank | null {
  // Fuzhounese column may hold characters or romanization depending on data source
  const ranks: Array<MatchRank | null> = [
    rankLatinField(entry.english, query),
    rankLatinField(entry.romanization, query),
    rankLatinField(entry.fuzhounese, query),
    rankCjkField(entry.chinese, query),
    rankCjkField(entry.fuzhounese, query),
  ]

  let best: MatchRank | null = null
  for (const rank of ranks) {
    if (!rank) continue
    if (!best || RANK_SCORE[rank] < RANK_SCORE[best]) {
      best = rank
    }
  }
  return best
}

/** All matching entries from the provided list, ranked exact → prefix → contains. */
export function searchDictionary(
  query: string,
  entries: DictionaryEntry[]
): DictionaryEntry[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  return entries
    .map((entry) => {
      const rank = bestRankForEntry(entry, trimmed)
      return rank ? { entry, rank } : null
    })
    .filter((item): item is { entry: DictionaryEntry; rank: MatchRank } => item !== null)
    .sort((a, b) => {
      const scoreDiff = RANK_SCORE[a.rank] - RANK_SCORE[b.rank]
      if (scoreDiff !== 0) return scoreDiff
      return a.entry.english.localeCompare(b.entry.english)
    })
    .map((item) => item.entry)
}

/** Top autocomplete suggestions (default 6). */
export function getAutocompleteSuggestions(
  query: string,
  entries: DictionaryEntry[],
  limit = 6
): DictionaryEntry[] {
  return searchDictionary(query, entries).slice(0, limit)
}

/**
 * True exact match on any primary field.
 * Returns the entry only when there is exactly one such entry.
 */
export function findUniqueExactMatch(
  query: string,
  entries: DictionaryEntry[]
): DictionaryEntry | undefined {
  const trimmed = query.trim()
  if (!trimmed) return undefined

  const q = trimmed.toLowerCase()
  const exact = entries.filter((entry) => {
    return (
      entry.english.toLowerCase() === q ||
      entry.romanization.toLowerCase() === q ||
      entry.fuzhounese.toLowerCase() === q ||
      entry.chinese === trimmed ||
      entry.fuzhounese === trimmed
    )
  })

  return exact.length === 1 ? exact[0] : undefined
}

export function entryMatchesQuery(entry: DictionaryEntry, query: string): boolean {
  return bestRankForEntry(entry, query.trim()) !== null
}
