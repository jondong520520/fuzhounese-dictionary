import { HomePage } from '@/components/home-page'
import { getAllDictionaryEntries } from '@/lib/dictionary-repo'

export default async function Home() {
  const entries = await getAllDictionaryEntries()
  return <HomePage entries={entries} />
}
