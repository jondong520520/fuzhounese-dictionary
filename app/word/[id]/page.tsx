import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WordDetail } from '@/components/word-detail'
import { dictionaryEntries, getDictionaryEntryById } from '@/lib/dictionary-data'

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return dictionaryEntries.map((entry) => ({ id: entry.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const entry = getDictionaryEntryById(id)
  if (!entry) {
    return { title: 'Word not found | FuzhouneseDict' }
  }
  return {
    title: `${entry.fuzhounese} (${entry.romanization}) | FuzhouneseDict`,
    description: `${entry.chinese} — ${entry.english}`,
  }
}

export default async function WordPage({ params }: Props) {
  const { id } = await params
  const entry = getDictionaryEntryById(id)
  if (!entry) {
    notFound()
  }
  return <WordDetail entry={entry} />
}
