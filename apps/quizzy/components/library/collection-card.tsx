'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { QuizCard } from '@/lib/types'
import { Pill } from '@/components/ui/pill'
import { cn } from '@/lib/utils'

const LEVEL_LABEL = { easy: 'Dễ', mid: 'Vừa', hard: 'Khó' } as const
const LEVEL_PILL_VARIANT = {
  easy: 'correct',
  mid: 'amber',
  hard: 'wrong',
} as const

export function CollectionCard({ c }: { c: QuizCard }) {
  const pct = Math.round((c.progress ?? 0) * 100)

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/quizzes/${c.id}`}
        className="relative block overflow-hidden chunky-card p-5 flex flex-col gap-3 no-underline text-ink transition-shadow cursor-pointer hover:border-purple-deep hover:shadow-[0_7px_0_var(--line-2)]"
        style={{ ['--tint' as string]: c.tint, ['--ink-of-tint' as string]: c.inkOfTint } as React.CSSProperties}
      >
        {/* Color stripe */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[72px] z-0"
          style={{ background: 'var(--tint)', opacity: 0.55 }}
        />

        {/* New badge */}
        {c.isNew ? (
          <span className="absolute top-3 right-3.5 z-10 pill-mono bg-pink text-white shadow-[0_2px_0_#c93b78]">
            MỚI
          </span>
        ) : null}

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div
            className={cn(
              'size-14 rounded-[14px] grid place-items-center text-[26px] leading-none shrink-0',
              'bg-paper border-2 border-line-2 shadow-[0_2px_0_var(--line-2)]',
              c.iconMono && 'font-mono font-extrabold text-[18px]'
            )}
            style={c.iconMono ? { color: c.inkOfTint } : undefined}
          >
            {c.icon}
          </div>
          <Pill variant={LEVEL_PILL_VARIANT[c.level]} dot>
            {LEVEL_LABEL[c.level]}
          </Pill>
        </div>

        <h3 className="relative z-10 text-[18px] font-extrabold leading-tight tracking-tight text-pretty">
          {c.title}
        </h3>
        <p className="relative z-10 text-[13.5px] font-medium leading-[1.5] text-ink-2 text-pretty flex-1">
          {c.desc}
        </p>

        {(c.progress ?? 0) > 0 ? (
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-ink-2 uppercase tracking-[0.06em]">
              <span>Tiến độ</span>
              <span className="text-correct-deep">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper-2 border border-line overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(180deg, #84e07b 0%, var(--correct) 60%, var(--correct-deep) 100%)',
                  transition: 'width 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="relative z-10 flex items-center gap-3.5 pt-3 border-t border-dashed border-line-2 font-mono text-[11px] font-bold text-ink-3 uppercase tracking-[0.06em]">
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
