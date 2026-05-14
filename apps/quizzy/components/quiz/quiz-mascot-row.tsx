'use client'

import { Debby } from '@/components/debby/debby'
import { Pill } from '@/components/ui/pill'
import { useResult } from '@/stores/quiz-store'

const MOOD_BY_RESULT = { idle: 'idle', correct: 'happy', wrong: 'sad' } as const

export function QuizMascotRow({
  topic,
  stem,
}: {
  topic?: string
  stem?: string
}) {
  const result = useResult()

  return (
    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-3.5 md:gap-6 items-end">
      <div className="relative size-25 md:size-45">
        <Debby mood={MOOD_BY_RESULT[result]} size={180} />
      </div>
      <div className="cq-bubble">
        {topic ? (
          <Pill variant="purple" dot className="mb-2.5">
            {topic}
          </Pill>
        ) : null}
        <div className="text-[22px] md:text-[26px] font-extrabold tracking-[-0.015em] leading-tight text-ink text-pretty">
          {stem}
        </div>
      </div>
    </div>
  )
}
