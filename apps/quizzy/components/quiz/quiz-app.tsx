'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import type { QuizSet } from '@/models'
import {
  getCorrectKey,
  getFirstAnswerableId,
  getQuestionById,
  isQuizCompleted,
  parseQuestionId,
} from '@/lib/questions'
import { useHasHydrated, useHydrateQuizStore, useQuizActions, useStatuses } from '@/stores'
import { useQuizNavigation } from '@/hooks'
import { useCrossfade } from '@/hooks'
import { SidebarProvider, SidebarTrigger } from '@/components/ui'
import { QuizSidebar } from './quiz-sidebar'
import { QuizBubble, QuizMascot } from './quiz-mascot-row'
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

  const [mobileShowExplanation, setMobileShowExplanation] = useState(false)

  useEffect(() => {
    resetActive()
    setMobileShowExplanation(false)
  }, [currentId, resetActive])

  const { controls: contentControls, displayed: displayedId } = useCrossfade(currentId)
  const displayed = getQuestionById(quiz, displayedId)
  const displayedCorrectKey = getCorrectKey(displayed)
  const displayedBody = bodyMap[displayedId]


  const handleNext = () => {
    mainRef.current?.scrollTo({ top: 0 })
    nav.goToNext(currentId, statuses)
  }

  if (!hasHydrated) return <QuizAppLoading />

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
                  <SidebarTrigger className="mb-4 self-start md:hidden" />

                  {displayed.stem ? (
                    <motion.div
                      animate={contentControls}
                      initial={{ opacity: 1 }}
                      className="flex flex-col gap-7"
                    >
                      <div className="flex items-center gap-3.5 md:gap-6">
                        <QuizMascot correctKey={displayedCorrectKey} />
                        <QuizBubble stem={displayed.stem} />
                      </div>

                      {displayedBody ? (
                        <div className="cq-md" dangerouslySetInnerHTML={{ __html: displayedBody }} />
                      ) : null}

                      {displayed.choices && displayedCorrectKey ? (
                        <QuizChoices choices={displayed.choices} correctKey={displayedCorrectKey} currentId={displayedId} />
                      ) : null}
                      <QuizExplanation
                        correctKey={displayedCorrectKey}
                        explanation={displayed.explanation ?? null}
                        mobileShow={mobileShowExplanation}
                      />
                    </motion.div>
                  ) : (
                    <QuizEmptyQuestion />
                  )}
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
