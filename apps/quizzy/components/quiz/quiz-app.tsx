'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import type { QuizSet } from '@/models/quiz'
import {
  getCorrectKey,
  getFirstAnswerableId,
  getQuestionById,
  isQuizCompleted,
  parseQuestionId,
} from '@/lib/questions'
import { useHasHydrated, useHydrateQuizStore, useQuizActions, useStatuses } from '@/stores/quiz-store'
import { useQuizNavigation } from '@/hooks/use-quiz-navigation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { QuizSidebar } from './quiz-sidebar'
import { QuizMascotRow } from './quiz-mascot-row'
import { QuizChoices } from './quiz-choices'
import { QuizFooter } from './quiz-footer'
import { QuizFeedback } from './quiz-feedback'
import { QuizExplanation } from './quiz-explanation'
import { QuizResults } from './quiz-results'
import { QuizEmptyQuestion } from './quiz-empty-question'
import { QuizAppLoading } from './quiz-app-loading'

export function QuizApp({ quiz, bodyMap }: { quiz: QuizSet; bodyMap: Record<number, string | null> }) {
  useHydrateQuizStore()

  const searchParams = useSearchParams()
  const mainRef = useRef<HTMLElement>(null)
  const nav = useQuizNavigation(quiz)

  const hasHydrated = useHasHydrated()
  const { resetActive } = useQuizActions()
  const statuses = useStatuses(quiz.id)

  const knownId = parseQuestionId(quiz, searchParams.get('id'))
  const currentId = knownId ?? getFirstAnswerableId(quiz)
  const current = getQuestionById(quiz, currentId)
  const correctKey = getCorrectKey(current)
  const showResults = knownId === null && isQuizCompleted(quiz, statuses)

  useEffect(() => {
    resetActive()
  }, [currentId, resetActive])

  const handleNext = () => {
    mainRef.current?.scrollTo({ top: 0 })
    nav.goToNext(currentId, statuses)
  }

  if (!hasHydrated) return <QuizAppLoading />

  return (
    <SidebarProvider>
      <QuizFeedback className="flex min-h-svh w-full" correctKey={correctKey}>
        <QuizSidebar
          quiz={quiz}
          currentId={currentId}
          onPick={nav.goToQuestion}
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

                  <div className="flex flex-col gap-7">
                    {current.stem ? (
                      <QuizMascotRow stem={current.stem} correctKey={correctKey} />
                    ) : (
                      <QuizEmptyQuestion />
                    )}

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col gap-7"
                      >
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
