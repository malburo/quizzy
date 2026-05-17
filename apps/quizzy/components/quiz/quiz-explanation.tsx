'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useExplanation, useResult } from '@/stores/quiz-store'
import { cn } from '@/lib/utils'
import { slideUp } from '@/lib/motion'

export function QuizExplanation() {
  const result = useResult()
  const explanation = useExplanation()

  return (
    <AnimatePresence>
      {result !== 'idle' ? (
        <ExplanationCard key={result} result={result} explanation={explanation} />
      ) : null}
    </AnimatePresence>
  )
}

function ExplanationCard({
  result,
  explanation,
}: {
  result: 'correct' | 'wrong'
  explanation: string | undefined
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth >= 768) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  return (
    <motion.div
      ref={ref}
      {...slideUp}
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
    </motion.div>
  )
}
