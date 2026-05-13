'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { ChoiceKey, QuizSet } from '@/lib/types'
import { QuizSidebar } from './quiz-sidebar'
import { QuizMascotRow } from './quiz-mascot-row'
import { QuizChoices } from './quiz-choices'
import { QuizFooter } from './quiz-footer'
import { Debby } from '@/components/debby/debby'
import { TS_BASICS_INITIAL_STATUS, TS_BASICS_INITIAL_ID } from '@/lib/questions/ts-basics-constants'
import { cn } from '@/lib/utils'

const Confetti = dynamic(() => import('./confetti').then((m) => m.Confetti), { ssr: false })

type Statuses = Record<number, 'correct' | 'wrong'>

const initialStatusFor = (quizId: string): Statuses =>
  quizId === 'ts-basics' ? { ...TS_BASICS_INITIAL_STATUS } : {}

const initialIdFor = (quiz: QuizSet): number => {
  if (quiz.id === 'ts-basics') return TS_BASICS_INITIAL_ID
  const first = quiz.questions.find((q) => q.body)
  return first?.id ?? quiz.questions[0]?.id ?? 0
}

export function QuizApp({
  quiz,
  bodyMap,
}: {
  quiz: QuizSet
  bodyMap: Record<number, string | null>
}) {
  const reduce = useReducedMotion()
  const [statuses, setStatuses] = useState<Statuses>(() => initialStatusFor(quiz.id))
  const [currentId, setCurrentId] = useState<number>(() => initialIdFor(quiz))
  const [selected, setSelected] = useState<ChoiceKey | null>(null)
  const [checked, setChecked] = useState(false)
  const [burst, setBurst] = useState(false)
  const [shake, setShake] = useState(false)

  const current = useMemo(
    () => quiz.questions.find((q) => q.id === currentId) ?? quiz.questions[0],
    [quiz.questions, currentId]
  )

  const correctKey = current.choices?.find((c) => c.correct)?.key as ChoiceKey | undefined
  const isCorrect = checked && correctKey != null && selected === correctKey
  const mood: 'idle' | 'happy' | 'sad' = checked ? (isCorrect ? 'happy' : 'sad') : 'idle'
  const footerState: 'idle' | 'correct' | 'wrong' = checked ? (isCorrect ? 'correct' : 'wrong') : 'idle'
  const totalAnswered = Object.keys(statuses).length

  const onCheck = () => {
    if (selected == null || correctKey == null) return
    const wasCorrect = selected === correctKey
    setChecked(true)
    setStatuses((s) => ({ ...s, [currentId]: wasCorrect ? 'correct' : 'wrong' }))
    if (wasCorrect) {
      setBurst(true)
      window.setTimeout(() => setBurst(false), 2200)
    } else if (!reduce) {
      setShake(true)
      window.setTimeout(() => setShake(false), 600)
    }
  }

  const onContinue = () => {
    setSelected(null)
    setChecked(false)
    const nextIdle = quiz.questions.find((q) => q.id > currentId && q.body && !statuses[q.id])
    if (nextIdle) setCurrentId(nextIdle.id)
  }

  const onPickQuestion = (id: number) => {
    setCurrentId(id)
    setSelected(null)
    setChecked(false)
  }

  const explanation =
    checked && current.explanation
      ? isCorrect
        ? current.explanation.correct
        : current.explanation.wrong
      : undefined

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-[304px_1fr] min-h-screen', shake && 'animate-[cqshake_500ms_cubic-bezier(.36,.07,.19,.97)]')}>
      <Confetti active={burst} />

      {/* Flash overlays */}
      <AnimatePresence>
        {checked && isCorrect ? (
          <motion.div
            key="flash-correct"
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(88,204,74,0.35) 0%, rgba(88,204,74,0.12) 40%, transparent 75%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, times: [0, 0.2, 1] }}
          />
        ) : null}
        {checked && !isCorrect ? (
          <motion.div
            key="flash-wrong"
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(227,90,90,0.35) 0%, rgba(227,90,90,0.12) 40%, transparent 75%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.2, 1] }}
          />
        ) : null}
      </AnimatePresence>

      <QuizSidebar
        track={quiz.title}
        questions={quiz.questions}
        statuses={statuses}
        currentId={currentId}
        totalAnswered={totalAnswered}
        onPick={onPickQuestion}
      />

      <div className="flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 w-full max-w-[880px] mx-auto px-5 md:px-8 py-6 pb-10 flex flex-col gap-7 justify-center">
          {current.stem ? (
            <QuizMascotRow mood={mood} topic={current.topic} stem={current.stem} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <Debby mood="idle" size={120} />
              <p className="text-ink-3 font-semibold text-base">Câu này chưa có nội dung.<br/>Debby đang chuẩn bị thêm câu hỏi! 🐛</p>
            </div>
          )}

          {bodyMap[currentId] ? (
            <div className="cq-md" dangerouslySetInnerHTML={{ __html: bodyMap[currentId]! }} />
          ) : null}

          {current.choices && correctKey ? (
            <QuizChoices
              currentId={currentId}
              choices={current.choices}
              selected={selected}
              checked={checked}
              correctKey={correctKey}
              onSelect={setSelected}
            />
          ) : null}
        </main>

        <QuizFooter
          state={footerState}
          explanation={explanation}
          canCheck={selected != null}
          onCheck={onCheck}
          onContinue={onContinue}
        />
      </div>
    </div>
  )
}
