'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { QuizSet } from '@/models/quiz'
import { useHasHydrated, useHydrateQuizStore, useQuizActions, useStatuses } from '@/stores/quiz-store'
import { Button } from '@/components/ui/button'
import { QuizSidebar } from './quiz-sidebar'
import { QuizMascotRow } from './quiz-mascot-row'
import { QuizChoices } from './quiz-choices'
import { QuizFooter } from './quiz-footer'
import { QuizFeedback } from './quiz-feedback'
import { QuizResetDialog } from './quiz-reset-dialog'
import { QuizResults } from './quiz-results'
import { Debby } from '@/components/debby/debby'

export function QuizApp({ quiz, bodyMap }: { quiz: QuizSet; bodyMap: Record<number, string | null> }) {
  useHydrateQuizStore()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hasHydrated = useHasHydrated()
  const { setSession, resetQuiz } = useQuizActions()
  const statuses = useStatuses(quiz.id)
  // `undefined` = follow viewport default (mobile hidden, desktop wide) via CSS.
  // Toggling reads the viewport once, then flips explicitly.
  const [sidebarOpen, setSidebarOpen] = useState<boolean | undefined>(undefined)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const toggleSidebar = () =>
    setSidebarOpen((prev) => (prev === undefined ? window.innerWidth < 768 : !prev))

  // Resolve current question from URL, falling back to first answerable.
  const rawId = parseInt(searchParams.get('id') ?? '', 10)
  const knownId = quiz.questions.some((q) => q.id === rawId) ? rawId : null
  const currentId = knownId ?? quiz.questions.find((q) => q.body)?.id ?? quiz.questions[0]?.id ?? 0
  const current = quiz.questions.find((q) => q.id === currentId) ?? quiz.questions[0]
  const correctKey = current.choices?.find((c) => c.correct)?.key ?? null

  // Answerable = questions that actually have content to answer.
  const answerable = quiz.questions.filter((q) => q.body)
  const isCompleted = answerable.length > 0 && answerable.every((q) => statuses[q.id])
  const showResults = isCompleted && knownId === null

  const correctCount = answerable.filter((q) => statuses[q.id] === 'correct').length
  const wrongCount = answerable.filter((q) => statuses[q.id] === 'wrong').length
  const totalAnswered = correctCount + wrongCount

  // Sync URL → store on every navigation. Skip when showing results (no active question).
  useEffect(() => {
    if (showResults) return
    setSession({
      quizId: quiz.id,
      questionId: currentId,
      correctKey,
      explanation: current.explanation ?? null,
    })
  }, [quiz.id, currentId, correctKey, current.explanation, setSession, showResults])

  const handleNext = () => {
    // 1) Try forward unanswered, 2) wrap to backward unanswered, 3) all done → clear `?id=` to show results.
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

  const handleReset = () => {
    resetQuiz(quiz.id)
    setResetDialogOpen(false)
    router.replace(pathname, { scroll: false })
  }

  if (!hasHydrated) return <QuizAppLoading />

  return (
    <QuizFeedback className="flex min-h-screen">
      <QuizSidebar
        quiz={quiz}
        open={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
        onPick={(id) => router.replace(`${pathname}?id=${id}`, { scroll: false })}
        onReset={() => setResetDialogOpen(true)}
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {showResults ? (
          <main className="flex-1 overflow-y-auto">
            <QuizResults
              correctCount={correctCount}
              wrongCount={wrongCount}
              total={answerable.length}
              onRetry={handleReset}
            />
          </main>
        ) : (
          <>
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto flex min-h-full w-full max-w-220 flex-col px-5 pt-6 pb-6 md:justify-center md:px-8 md:py-6">
                <Button
                  type="button"
                  onClick={toggleSidebar}
                  variant="neutral"
                  size="icon"
                  aria-label="Mở sidebar"
                  className="mb-4 self-start md:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-5">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                </Button>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-7"
                  >
                    {current.stem ? <QuizMascotRow stem={current.stem} /> : <EmptyQuestion />}

                    {bodyMap[currentId] ? (
                      <div className="cq-md" dangerouslySetInnerHTML={{ __html: bodyMap[currentId]! }} />
                    ) : null}

                    {current.choices && correctKey ? <QuizChoices choices={current.choices} /> : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>

            <QuizFooter onContinue={handleNext} />
          </>
        )}
      </div>

      <QuizResetDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleReset}
        answeredCount={totalAnswered}
      />
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
        <p className="text-ink-3 t-caption">Đang tải tiến độ…</p>
      </div>
    </div>
  )
}
