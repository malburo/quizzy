import { cache } from 'react'
import { QUIZ_SETS } from '@/lib/quizzes'
import type { QuizCard, QuizSet } from '@/lib/types'
import { tsBasics } from './ts-basics'

const FULL_SETS: Record<string, QuizSet> = {
  'ts-basics': tsBasics,
}

const QUIZ_SETS_MAP = new Map(QUIZ_SETS.map((q) => [q.id, q]))

export const getAllQuizzes = cache((): QuizCard[] => {
  return QUIZ_SETS.map((q) => ({ ...(FULL_SETS[q.id] ?? q), available: true }))
})

export const getQuizById = cache((id: string): QuizSet | null => {
  return FULL_SETS[id] ?? QUIZ_SETS_MAP.get(id) ?? null
})

export const getAvailableQuizIds = cache((): string[] => QUIZ_SETS.map((q) => q.id))
