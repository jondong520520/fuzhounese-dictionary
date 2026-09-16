import { prisma } from '@/lib/prisma'
import type { DictionaryEntry } from '@/types/dictionary'

type PrismaDictionaryRow = {
  id: number
  english: string
  mandarin: string
  fuzhounese: string
  category: string
}

/** Map a Prisma row into the UI DictionaryEntry shape used by existing components. */
export function mapPrismaEntry(row: PrismaDictionaryRow): DictionaryEntry {
  return {
    id: String(row.id),
    english: row.english,
    // UI field name is `chinese`; DB column is `mandarin`
    chinese: row.mandarin,
    fuzhounese: row.fuzhounese,
    // Romanization is not stored in PostgreSQL yet
    romanization: '',
    category: row.category,
  }
}

/** Load all dictionary entries from PostgreSQL for browse/search. */
export async function getAllDictionaryEntries(): Promise<DictionaryEntry[]> {
  const rows = await prisma.dictionaryEntry.findMany({
    orderBy: { id: 'asc' },
  })
  return rows.map(mapPrismaEntry)
}

/** Load one entry by string id (UI uses string ids). */
export async function getDictionaryEntryByIdFromDb(
  id: string
): Promise<DictionaryEntry | undefined> {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return undefined

  const row = await prisma.dictionaryEntry.findUnique({
    where: { id: numericId },
  })
  return row ? mapPrismaEntry(row) : undefined
}
