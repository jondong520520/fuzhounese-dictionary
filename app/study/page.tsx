import { StudyPage } from '@/components/study-page'
import { getAllDictionaryEntries } from '@/lib/dictionary-repo'

export default async function StudyRoutePage() {
  const entries = await getAllDictionaryEntries()
  return <StudyPage entries={entries} />
}
