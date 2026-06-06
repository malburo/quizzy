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
  mobileShowExplanation,
  onShowExplanation,
}: {
  onContinue: () => void
  quizId: string
  questionId: number
  correctKey: ChoiceKey | null
  mobileShowExplanation: boolean
  onShowExplanation: () => void
}) {
  const result = useResult(correctKey)
  const selected = useSelected()
  const canCheck = selected != null
  const { submit } = useQuizActions()

  return (
    <footer className="relative mt-auto overflow-hidden touch-none">
      {result === 'idle' ? (
        <div className="md:border-t border-t-line bg-paper pt-4.5 pb-[calc(2rem+env(safe-area-inset-bottom))] px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
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
          </div>
        </div>
      ) : (
        // The whole colored panel — background and content together — slides up from
        // the bottom edge (Duolingo lesson feedback).
        <div
          className={cn(
            'cq-footer-up pt-4.5 pb-[calc(2rem+env(safe-area-inset-bottom))] px-6',
            result === 'correct' ? 'bg-correct-soft' : 'bg-wrong-soft'
          )}
        >
          <div className="max-w-4xl mx-auto">
            <FeedbackResult
              result={result}
              onContinue={onContinue}
              mobileShowExplanation={mobileShowExplanation}
              onShowExplanation={onShowExplanation}
            />
          </div>
        </div>
      )}
    </footer>
  )
}

function FeedbackResult({
  result,
  onContinue,
  mobileShowExplanation,
  onShowExplanation,
}: {
  result: 'correct' | 'wrong'
  onContinue: () => void
  mobileShowExplanation: boolean
  onShowExplanation: () => void
}) {
  const isCorrect = result === 'correct'

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'cq-badge-pop grid size-10 rounded-full place-items-center bg-white shrink-0 md:size-14',
            isCorrect ? 'text-correct' : 'text-wrong'
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="size-5 md:size-7">
            {isCorrect ? <path d="M5 12.5l5 5 9-11" /> : <path d="M6 6l12 12M18 6L6 18" />}
          </svg>
        </div>
        <h4 className={cn('t-h2', isCorrect ? 'text-correct-deep' : 'text-wrong-deep')}>
          {isCorrect ? 'Đúng!' : 'Sai'}
        </h4>
      </div>
      <div className="flex items-center gap-2">
        {!mobileShowExplanation && (
          <Button
            onClick={onShowExplanation}
            variant="ghost"
            size="sm"
            className={cn('md:hidden', isCorrect ? 'text-correct-deep' : 'text-wrong-deep')}
          >
            Giải thích
          </Button>
        )}
        <Button onClick={onContinue} variant={isCorrect ? 'success' : 'danger'} size="md" className="w-fit">
          {isCorrect ? 'Tiếp tục' : 'Hiểu rồi'}
        </Button>
      </div>
    </div>
  )
}
