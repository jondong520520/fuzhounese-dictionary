import Link from 'next/link'

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Favorites</h1>
      <p className="mt-3 text-muted-foreground">
        Saved words will appear here. This page is a placeholder for now.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Looking for your study bookmarks?{' '}
        <Link href="/study" className="text-primary underline-offset-4 hover:underline">
          Open Study
        </Link>
      </p>
    </div>
  )
}
