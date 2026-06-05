'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { QuizSet } from '@/models'
import {
  getCorrectKey,
  getFirstUnansweredId,
  getQuestionById,
  isQuizCompleted,
  parseQuestionId,
} from '@/lib/questions'
import { useHasHydrated, useHydrateQuizStore, useQuizActions, useStatuses } from '@/stores'
import { useQuizNavigation } from '@/hooks'
import { SidebarProvider, SidebarTrigger, SoundToggle } from '@/components/ui'
import { QuizSidebar } from './quiz-sidebar'
import { QuizQuestion } from './quiz-question'
import { QuizFooter } from './quiz-footer'
import { QuizFeedback } from './quiz-feedback'
import { QuizResults } from './quiz-results'
import { QuizAppLoading } from './quiz-app-loading'

export function QuizApp({ quiz }: { quiz: QuizSet }) {
  useHydrateQuizStore()
  const hasHydrated = useHasHydrated()

  // Gate on hydration so the resume question is computed from the *real* persisted
  // progress. Otherwise the first render reads an empty store → resolves to Q1 →
  // blinks to the actual resume question once it rehydrates.
  if (!hasHydrated) return <QuizAppLoading />

  return <QuizAppView quiz={quiz} />
}

function QuizAppView({ quiz }: { quiz: QuizSet }) {
  const searchParams = useSearchParams()
  const mainRef = useRef<HTMLElement>(null)
  const nav = useQuizNavigation(quiz)

  const { resetActive } = useQuizActions()
  const statuses = useStatuses(quiz.id)

  const knownId = parseQuestionId(quiz, searchParams.get('id'))
  const currentId = knownId ?? getFirstUnansweredId(quiz, statuses)
  const current = getQuestionById(quiz, currentId)
  const correctKey = getCorrectKey(current)
  const showResults = knownId === null && isQuizCompleted(quiz, statuses)

  const [mobileShowExplanation, setMobileShowExplanation] = useState(false)

  useEffect(() => {
    resetActive()
    setMobileShowExplanation(false)
  }, [currentId, resetActive])

  // Clear transient answer state on exit, so re-entering via the library doesn't
  // read a stale checked/selected → false result flash + mascot bounce on a
  // not-yet-ready Rive.
  useEffect(() => () => resetActive(), [resetActive])

  // Pin the resume target into the URL on entry. Without ?id, currentId tracks the
  // first unanswered question and skips ahead the moment you answer; writing ?id
  // freezes the viewed question so checking shows the result instead of jumping.
  useEffect(() => {
    if (knownId === null && !showResults) {
      nav.goToQuestion(currentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knownId, showResults])

  const handleNext = () => {
    mainRef.current?.scrollTo({ top: 0 })
    nav.goToNext(currentId, statuses)
  }

  return (
    <SidebarProvider className="max-md:fixed max-md:inset-0 max-md:min-h-0">
      <QuizFeedback className="flex min-h-svh w-full max-md:min-h-0 max-md:h-full" correctKey={correctKey}>
        <QuizSidebar
          quiz={quiz}
          currentId={currentId}
          onPick={nav.goToQuestion}
        />

        <div className="flex min-w-0 flex-1 flex-col max-md:h-full md:h-dvh">
          {showResults ? (
            <main className="flex-1 overflow-y-auto">
              <QuizResults quiz={quiz} />
            </main>
          ) : (
            <>
              <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-12 md:justify-center md:px-8 md:py-6">
                  <div className="mb-4 flex items-center justify-between md:hidden">
                    <SidebarTrigger />
                    <SoundToggle />
                  </div>

                  <QuizQuestion
                    question={current}
                    correctKey={correctKey}
                    currentId={currentId}
                    body={current.body ?? null}
                    mobileShowExplanation={mobileShowExplanation}
                  />
                </div>
              </main>

              <QuizFooter
                onContinue={handleNext}
                quizId={quiz.id}
                questionId={currentId}
                correctKey={correctKey}
                mobileShowExplanation={mobileShowExplanation}
                onShowExplanation={() => setMobileShowExplanation(true)}
              />
            </>
          )}
        </div>
      </QuizFeedback>
    </SidebarProvider>
  )
}
