'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { Route } from 'next'
import type { QuestionStatuses, QuizSet } from '@/models/quiz'
import { findNextUnanswered } from '@/lib/questions/quiz-helpers'
import { useQuizActions } from '@/stores/quiz-store'

export function useQuizNavigation(quiz: QuizSet) {
  const router = useRouter()
  const pathname = usePathname()
  const { resetActive } = useQuizActions()

  // Reset selected/checked BEFORE the URL change so the next render
  // doesn't briefly read stale state against the new correctKey
  // (which would flash a fake 'wrong' result for one frame).
  const navigate = (path: string) => {
    resetActive()
    router.replace(path as Route, { scroll: false })
  }

  return {
    goToQuestion: (id: number) => navigate(`${pathname}?id=${id}`),

    clearQuestion: () => navigate(pathname),

    goToNext: (currentId: number, statuses: QuestionStatuses) => {
      const next = findNextUnanswered(quiz, currentId, statuses)
      navigate(next ? `${pathname}?id=${next.id}` : pathname)
    },
  }
}
