'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useQuizActions, useResult, useSession } from '@/stores/quiz-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { slideUp } from '@/lib/motion'

export function QuizFooter({ onContinue }: { onContinue: () => void }) {
  const result = useResult()
  const { canCheck } = useSession()
  const { check } = useQuizActions()

  const tint =
    result === 'correct'
      ? 'bg-correct-soft border-t-correct'
      : result === 'wrong'
        ? 'bg-wrong-soft border-t-wrong'
        : 'bg-paper border-t-line'

  return (
    <motion.footer
      layout
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mt-auto md:border-t pt-4.5 pb-[max(18px,env(safe-area-inset-bottom))] px-6 touch-none', tint)}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {result === 'idle' ? (
          <>
            <Button
              onClick={onContinue}
              variant="neutral"
              size="md"
              className="hidden md:inline-flex"
            >
              Bỏ qua
            </Button>
            <Button
              disabled={!canCheck}
              onClick={check}
              variant={canCheck ? 'brand' : 'muted'}
              size="md"
              className="w-full md:w-auto"
            >
              Kiểm tra
            </Button>
          </>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {result === 'correct' ? (
              <motion.div key="correct" {...slideUp} className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 rounded-full place-items-center bg-correct text-white shrink-0 md:size-14">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="size-5 md:size-7">
                      <path d="M5 12.5l5 5 9-11" />
                    </svg>
                  </div>
                  <h4 className="t-h2 text-correct-deep">Đúng!</h4>
                </div>
                <Button onClick={onContinue} variant="success" size="md" className="w-fit">
                  Tiếp tục
                </Button>
              </motion.div>
            ) : (
              <motion.div key="wrong" {...slideUp} className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 rounded-full place-items-center bg-wrong text-white shrink-0 md:size-14">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" className="size-5 md:size-7">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </div>
                  <h4 className="t-h2 text-wrong-deep">Sai</h4>
                </div>
                <Button onClick={onContinue} variant="danger" size="md" className="w-fit">
                  Hiểu rồi
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.footer>
  )
}
