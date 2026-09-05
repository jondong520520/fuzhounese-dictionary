import { Suspense } from 'react'
import { SearchResultsPage } from '@/components/search-results-page'

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading search…
        </div>
      }
    >
      <SearchResultsPage />
    </Suspense>
  )
}
