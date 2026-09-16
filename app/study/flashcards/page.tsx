import { FlashcardSession } from '@/components/flashcard-session'
import { getAllDictionaryEntries } from '@/lib/dictionary-repo'

export default async function FlashcardsPage() {
  const entries = await getAllDictionaryEntries()
  return <FlashcardSession entries={entries} />
}
