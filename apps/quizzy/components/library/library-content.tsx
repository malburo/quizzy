'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { QuizSet } from '@/models'
import { Input } from '@/components/ui'
import { AnimatedGroup } from '@/components/core'
import { useHydrateQuizStore } from '@/stores'
import { useIsMobile } from '@/hooks/use-mobile'
import { QuizCard } from './quiz-card'
import { groupQuizzes } from './quiz-groups'

const RandomAvatar = dynamic(() => import('@/components/avatar/random-avatar').then((m) => m.RandomAvatar), {
  ssr: false,
})

export function LibraryContent({ quizzes }: { quizzes: QuizSet[] }) {
  useHydrateQuizStore()
  const isMobile = useIsMobile()
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // React Compiler memoizes this — no manual useMemo needed.
  const q = query.trim().toLowerCase()
  const filtered = q
    ? quizzes.filter((c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    : quizzes
  const groups = groupQuizzes(filtered)
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <>
      {/* Hero banner */}
      <div className="bg-brand-purple-tint relative mt-6 mb-8 flex items-stretch overflow-hidden rounded-lg">
        {/* Clouds — desktop only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/3 overflow-hidden md:block"
        >
          <div className="cq-cloud ck1" />
          <div className="cq-cloud ck2" />
          <div className="cq-cloud ck3" />
          <div className="cq-cloud ck4" />
          <div className="cq-cloud ck5" />
          <div className="cq-cloud ck6" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-w-0 flex-1 px-6 py-8 md:px-10">
          <h1 className="t-display text-ink mt-4 leading-tight">Quiz nhỏ mỗi ngày.</h1>
          <p className="t-body text-ink-2 mt-3 mb-6">Làm vài câu cho nóng máy 🔥</p>
          <div className="relative max-w-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink-3 pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <Input
              type="text"
              aria-label="Tìm bộ câu hỏi"
              placeholder="Tìm bộ câu hỏi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Avatar — desktop only; skip the 2.4MB Rive payload on mobile where it's hidden */}
        <div className="relative z-10 hidden h-57.5 w-52 shrink-0 items-end pr-6 md:flex lg:h-65 lg:w-60 lg:pr-10">
          {mounted && !isMobile && <RandomAvatar className="size-52 lg:size-60" />}
        </div>
      </div>

      {/* Empty state */}
      {total === 0 ? (
        <div className="t-body text-ink-3 py-20 text-center">
          <div className="mb-2 text-5xl">🔍</div>
          Không tìm thấy bộ câu hỏi nào khớp
        </div>
      ) : (
        groups.map(({ domain, label, items }, i) => (
          <div key={domain} className={i === 0 ? '' : 'mt-10'}>
            {/* Domain heading — animated in */}
            <AnimatedGroup preset="fade" className="mb-5">
              <div className="flex items-center gap-3">
                <h2 className="t-h3 text-ink whitespace-nowrap">{label}</h2>
                <span className="bg-brand-purple-tint t-caption text-brand-purple-deep grid h-6 min-w-6 place-items-center rounded-full px-1.5">
                  {items.length}
                </span>
              </div>
            </AnimatedGroup>

            <AnimatedGroup
              key={query + domain}
              preset="fade"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((c) => (
                <QuizCard key={c.id} c={c} />
              ))}
            </AnimatedGroup>
          </div>
        ))
      )}
    </>
  )
}
