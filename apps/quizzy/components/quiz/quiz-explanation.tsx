'use client'

import { useEffect, useRef } from 'react'
import type { ChoiceKey } from '@/models'
import { useResult } from '@/stores'
import { cn } from '@/lib/utils'

export function QuizExplanation({
  correctKey,
  explanation,
  mobileShow,
}: {
  correctKey: ChoiceKey | null
  explanation: string | null
  mobileShow: boolean
}) {
  const result = useResult(correctKey)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileShow) return
    if (window.innerWidth >= 768) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mobileShow])

  if (result === 'idle') return null

  return (
    <div
      ref={ref}
      className={cn(
        'scroll-mb-8 rounded-lg border-2 border-line-2 bg-paper-2 shadow-chunky-sm p-4 md:p-5 md:block',
        mobileShow ? 'block' : 'hidden'
      )}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand-purple text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.1 14c.2-1 .7-1.8 1.4-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.2 1.5 1.4 2.5" />
          </svg>
        </span>
        <p className="m-0 t-small font-extrabold text-brand-purple-deep">Giải thích</p>
      </div>
      {explanation ? (
        <div className="cq-md" dangerouslySetInnerHTML={{ __html: explanation }} />
      ) : null}
    </div>
  )
}
