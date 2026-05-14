'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { QuizSet } from '@/models/quiz'
import { useHasHydrated, useHydrateQuizStore, useQuizActions, useStatuses } from '@/stores/quiz-store'
import { QuizSidebar } from './quiz-sidebar'
import { QuizMascotRow } from './quiz-mascot-row'
import { QuizChoices } from './quiz-choices'
import { QuizFooter } from './quiz-footer'
import { QuizFeedback } from './quiz-feedback'
import { Debby } from '@/components/debby/debby'

export function QuizApp({ quiz, bodyMap }: { quiz: QuizSet; bodyMap: Record<number, string | null> }) {
  useHydrateQuizStore()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hasHydrated = useHasHydrated()
  const { setSession } = useQuizActions()
  const statuses = useStatuses(quiz.id)

  // Resolve current question from URL, falling back to first answerable.
  const rawId = parseInt(searchParams.get('id') ?? '', 10)
  const knownId = quiz.questions.some((q) => q.id === rawId) ? rawId : null
  const currentId = knownId ?? quiz.questions.find((q) => q.body)?.id ?? quiz.questions[0]?.id ?? 0
  const current = quiz.questions.find((q) => q.id === currentId) ?? quiz.questions[0]
  const correctKey = current.choices?.find((c) => c.correct)?.key ?? null

  // Sync URL → store on every navigation.
  useEffect(() => {
    setSession({
      quizId: quiz.id,
      questionId: currentId,
      correctKey,
      explanation: current.explanation ?? null,
    })
  }, [quiz.id, currentId, correctKey, current.explanation, setSession])

  const handleNext = () => {
    const found = quiz.questions.find((q) => q.id > currentId && q.body && !statuses[q.id])
    if (found) router.replace(`${pathname}?id=${found.id}`, { scroll: false })
  }

  if (!hasHydrated) return <QuizAppLoading />

  return (
    <QuizFeedback className="grid min-h-screen grid-cols-1 md:grid-cols-[304px_1fr]">
      <QuizSidebar quiz={quiz} onPick={(id) => router.replace(`${pathname}?id=${id}`, { scroll: false })} />

      <div className="flex min-h-screen min-w-0 flex-col">
        <main className="mx-auto flex w-full max-w-220 flex-1 flex-col justify-center gap-7 px-5 py-6 pb-10 md:px-8">
          {current.stem ? <QuizMascotRow topic={current.topic} stem={current.stem} /> : <EmptyQuestion />}

          {bodyMap[currentId] ? (
            <div className="cq-md" dangerouslySetInnerHTML={{ __html: bodyMap[currentId]! }} />
          ) : null}

          {current.choices && correctKey ? <QuizChoices choices={current.choices} /> : null}
        </main>

        <QuizFooter onContinue={handleNext} />
      </div>
    </QuizFeedback>
  )
}

function EmptyQuestion() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Debby mood="idle" size={120} />
      <p className="text-ink-3 text-base font-semibold">
        Câu này chưa có nội dung.
        <br />
        Debby đang chuẩn bị thêm câu hỏi! 🐛
      </p>
    </div>
  )
}

function QuizAppLoading() {
  return (
    <div aria-busy="true" aria-label="Đang tải bộ câu hỏi" className="grid min-h-screen place-items-center">
      <div className="flex animate-pulse flex-col items-center gap-4">
        <Debby mood="idle" size={120} />
        <p className="text-ink-3 font-mono text-[12px] font-bold tracking-[0.08em] uppercase">Đang tải tiến độ…</p>
      </div>
    </div>
  )
}
