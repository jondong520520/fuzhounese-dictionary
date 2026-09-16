import { Dictionary } from '@/components/dictionary'
import { getAllDictionaryEntries } from '@/lib/dictionary-repo'

export default async function BrowsePage() {
  const entries = await getAllDictionaryEntries()
  return <Dictionary entries={entries} />
}
