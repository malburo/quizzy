'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { QuizSet } from '@/models/quiz'
import { useHasHydrated, useHydrateQuizStore, useQuizActions, useStatuses } from '@/stores/quiz-store'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { QuizSidebar } from './quiz-sidebar'
import { QuizMascotRow } from './quiz-mascot-row'
import { QuizChoices } from './quiz-choices'
import { QuizFooter } from './quiz-footer'
import { QuizFeedback } from './quiz-feedback'
import { QuizExplanation } from './quiz-explanation'
import { QuizResults } from './quiz-results'
import { EmptyQuestion } from './empty-question'
import { QuizAppLoading } from './quiz-app-loading'

export function QuizApp({ quiz, bodyMap }: { quiz: QuizSet; bodyMap: Record<number, string | null> }) {
  useHydrateQuizStore()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mainRef = useRef<HTMLElement>(null)

  const hasHydrated = useHasHydrated()
  const { resetActive } = useQuizActions()
  const statuses = useStatuses(quiz.id)

  const rawId = parseInt(searchParams.get('id') ?? '', 10)
  const knownId = quiz.questions.some((q) => q.id === rawId) ? rawId : null
  const currentId = knownId ?? quiz.questions.find((q) => q.body)?.id ?? quiz.questions[0]?.id ?? 0
  const current = quiz.questions.find((q) => q.id === currentId) ?? quiz.questions[0]
  const correctKey = current.choices?.find((c) => c.correct)?.key ?? null

  const answerable = quiz.questions.filter((q) => q.body)
  const isCompleted = answerable.length > 0 && answerable.every((q) => statuses[q.id])
  const showResults = isCompleted && knownId === null

  useEffect(() => {
    resetActive()
  }, [currentId, resetActive])

  const handleNext = () => {
    mainRef.current?.scrollTo({ top: 0 })
    const forward = answerable.find((q) => q.id > currentId && !statuses[q.id])
    if (forward) {
      router.replace(`${pathname}?id=${forward.id}`, { scroll: false })
      return
    }
    const backward = answerable.find((q) => q.id < currentId && !statuses[q.id])
    if (backward) {
      router.replace(`${pathname}?id=${backward.id}`, { scroll: false })
      return
    }
    router.replace(pathname, { scroll: false })
  }

  if (!hasHydrated) return <QuizAppLoading />

  return (
    <SidebarProvider>
      <QuizFeedback className="flex min-h-svh w-full" correctKey={correctKey}>
        <QuizSidebar
          quiz={quiz}
          currentId={currentId}
          onPick={(id) => router.replace(`${pathname}?id=${id}`, { scroll: false })}
        />

        <div className="flex min-w-0 flex-1 flex-col max-md:h-svh md:h-dvh">
          {showResults ? (
            <main className="flex-1 overflow-y-auto">
              <QuizResults quiz={quiz} />
            </main>
          ) : (
            <>
              <main ref={mainRef} className="flex-1 overflow-y-auto">
                <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 pt-6 pb-6 md:justify-center md:px-8 md:py-6">
                  <SidebarTrigger className="mb-4 self-start md:hidden" />

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col gap-7"
                    >
                      {current.stem ? <QuizMascotRow stem={current.stem} correctKey={correctKey} /> : <EmptyQuestion />}

                      {bodyMap[currentId] ? (
                        <div className="cq-md" dangerouslySetInnerHTML={{ __html: bodyMap[currentId]! }} />
                      ) : null}

                      {current.choices && correctKey ? (
                        <QuizChoices choices={current.choices} correctKey={correctKey} currentId={currentId} />
                      ) : null}
                      <QuizExplanation correctKey={correctKey} explanation={current.explanation ?? null} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>

              <QuizFooter onContinue={handleNext} quizId={quiz.id} questionId={currentId} correctKey={correctKey} />
            </>
          )}
        </div>
      </QuizFeedback>
    </SidebarProvider>
  )
}
