'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { QuizCard, QuizSection } from '@/models/quiz'
import { CollectionCard } from './collection-card'

const SECTION_ORDER: QuizSection[] = ['đang học', 'đã hoàn thành', 'khám phá']

export function QuizLibrary({ quizzes }: { quizzes: QuizCard[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return quizzes
    return quizzes.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    )
  }, [query, quizzes])

  const grouped = useMemo(() => {
    const out: Record<QuizSection, QuizCard[]> = {
      'đang học': [],
      'đã hoàn thành': [],
      'khám phá': [],
    }
    for (const c of filtered) out[c.section].push(c)
    return out
  }, [filtered])

  return (
    <div className="mx-auto max-w-310 px-8 pt-6 pb-14">
      {/* Top nav */}
      <nav className="flex items-center justify-between gap-5 pb-5 mb-7 border-b border-line">
        <Link href="/" className="inline-flex items-center gap-3 font-extrabold text-[17px] no-underline text-ink tracking-tight">
          <span className="size-9.5 rounded-[11px] bg-white border-2 border-line-2 shadow-[0_2px_0_var(--line-2)] grid place-items-center font-mono font-extrabold text-[14px] text-brand-purple-deep">
            Q
          </span>
          <span>Quizzy</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-7">
        <div className="max-w-140">
          <h1 className="font-display font-black tracking-tight leading-[1.1] text-[clamp(30px,4vw,42px)]">
            Chọn một bộ để bắt đầu
          </h1>
          <p className="mt-2 text-[15px] font-semibold text-ink-2 mb-4">
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
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-3 pointer-events-none"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Tìm bộ câu hỏi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full font-display text-sm font-semibold py-3 pl-10 pr-3.5 rounded-xl border-2 border-line-2 bg-paper text-ink outline-none shadow-[0_2px_0_var(--line-2)] focus:border-brand-purple focus:shadow-[0_2px_0_var(--brand-purple)] transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 placeholder:font-semibold"
            />
          </div>
        </div>

      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-20 px-5 text-base font-semibold text-ink-3">
          <div className="text-[48px] mb-2">🔍</div>
          Không tìm thấy bộ câu hỏi nào khớp
        </div>
      ) : null}

      {SECTION_ORDER.map((section) => {
        const items = grouped[section]
        if (items.length === 0) return null
        return (
          <section key={section}>
            <h2 className="text-[18px] font-extrabold tracking-[-0.01em] mt-12 mb-4 first:mt-2 flex items-center gap-2.5 capitalize">
              {section}
              <span className="font-mono text-[11px] font-bold py-0.5 px-2.5 rounded-full bg-paper-2 border border-line text-ink-3">
                {items.length}
              </span>
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
              {items.map((c) => (
                <CollectionCard key={c.id} c={c} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
