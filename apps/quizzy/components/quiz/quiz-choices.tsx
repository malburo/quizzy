'use client'

import type { Choice, ChoiceKey } from '@/models'
import { useChecked, useQuizActions, useSelected } from '@/stores'
import { cn } from '@/lib/utils'
import { AnimatedGroup } from '@/components/core'


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

  return (
    <div role="radiogroup" aria-label="Đáp án">
      <AnimatedGroup
        key={currentId}
        preset="scale"
        className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1"
      >
        {choices.map((c) => {
          const isSelected = !checked && selected === c.key
          const isCorrect = checked && c.key === correctKey
          const isWrong = checked && selected === c.key && c.key !== correctKey

          return (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={selected === c.key}
              disabled={checked}
              onClick={() => !checked && pick(c.key)}
              className={cn(
                'relative h-full w-full border-2 border-line-2 rounded-md shadow-chunky-sm bg-paper text-left font-semibold pl-15 pr-4.5 py-4.5 min-h-16 t-body-lg flex items-center',
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
                  'absolute left-3.5 top-1/2 -translate-y-1/2 size-8 rounded-sm border-2 grid place-items-center font-extrabold t-small transition-all duration-150',
                  !isSelected && !isCorrect && !isWrong && 'border-line-2 bg-transparent text-ink-3',
                  isSelected && 'border-macaw bg-transparent text-macaw-deep',
                  isCorrect && 'border-correct bg-correct text-white',
                  isWrong && 'border-wrong bg-wrong text-white'
                )}
              >
                {c.key}
              </span>
              {c.text}
            </button>
          )
        })}
      </AnimatedGroup>
    </div>
  )
}
