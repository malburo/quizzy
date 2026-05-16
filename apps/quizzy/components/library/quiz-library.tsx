'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { QuizSet, QuizSection } from '@/models/quiz'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { CollectionCard } from './collection-card'

const SECTION_ORDER: QuizSection[] = ['đang học', 'đã hoàn thành', 'khám phá']

export function QuizLibrary({ quizzes }: { quizzes: QuizSet[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return quizzes
    return quizzes.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    )
  }, [query, quizzes])

  const grouped = useMemo(() => {
    const out: Record<QuizSection, QuizSet[]> = {
      'đang học': [],
      'đã hoàn thành': [],
      'khám phá': [],
    }
    for (const c of filtered) out[c.section].push(c)
    return out
  }, [filtered])

  return (
    <div className="mx-auto max-w-310 px-4 sm:px-6 md:px-8 pt-6 pb-14">
      {/* Top nav */}
      <nav className="flex items-center justify-between gap-5 pb-5 mb-7 border-b border-line">
        <Link
          href="/"
          className="inline-flex items-center gap-3 t-h3 no-underline text-ink"
        >
          <span className="size-9.5 rounded-md bg-paper border-2 border-line-2 shadow-chunky-sm grid place-items-center font-mono font-extrabold text-sm text-brand-purple-deep">
            Q
          </span>
          <span>Quizzy</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-7">
        <div className="max-w-140">
          <h1 className="t-display text-ink">Chọn một bộ để bắt đầu</h1>
          <p className="mt-2 mb-4 t-body text-ink-2">
            {quizzes.length} bộ đang chờ bạn. Tiếp tục đi nào! 🐝
          </p>

          {/* Search */}
          <div className="relative w-full max-w-115">
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
      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-20 px-5 t-body text-ink-3">
          <div className="text-5xl mb-2">🔍</div>
          Không tìm thấy bộ câu hỏi nào khớp
        </div>
      ) : null}

      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
      >
        {SECTION_ORDER.map((section) => {
          const items = grouped[section]
          if (items.length === 0) return null
          return (
            <motion.section variants={fadeUp} key={section}>
              <h2 className="t-h3 mt-12 mb-4 first:mt-2 flex items-center gap-2.5 capitalize">
                {section}
                <Badge variant="neutral">{items.length}</Badge>
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {items.map((c) => (
                  <motion.div key={c.id} variants={fadeUp}>
                    <CollectionCard c={c} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )
        })}
      </motion.div>
    </div>
  )
}
