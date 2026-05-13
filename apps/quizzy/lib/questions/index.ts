import { cache } from 'react'
import { QUIZ_SETS } from '@/lib/quizzes'
import type { QuizCard, QuizSet } from '@/lib/types'
import { tsBasics } from './ts-basics'

const FULL_SETS: Record<string, QuizSet> = {
  'ts-basics': tsBasics,
}

/**
 * Returns every quiz set with an `available` flag.
 * `available === true` means the set has been fully seeded and can be
 * navigated to via /quizzes/[id]; metadata-only sets render as
 * "đang chuẩn bị" cards in the library.
 */
export const getAllQuizzes = cache((): QuizCard[] => {
  return QUIZ_SETS.map((q) => {
    const full = FULL_SETS[q.id]
    return full ? { ...full, available: true } : { ...q, available: false }
  })
})

export const getQuizById = cache((id: string): QuizSet | null => {
  return FULL_SETS[id] ?? null
})

export const getAvailableQuizIds = cache((): string[] => Object.keys(FULL_SETS))
