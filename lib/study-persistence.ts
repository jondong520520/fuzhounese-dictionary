export type FlashcardAnswerMode = 'fuzhounese' | 'mandarin' | 'english'

export type ReviewRating = 'again' | 'medium' | 'good'

export interface CardProgress {
  ease: number
  intervalMs: number
  repetitions: number
  dueAt: number
}

export interface StudyStoreV1 {
  version: 1
  wordIds: string[]
  progress: Record<string, CardProgress>
  answerMode: FlashcardAnswerMode
}

const STORAGE_KEY = 'fuzhounesedict-study-v1'

export const defaultCardProgress = (): CardProgress => ({
  ease: 2.5,
  intervalMs: 0,
  repetitions: 0,
  dueAt: 0,
})

export function loadStudyStore(): StudyStoreV1 {
  if (typeof window === 'undefined') {
    return emptyStore()
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as Partial<StudyStoreV1>
    if (parsed.version !== 1 || !Array.isArray(parsed.wordIds)) return emptyStore()
    return {
      version: 1,
      wordIds: parsed.wordIds,
      progress: typeof parsed.progress === 'object' && parsed.progress !== null ? parsed.progress : {},
      answerMode:
        parsed.answerMode === 'mandarin' || parsed.answerMode === 'english'
          ? parsed.answerMode
          : 'fuzhounese',
    }
  } catch {
    return emptyStore()
  }
}

export function saveStudyStore(data: StudyStoreV1) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota */
  }
}

function emptyStore(): StudyStoreV1 {
  return {
    version: 1,
    wordIds: [],
    progress: {},
    answerMode: 'fuzhounese',
  }
}

/**
 * Spaced repetition: "again" brings the card back soon; "medium" uses a
 * shorter interval; "good" grows interval with ease factor (SM-2 inspired).
 */
export function applyRating(
  prev: CardProgress | undefined,
  rating: ReviewRating,
  now = Date.now()
): CardProgress {
  const ease = prev?.ease ?? 2.5
  const reps = prev?.repetitions ?? 0
  const prevInterval =
    prev && prev.intervalMs > 0 ? prev.intervalMs : 24 * 60 * 60 * 1000

  if (rating === 'again') {
    return {
      ease: Math.max(1.3, ease - 0.2),
      intervalMs: 60_000,
      repetitions: 0,
      dueAt: now + 60_000,
    }
  }

  if (rating === 'medium') {
    const intervalMs = Math.max(5 * 60_000, Math.floor(prevInterval * 0.4))
    return {
      ease: Math.max(1.3, ease - 0.08),
      intervalMs,
      repetitions: Math.max(0, reps - 1),
      dueAt: now + Math.min(intervalMs, 72 * 60 * 60 * 1000),
    }
  }

  const newReps = reps + 1
  let intervalMs: number
  if (newReps === 1) {
    intervalMs = 24 * 60 * 60 * 1000
  } else if (newReps === 2) {
    intervalMs = 3 * 24 * 60 * 60 * 1000
  } else {
    intervalMs = Math.max(24 * 60 * 60 * 1000, Math.round(prevInterval * ease))
  }
  const newEase = Math.min(2.6, ease + 0.12)
  return {
    ease: newEase,
    intervalMs,
    repetitions: newReps,
    dueAt: now + intervalMs,
  }
}

export function sortStudyIdsByDue(wordIds: string[], progress: Record<string, CardProgress>): string[] {
  return [...wordIds].sort((a, b) => {
    const da = progress[a]?.dueAt ?? 0
    const db = progress[b]?.dueAt ?? 0
    return da - db
  })
}

export function requeueAfterRating(
  queue: string[],
  currentId: string,
  rating: ReviewRating
): string[] {
  const rest = queue.filter((id) => id !== currentId)
  let insertAt = rest.length
  if (rating === 'again') {
    insertAt = Math.min(1, rest.length)
  } else if (rating === 'medium') {
    insertAt = Math.min(4, rest.length)
  }
  const next = [...rest]
  next.splice(insertAt, 0, currentId)
  return next
}
