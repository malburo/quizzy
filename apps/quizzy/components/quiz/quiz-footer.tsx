'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  useExplanation,
  useQuizActions,
  useResult,
  useSession,
} from '@/stores/quiz-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { slideUp } from '@/lib/motion'

export function QuizFooter({ onContinue }: { onContinue: () => void }) {
  const result = useResult()
  const explanation = useExplanation()
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
      className={cn('mt-auto border-t-2 pt-4.5 pb-[max(18px,env(safe-area-inset-bottom))] px-6', tint)}
    >
      <div className="max-w-220 mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4.5 md:flex-wrap">
        {result === 'idle' ? (
          <>
            <Button
              onClick={onContinue}
              variant="ghost"
              size="md"
              className="hidden md:inline-flex"
            >
              Bỏ qua
            </Button>
            <Button
              disabled={!canCheck}
              onClick={check}
              variant={canCheck ? 'brand' : 'neutral'}
              size="md"
              className="w-full md:w-auto"
            >
              Kiểm tra
            </Button>
          </>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {result === 'correct' ? (
              <motion.div
                key="correct"
                {...slideUp}
                className="flex w-full flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between md:gap-4 md:flex-wrap"
              >
                <div className="flex items-center gap-4 min-w-0 md:flex-1">
                  <div className="hidden size-14 rounded-full place-items-center bg-correct text-white shrink-0 md:grid">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                      <path d="M5 12.5l5 5 9-11" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="m-0 mb-0.5 t-h2 text-correct-deep">Đúng!</h4>
                    {explanation ? (
                      <p
                        className="m-0 t-small text-ink-2 [&>code]:font-mono [&>code]:font-semibold [&>code]:bg-paper-3 [&>code]:px-1.5 [&>code]:py-px [&>code]:rounded-xs [&>code]:text-[0.92em]"
                        dangerouslySetInnerHTML={{ __html: explanation }}
                      />
                    ) : null}
                  </div>
                </div>
                <Button
                  onClick={onContinue}
                  variant="success"
                  size="md"
                  className="w-full md:w-auto"
                >
                  Tiếp tục
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="wrong"
                {...slideUp}
                className="flex w-full flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between md:gap-4 md:flex-wrap"
              >
                <div className="flex items-center gap-4 min-w-0 md:flex-1">
                  <div className="hidden size-14 rounded-full place-items-center bg-wrong text-white shrink-0 md:grid">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" className="size-7">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="m-0 mb-0.5 t-h2 text-wrong-deep">Sai</h4>
                    {explanation ? (
                      <p
                        className="m-0 t-small text-ink-2 [&>code]:font-mono [&>code]:font-semibold [&>code]:bg-paper-3 [&>code]:px-1.5 [&>code]:py-px [&>code]:rounded-xs [&>code]:text-[0.92em]"
                        dangerouslySetInnerHTML={{ __html: explanation }}
                      />
                    ) : null}
                  </div>
                </div>
                <Button
                  onClick={onContinue}
                  variant="brand"
                  size="md"
                  className="w-full md:w-auto"
                >
                  Câu tiếp theo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.footer>
  )
}
