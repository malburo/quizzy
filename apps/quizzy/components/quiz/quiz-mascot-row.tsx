'use client'

import { Debby } from '@/components/debby/debby'
import { Pill } from '@/components/ui/pill'

export function QuizMascotRow({
  mood,
  topic,
  stem,
}: {
  mood: 'idle' | 'happy' | 'sad'
  topic?: string
  stem?: string
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-3.5 md:gap-6 items-end">
      <div className="relative size-[100px] md:size-[180px]">
        <Debby mood={mood} size={180} />
      </div>
      <div className="cq-bubble">
        {topic ? (
          <Pill variant="purple" dot className="mb-2.5">
            {topic}
          </Pill>
        ) : null}
        <div className="text-[22px] md:text-[26px] font-extrabold tracking-[-0.015em] leading-[1.25] text-ink text-pretty">
          {stem}
        </div>
      </div>
    </div>
  )
}
