'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { QuestionStatuses, QuizSet } from '@/models/quiz'
import { findNextUnanswered } from '@/lib/questions'

export function useQuizNavigation(quiz: QuizSet) {
  const router = useRouter()
  const pathname = usePathname()

  return {
    goToQuestion: (id: number) =>
      router.replace(`${pathname}?id=${id}`, { scroll: false }),

    clearQuestion: () => router.replace(pathname, { scroll: false }),

    goToNext: (currentId: number, statuses: QuestionStatuses) => {
      const next = findNextUnanswered(quiz, currentId, statuses)
      router.replace(next ? `${pathname}?id=${next.id}` : pathname, { scroll: false })
    },
  }
}
