export interface DictionaryEntry {
  id: string
  fuzhounese: string
  romanization: string
  chinese: string
  english: string
  category: string
  audioUrl?: string
  examples?: {
    fuzhounese: string
    romanization: string
    english: string
  }[]
}
