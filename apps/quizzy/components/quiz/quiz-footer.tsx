'use client'

import type { ChoiceKey } from '@/models'
import { useQuizActions, useResult, useSelected } from '@/stores'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

export function QuizFooter({
  onContinue,
  quizId,
  questionId,
  correctKey,
}: {
  onContinue: () => void
  quizId: string
  questionId: number
  correctKey: ChoiceKey | null
}) {
  const result = useResult(correctKey)
  const selected = useSelected()
  const canCheck = selected != null
  const { submit } = useQuizActions()

  const tint =
    result === 'correct'
      ? 'bg-correct-soft border-t-correct'
      : result === 'wrong'
        ? 'bg-wrong-soft border-t-wrong'
        : 'bg-paper border-t-line'

  return (
    <footer
      className={cn('mt-auto md:border-t pt-4.5 pb-[max(18px,env(safe-area-inset-bottom))] px-6 touch-none', tint)}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {result === 'idle' ? (
          <>
            <Button onClick={onContinue} variant="neutral" size="md" className="hidden md:inline-flex">
              Bỏ qua
            </Button>
            <Button
              disabled={!canCheck}
              onClick={() => correctKey && submit({ quizId, questionId, correctKey })}
              variant={canCheck ? 'brand' : 'muted'}
              size="md"
              className="w-full md:w-auto"
            >
              Kiểm tra
            </Button>
          </>
        ) : result === 'correct' ? (
          <div className="flex w-full items-center justify-between gap-4">
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
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-4">
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
          </div>
        )}
      </div>
    </footer>
  )
}
