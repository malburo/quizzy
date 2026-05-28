'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { QuizSet } from '@/models'
import { Input } from '@/components/ui'
import { GitHubStarButton } from '@/components/brand'
import { QuizzyLogo } from '@/components/brand'
import { fadeUp, staggerContainer } from '@/lib/motion'
import BeatLoader from 'react-spinners/BeatLoader'
import { useHasHydrated, useHydrateQuizStore } from '@/stores'
import { CollectionCard } from './collection-card'
import { groupQuizzes } from './quiz-icon'

const RandomAvatar = dynamic(
  () => import('@/components/avatar/random-avatar').then((m) => m.RandomAvatar),
  { ssr: false }
)

export function QuizLibrary({ quizzes }: { quizzes: QuizSet[] }) {
  useHydrateQuizStore()
  const hasHydrated = useHasHydrated()
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? quizzes.filter((c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
      : quizzes
    return groupQuizzes(list)
  }, [query, quizzes])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  if (!hasHydrated) return (
    <div className="flex min-h-dvh items-center justify-center">
      <BeatLoader color="var(--ink-4)" size={10} />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-14">
      {/* Nav */}
      <nav className="flex items-center justify-between gap-5 py-5 border-b border-line">
        <QuizzyLogo />
        <GitHubStarButton />
      </nav>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-lg bg-brand-purple-tint mt-6 mb-8 flex items-stretch">
        {/* Clouds */}
        <div aria-hidden className="absolute inset-y-0 right-0 w-2/3 overflow-hidden pointer-events-none">
          <div className="cq-cloud ck1" />
          <div className="cq-cloud ck2" />
          <div className="cq-cloud ck3" />
          <div className="cq-cloud ck4" />
          <div className="cq-cloud ck5" />
          <div className="cq-cloud ck6" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 px-6 py-8 md:px-10 min-w-0">
          <h1 className="t-display text-ink leading-tight mt-4">
            Quiz nhỏ mỗi ngày.
          </h1>
          <p className="mt-3 mb-6 t-body text-ink-2">
            Làm vài câu cho nóng máy 🔥
          </p>
          <div className="relative max-w-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-3 pointer-events-none z-10"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <Input
              type="text"
              placeholder="Tìm bộ câu hỏi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Avatar — fixed size reserves space before hydration, no layout shift */}
        <div className="relative z-10 hidden md:flex items-end shrink-0 h-57.5 lg:h-65 w-52 lg:w-60 pr-6 lg:pr-10">
          <RandomAvatar className="size-52 lg:size-60" />
        </div>
      </div>

      {/* Empty state */}
      {total === 0 ? (
        <div className="text-center py-20 t-body text-ink-3">
          <div className="text-5xl mb-2">🔍</div>
          Không tìm thấy bộ câu hỏi nào khớp
        </div>
      ) : (
        groups.map(({ domain, label, items }, i) => (
          <div key={domain} className={i === 0 ? '' : 'mt-10'}>
            {/* Domain heading */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="t-h3 text-ink whitespace-nowrap">{label}</h2>
              <span className="grid place-items-center min-w-6 h-6 px-1.5 rounded-full bg-brand-purple-tint t-caption text-brand-purple-deep">
                {items.length}
              </span>
            </div>

            <motion.div
              key={query + domain}
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {items.map((c) => (
                <CollectionCard key={c.id} c={c} variants={fadeUp} />
              ))}
            </motion.div>
          </div>
        ))
      )}

      {/* Footer */}
      <footer className="mt-16 pt-5 border-t border-line flex items-center justify-between gap-4 t-caption text-ink-3">
        <span>Made with Next.js & Claude Code</span>
        <span>@malburo</span>
      </footer>
    </div>
  )
}
