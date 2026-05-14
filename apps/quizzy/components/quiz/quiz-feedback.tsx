'use client'

import { useEffect, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useResult } from '@/stores/quiz-store'
import { cn } from '@/lib/utils'

const Confetti = dynamic(() => import('./confetti').then((m) => m.Confetti), { ssr: false })

const BURST_MS = 2200
const SHAKE_MS = 600

export function QuizFeedback({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const result = useResult()
  const reduce = useReducedMotion()
  const [burst, setBurst] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (result === 'idle') return

    if (result === 'correct') {
      setBurst(true)
      const t = window.setTimeout(() => setBurst(false), BURST_MS)
      return () => window.clearTimeout(t)
    }

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
      <Confetti active={burst} />

      <AnimatePresence>
        {result === 'correct' ? (
          <motion.div
            key="flash-correct"
            className="pointer-events-none fixed inset-0 z-100"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(88,204,74,0.35) 0%, rgba(88,204,74,0.12) 40%, transparent 75%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, times: [0, 0.2, 1] }}
          />
        ) : null}
        {result === 'wrong' ? (
          <motion.div
            key="flash-wrong"
            className="pointer-events-none fixed inset-0 z-100"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(227,90,90,0.35) 0%, rgba(227,90,90,0.12) 40%, transparent 75%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.2, 1] }}
          />
        ) : null}
      </AnimatePresence>

      {children}
    </div>
  )
}
