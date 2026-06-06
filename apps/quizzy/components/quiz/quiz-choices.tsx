'use client'

import { useEffect } from 'react'
import type { Choice, ChoiceKey } from '@/models'
import { useChecked, useQuizActions, useSelected } from '@/stores'
import { cn } from '@/lib/utils'
import { AnimatedGroup } from '@/components/core'
import { useFeedback } from '@/hooks'

type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed'

export function QuizChoices({
  choices,
  correctKey,
  currentId,
}: {
  choices: Choice[]
  correctKey: ChoiceKey
  currentId: number
}) {
  const selected = useSelected()
  const checked = useChecked()
  const { pick } = useQuizActions()
  const { fire } = useFeedback()

  // Keyboard 1–4 to pick a choice (until the answer is checked).
  useEffect(() => {
    if (checked) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const n = Number(e.key)
      const choice = Number.isInteger(n) ? choices[n - 1] : undefined
      if (!choice) return
      pick(choice.key)
      fire('pick')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [checked, choices, pick, fire])

  return (
    <div role="radiogroup" aria-label="Đáp án">
      <AnimatedGroup
        key={currentId}
        preset="scale"
        className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1"
      >
        {choices.map((c, i) => {
          const state: ChoiceState = checked
            ? c.key === correctKey
              ? 'correct'
              : selected === c.key
                ? 'wrong'
                : 'dimmed'
            : selected === c.key
              ? 'selected'
              : 'idle'
          // Celebratory bounce only when the user actually picked the right answer.
          const celebrate = state === 'correct' && selected === correctKey

          return (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={selected === c.key}
              disabled={checked}
              onClick={() => {
                if (checked) return
                pick(c.key)
                fire('pick')
              }}
              className={cn(
                'flex h-full w-full items-center gap-4 border-2 rounded-md bg-paper text-left font-semibold px-4.5 py-4 min-h-16 t-body-lg',
                'transition-[background-color,border-color,box-shadow,opacity,transform] duration-80 ease-[cubic-bezier(.2,.7,.3,1)]',
                state === 'idle' &&
                  'border-line-2 shadow-chunky-md hover:bg-paper-2 active:translate-y-1 active:shadow-none',
                state === 'selected' &&
                  'border-macaw bg-macaw-soft shadow-chunky-md-macaw text-macaw-deep active:translate-y-1 active:shadow-none',
                state === 'correct' &&
                  'border-correct bg-correct-soft shadow-chunky-md-correct text-correct-deep',
                celebrate && 'cq-pop',
                state === 'wrong' &&
                  'border-wrong bg-wrong-soft shadow-chunky-md-wrong text-wrong-deep cq-shake',
                state === 'dimmed' && 'border-line-2 shadow-chunky-md opacity-45',
                checked && 'cursor-default'
              )}
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-sm border-2 bg-transparent font-extrabold t-small transition-[border-color,color] duration-80',
                  (state === 'idle' || state === 'dimmed') && 'border-line-2 text-ink-3',
                  state === 'selected' && 'border-macaw text-macaw-deep',
                  state === 'correct' && 'border-correct text-correct-deep',
                  state === 'wrong' && 'border-wrong text-wrong-deep'
                )}
              >
                {i + 1}
              </span>
              <span className={cn('flex-1 min-w-0', c.code && 'font-mono t-small')}>{c.text}</span>
            </button>
          )
        })}
      </AnimatedGroup>
    </div>
  )
}
