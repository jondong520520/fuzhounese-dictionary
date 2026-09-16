import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WordDetail } from '@/components/word-detail'
import {
  getAllDictionaryEntries,
  getDictionaryEntryByIdFromDb,
} from '@/lib/dictionary-repo'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const entries = await getAllDictionaryEntries()
  return entries.map((entry) => ({ id: entry.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const entry = await getDictionaryEntryByIdFromDb(id)
  if (!entry) {
    return { title: 'Word not found | FuzhouneseDict' }
  }
  const titleExtra = entry.romanization ? ` (${entry.romanization})` : ''
  return {
    title: `${entry.fuzhounese}${titleExtra} | FuzhouneseDict`,
    description: `${entry.chinese} — ${entry.english}`,
  }
}

export default async function WordPage({ params }: Props) {
  const { id } = await params
  const entry = await getDictionaryEntryByIdFromDb(id)
  if (!entry) {
    notFound()
  }
  return <WordDetail entry={entry} />
}
