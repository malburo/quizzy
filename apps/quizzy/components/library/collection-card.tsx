'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { QuizSet } from '@/models/quiz'
import { Badge } from '@/components/ui/badge'
import {
  useAnsweredCount,
  useHasHydrated,
  useHydrateQuizStore,
} from '@/stores/quiz-store'
import { cn } from '@/lib/utils'
import { pressable } from '@/lib/motion'

const LEVEL_LABEL = { easy: 'Dễ', mid: 'Vừa', hard: 'Khó' } as const
const LEVEL_BADGE_VARIANT = {
  easy: 'correct',
  mid: 'bee',
  hard: 'wrong',
} as const
// Tailwind v4 scanner needs literal class names; map dot color explicitly.
const LEVEL_DOT_CLASS = {
  easy: 'bg-correct',
  mid: 'bg-bee',
  hard: 'bg-wrong',
} as const

export function CollectionCard({ c }: { c: QuizSet }) {
  useHydrateQuizStore()
  const hasHydrated = useHasHydrated()
  const answered = useAnsweredCount(c.id)

  if (!hasHydrated) return <CollectionCardSkeleton />

  const total = c.questions.length || 50
  const pct = Math.round((answered / total) * 100)

  return (
    <motion.div {...pressable} className="h-full">
      <Link
        href={`/quizzes/${c.id}`}
        className="h-full relative overflow-hidden bg-paper border-2 border-line-2 rounded-lg shadow-chunky-md p-5 flex flex-col gap-3 no-underline text-ink transition-shadow cursor-pointer hover:shadow-chunky-lg"
        style={{ ['--tint' as string]: c.tint, ['--ink-of-tint' as string]: c.inkOfTint } as React.CSSProperties}
      >
        {/* Tint wash at the top */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-18 z-0"
          style={{ background: 'var(--tint)', opacity: 0.55 }}
        />

        {/* Icon + level badge */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div
            className={cn(
              'size-14 rounded-md grid place-items-center text-2xl leading-none shrink-0',
              'bg-paper border-2 border-line-2 shadow-chunky-sm',
              c.iconMono && 'font-mono font-extrabold text-lg'
            )}
            style={c.iconMono ? { color: c.inkOfTint } : undefined}
          >
            {c.icon}
          </div>
          <Badge variant={LEVEL_BADGE_VARIANT[c.level]}>
            <span className={cn('size-1.5 rounded-full', LEVEL_DOT_CLASS[c.level])} />
            {LEVEL_LABEL[c.level]}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="relative z-10 t-h3 leading-tight text-pretty">
          {c.title}
        </h3>

        {/* Description — flex-1 pushes footer to the bottom */}
        <p className="relative z-10 t-small font-medium text-ink-2 text-pretty flex-1">
          {c.desc}
        </p>

        {/* Progress bar */}
        {pct > 0 ? (
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between t-caption text-ink-2">
              <span>Tiến độ</span>
              <span className="text-correct-deep">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper-2 border border-line overflow-hidden">
              <div
                className="h-full rounded-full bg-correct transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Stats footer */}
        <div className="relative z-10 flex items-center gap-3.5 pt-3 border-t border-dashed border-line-2 t-caption text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            {c.questions.length || 50} câu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {c.minutes} phút
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function CollectionCardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải bộ câu hỏi"
      className="h-full bg-paper border-2 border-line-2 rounded-lg shadow-chunky-md p-5 flex flex-col gap-3 animate-pulse"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="size-14 rounded-md bg-paper-2 border-2 border-line-2" />
        <div className="h-6 w-14 rounded-full bg-paper-2" />
      </div>
      <div className="h-5 w-3/4 rounded bg-paper-2" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 w-full rounded bg-paper-2" />
        <div className="h-3.5 w-5/6 rounded bg-paper-2" />
      </div>
      <div className="flex gap-3.5 pt-3 border-t border-dashed border-line-2">
        <div className="h-3 w-14 rounded bg-paper-2" />
        <div className="h-3 w-14 rounded bg-paper-2" />
      </div>
    </div>
  )
}
