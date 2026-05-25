'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import type { ChoiceKey } from '@/models'
import { useResult } from '@/stores'
import { cn } from '@/lib/utils'

const SHAKE_MS = 600

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
  const reduce = useReducedMotion()
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (result === 'idle') {
      setShake(false)
      return
    }
    if (result === 'correct') return
    if (reduce) return
    setShake(true)
    const t = window.setTimeout(() => setShake(false), SHAKE_MS)
    return () => window.clearTimeout(t)
  }, [result, reduce])

  return (
    <div
      className={cn(
        className,
        shake && 'animate-[cqshake_500ms_cubic-bezier(.36,.07,.19,.97)]'
      )}
    >
      {children}
    </div>
  )
}
