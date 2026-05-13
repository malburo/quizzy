'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function QuizFooter({
  state,
  explanation,
  canCheck,
  onCheck,
  onContinue,
}: {
  state: 'idle' | 'correct' | 'wrong'
  explanation?: string
  canCheck: boolean
  onCheck: () => void
  onContinue: () => void
}) {
  const tint =
    state === 'correct'
      ? 'bg-correct-soft border-t-correct'
      : state === 'wrong'
        ? 'bg-wrong-soft border-t-wrong'
        : 'bg-paper border-t-line'

  return (
    <motion.footer
      layout
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mt-auto border-t-2 py-4.5 px-6', tint)}
    >
      <div className="max-w-[880px] mx-auto flex items-center justify-between gap-4.5 flex-wrap">
        {state === 'idle' ? (
          <>
            <button className="font-display font-bold uppercase text-[13px] tracking-[0.04em] text-ink-3 py-3 px-4.5 hover:text-ink transition-colors">
              Bỏ qua
            </button>
            <button
              disabled={!canCheck}
              onClick={onCheck}
              className={cn(
                'chunky-btn',
                canCheck
                  ? 'bg-purple text-white shadow-[0_4px_0_var(--purple-deep)] hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_var(--purple-deep)]'
                  : 'bg-paper-2 text-ink-3 shadow-[0_4px_0_var(--line-2)] cursor-not-allowed'
              )}
            >
              Kiểm tra
            </button>
          </>
        ) : state === 'correct' ? (
          <>
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="size-14 rounded-full grid place-items-center bg-correct text-white shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                  <path d="M5 12.5l5 5 9-11" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="m-0 mb-0.5 text-[22px] font-extrabold font-display tracking-[-0.005em] text-correct-deep">Tuyệt vời!</h4>
                {explanation ? (
                  <p
                    className="m-0 text-sm font-semibold text-ink-2 [&>code]:font-mono [&>code]:font-semibold [&>code]:bg-black/[0.06] [&>code]:px-1.5 [&>code]:py-px [&>code]:rounded [&>code]:text-[0.92em]"
                    dangerouslySetInnerHTML={{ __html: explanation }}
                  />
                ) : null}
              </div>
            </div>
            <button
              onClick={onContinue}
              className="chunky-btn bg-correct text-white shadow-[0_4px_0_var(--correct-deep)] hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_var(--correct-deep)]"
            >
              Tiếp tục
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="size-14 rounded-full grid place-items-center bg-wrong text-white shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" className="size-7">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="m-0 mb-0.5 text-[22px] font-extrabold font-display tracking-[-0.005em] text-wrong-deep">
                  Chưa đúng — Debby giải thích:
                </h4>
                {explanation ? (
                  <p
                    className="m-0 text-sm font-semibold text-ink-2 [&>code]:font-mono [&>code]:font-semibold [&>code]:bg-black/[0.06] [&>code]:px-1.5 [&>code]:py-px [&>code]:rounded [&>code]:text-[0.92em]"
                    dangerouslySetInnerHTML={{ __html: explanation }}
                  />
                ) : null}
              </div>
            </div>
            <button
              onClick={onContinue}
              className="chunky-btn bg-wrong text-white shadow-[0_4px_0_var(--wrong-deep)] hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_var(--wrong-deep)]"
            >
              Làm lại
            </button>
          </>
        )}
      </div>
    </motion.footer>
  )
}
