import { Suspense } from 'react'
import { SearchResultsPage } from '@/components/search-results-page'
import { getAllDictionaryEntries } from '@/lib/dictionary-repo'

export default async function SearchPage() {
  const entries = await getAllDictionaryEntries()

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading search…
        </div>
      }
    >
      <SearchResultsPage entries={entries} />
    </Suspense>
  )
}
