'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  CardProgress,
  FlashcardAnswerMode,
  ReviewRating,
  StudyStoreV1,
} from '@/lib/study-persistence'
import {
  applyRating,
  defaultCardProgress,
  loadStudyStore,
  saveStudyStore,
} from '@/lib/study-persistence'

interface StudyListContextValue {
  hydrated: boolean
  wordIds: string[]
  progress: Record<string, CardProgress>
  answerMode: FlashcardAnswerMode
  setAnswerMode: (mode: FlashcardAnswerMode) => void
  toggleStudyWord: (id: string) => void
  removeStudyWord: (id: string) => void
  isInStudyList: (id: string) => boolean
  recordReview: (id: string, rating: ReviewRating) => void
  getProgress: (id: string) => CardProgress | undefined
  studyCount: number
}

const StudyListContext = createContext<StudyListContextValue | null>(null)

export function StudyListProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyStoreV1>(() => ({
    version: 1,
    wordIds: [],
    progress: {},
    answerMode: 'fuzhounese',
  }))
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadStudyStore())
    setHydrated(true)
  }, [])

  const persist = useCallback((updater: (prev: StudyStoreV1) => StudyStoreV1) => {
    setState((prev) => {
      const next = updater(prev)
      saveStudyStore(next)
      return next
    })
  }, [])

  const toggleStudyWord = useCallback(
    (id: string) => {
      persist((prev) => {
        const has = prev.wordIds.includes(id)
        const wordIds = has ? prev.wordIds.filter((x) => x !== id) : [...prev.wordIds, id]
        const progress = { ...prev.progress }
        if (has) {
          delete progress[id]
        } else if (!progress[id]) {
          progress[id] = defaultCardProgress()
        }
        return { ...prev, wordIds, progress }
      })
    },
    [persist]
  )

  const removeStudyWord = useCallback(
    (id: string) => {
      persist((prev) => {
        const wordIds = prev.wordIds.filter((x) => x !== id)
        const progress = { ...prev.progress }
        delete progress[id]
        return { ...prev, wordIds, progress }
      })
    },
    [persist]
  )

  const setAnswerMode = useCallback(
    (answerMode: FlashcardAnswerMode) => {
      persist((prev) => ({ ...prev, answerMode }))
    },
    [persist]
  )

  const recordReview = useCallback(
    (id: string, rating: ReviewRating) => {
      persist((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          [id]: applyRating(prev.progress[id], rating),
        },
      }))
    },
    [persist]
  )

  const isInStudyList = useCallback(
    (id: string) => state.wordIds.includes(id),
    [state.wordIds]
  )

  const getProgress = useCallback(
    (id: string) => state.progress[id],
    [state.progress]
  )

  const value = useMemo<StudyListContextValue>(
    () => ({
      hydrated,
      wordIds: state.wordIds,
      progress: state.progress,
      answerMode: state.answerMode,
      setAnswerMode,
      toggleStudyWord,
      removeStudyWord,
      isInStudyList,
      recordReview,
      getProgress,
      studyCount: state.wordIds.length,
    }),
    [
      hydrated,
      state.wordIds,
      state.progress,
      state.answerMode,
      setAnswerMode,
      toggleStudyWord,
      removeStudyWord,
      isInStudyList,
      recordReview,
      getProgress,
    ]
  )

  return <StudyListContext.Provider value={value}>{children}</StudyListContext.Provider>
}

export function useStudyList() {
  const ctx = useContext(StudyListContext)
  if (!ctx) {
    throw new Error('useStudyList must be used within StudyListProvider')
  }
  return ctx
}
