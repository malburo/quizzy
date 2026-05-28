'use client'

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import type { QuizSet } from '@/models'
import { useAnsweredCount } from '@/stores'
import { cn } from '@/lib/utils'
import { pressable } from '@/lib/motion'
import { getQuizLogo } from './quiz-icon'

export function CollectionCard({ c, variants }: { c: QuizSet; variants?: Variants }) {
  const answered = useAnsweredCount(c.id)

  const total = c.questions.length || 50
  const pct = Math.round((answered / total) * 100)
  const logo = getQuizLogo(c.id)

  return (
    <motion.div {...pressable} variants={variants} className="h-full">
      <Link
        href={`/quizzes/${c.id}`}
        prefetch={false}
        className="h-full relative overflow-hidden bg-paper border border-line rounded-md shadow-sm p-5 flex flex-col gap-3 no-underline text-ink transition-shadow cursor-pointer hover:shadow-lg"
        style={{ '--tint': c.tint, '--ink-of-tint': c.inkOfTint } as React.CSSProperties}
      >
        {/* Tint wash */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-18 z-0 bg-(--tint)/55" />

        {/* Logo */}
        <div className="relative z-10">
          {logo ? (
            <div className="size-14 rounded-full grid place-items-center shrink-0 bg-paper border border-line p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" className="size-full object-contain" />
            </div>
          ) : (
            <div
              className={cn(
                'size-14 rounded-md grid place-items-center text-2xl leading-none shrink-0',
                'bg-paper border-2 border-line-2 shadow-chunky-sm',
                c.iconMono && 'font-mono font-extrabold text-lg text-(--ink-of-tint)'
              )}
            >
              {c.icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="relative z-10 t-h3 leading-tight text-pretty">{c.title}</h3>

        {/* Description — flex-1 pushes footer to bottom */}
        <p className="relative z-10 t-small font-medium text-ink-2 text-pretty flex-1">{c.desc}</p>

        {/* Progress bar */}
        {pct > 0 && (
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between t-caption text-ink-2">
              <span>Tiến độ</span>
              <span className="text-correct-deep">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper-2 border border-line overflow-hidden">
              <div className="h-full rounded-full bg-correct transition-[width] duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Stats footer */}
        <div className="relative z-10 flex items-center gap-3.5 pt-3 border-t border-dashed border-line t-caption text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />
            </svg>
            {c.questions.length || 50} câu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
            {c.minutes} phút
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
