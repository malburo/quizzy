'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { Choice } from '@/models/quiz'
import { useQuizActions, useSession } from '@/stores/quiz-store'
import { cn } from '@/lib/utils'


export function QuizChoices({ choices }: { choices: Choice[] }) {
  const { selected, checked, correctKey, currentId } = useSession()
  const { select } = useQuizActions()

  return (
    <div role="radiogroup" aria-label="Đáp án" className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentId}
          className="contents"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
          }}
        >
          {choices.map((c) => {
            const isSelected = !checked && selected === c.key
            const isCorrect = checked && c.key === correctKey
            const isWrong = checked && selected === c.key && c.key !== correctKey

            return (
              <motion.button
                key={c.key}
                role="radio"
                aria-checked={selected === c.key}
                disabled={checked}
                onClick={() => !checked && select(c.key)}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
                }}
                className={cn(
                  'relative border-2 border-line-2 rounded-md shadow-chunky-sm bg-paper text-left font-semibold pl-15 pr-4.5 py-4.5 min-h-16 t-body-lg flex items-center',
                  c.code && 'font-mono t-small',
                  !isSelected && !isCorrect && !isWrong && 'hover:bg-paper-2',
                  isSelected && 'border-macaw bg-macaw-soft shadow-chunky-sm-macaw text-macaw-deep',
                  isCorrect && 'border-correct bg-correct-soft shadow-chunky-sm-correct text-correct-deep',
                  isWrong && 'border-wrong bg-wrong-soft shadow-chunky-sm-wrong text-wrong-deep',
                  checked && 'cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'absolute left-3.5 top-1/2 -translate-y-1/2 size-8 rounded-sm border-2 grid place-items-center font-mono font-extrabold t-small transition-all duration-150',
                    !isSelected && !isCorrect && !isWrong && 'border-line-2 bg-transparent text-ink-3',
                    isSelected && 'border-macaw bg-transparent text-macaw-deep',
                    isCorrect && 'border-correct bg-correct text-white',
                    isWrong && 'border-wrong bg-wrong text-white'
                  )}
                >
                  {c.key}
                </span>
                {c.text}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
