'use client'

import { useEffect, type ReactNode } from 'react'
import type { ChoiceKey } from '@/models'
import { useResult } from '@/stores'
import { useFeedback } from '@/hooks'

export function QuizFeedback({
  className,
  children,
  correctKey,
}: {
  className?: string
  children: ReactNode
  correctKey: ChoiceKey | null
}) {
  const result = useResult(correctKey)
  const { fire } = useFeedback()

  // Sound + haptic on the idle → correct|wrong transition. The visual reaction
  // (pop on correct, shake on wrong) now lives on the individual choice cards
  // in quiz-choices, not as a whole-screen shake.
  useEffect(() => {
    if (result === 'correct') fire('correct')
    else if (result === 'wrong') fire('wrong')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  return <div className={className}>{children}</div>
}
