'use client'

import { useEffect, useRef } from 'react'
import type { ChoiceKey } from '@/models'
import { useResult } from '@/stores'
import { cn } from '@/lib/utils'

export function QuizExplanation({
  correctKey,
  explanation,
}: {
  correctKey: ChoiceKey | null
  explanation: string | null
}) {
  const result = useResult(correctKey)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result === 'idle') return
    if (window.innerWidth >= 768) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [result])

  if (result === 'idle') return null

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border-2 bg-paper p-4',
        result === 'correct' ? 'border-correct shadow-chunky-sm-correct' : 'border-wrong shadow-chunky-sm-wrong'
      )}
    >
      <p className={cn('t-body mb-2 font-extrabold', result === 'correct' ? 'text-correct-deep' : 'text-wrong-deep')}>
        Giải thích
      </p>
      {explanation ? (
        <p
          className="m-0 t-body leading-relaxed text-ink [&>code]:font-mono [&>code]:font-semibold [&>code]:bg-paper-2 [&>code]:px-1.5 [&>code]:py-px [&>code]:rounded-xs [&>code]:text-[0.92em]"
          dangerouslySetInnerHTML={{ __html: explanation }}
        />
      ) : null}
    </div>
  )
}
