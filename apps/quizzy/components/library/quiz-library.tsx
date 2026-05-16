'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { AvatarConfig } from '@/components/avatar/avatar'
import type { QuizSection, QuizSet } from '@/models/quiz'
import { Input } from '@/components/ui/input'
import { GitHubStarButton } from '@/components/ui/github-star-button'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { CollectionCard } from './collection-card'

const SECTION_ORDER: QuizSection[] = ['đang học', 'khám phá', 'đã hoàn thành']
const SECTION_LABEL: Record<QuizSection, string> = {
  'đang học': 'Đang học',
  'khám phá': 'Khám phá',
  'đã hoàn thành': 'Đã hoàn thành',
}

const Avatar = dynamic(
  () => import('@/components/avatar/avatar').then((m) => m.Avatar),
  { ssr: false }
)

const HERO_CONFIG: AvatarConfig = {
  Headshape: 5,
  SkinTone: 2,
  Body: 1,
  EyeColor: 947303,
  MainHair: 64,
  MainHairColor: 2,
  ClothingColor: 1,
  BackgroundColor: 0,
  ENG_ONLY_Zoom: 2,
  Expression: 11,
}

export function QuizLibrary({ quizzes }: { quizzes: QuizSet[] }) {
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? quizzes.filter((c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
      : quizzes
    return SECTION_ORDER.map((section) => ({
      section,
      items: filtered.filter((c) => c.section === section),
    })).filter((g) => g.items.length > 0)
  }, [query, quizzes])

  return (
    <div className="mx-auto max-w-310 px-4 sm:px-6 md:px-8 pb-14">
      {/* Nav */}
      <nav className="flex items-center justify-between gap-5 py-5 border-b border-line">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 t-h3 no-underline text-ink"
        >
          <span className="size-10 rounded-[12px] bg-brand-purple text-white grid place-items-center font-display font-black text-[22px] leading-none -rotate-6 transition-transform duration-220 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-6 group-hover:scale-105 [box-shadow:0_4px_0_var(--brand-purple-deep),inset_0_-3px_0_rgb(0_0_0/0.12)]">
            Q
          </span>
          <span>Quizzy</span>
        </Link>
        <GitHubStarButton />
      </nav>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-xl bg-brand-purple-tint border-2 border-brand-purple-soft mt-6 mb-8 flex items-stretch">
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
          <div className="relative max-w-100">
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
              className="pl-10 bg-paper border-line-2"
            />
          </div>
        </div>

        {/* Avatar stands at bottom-right */}
        <div className="relative z-10 hidden md:flex items-end shrink-0 pr-6 lg:pr-10">
          <Avatar config={HERO_CONFIG} className="size-52 lg:size-60" />
        </div>
      </div>

      {/* Empty state */}
      {grouped.length === 0 ? (
        <div className="text-center py-20 t-body text-ink-3">
          <div className="text-5xl mb-2">🔍</div>
          Không tìm thấy bộ câu hỏi nào khớp
        </div>
      ) : null}

      {/* Grouped grid */}
      {grouped.map(({ section, items }, i) => (
        <div key={section} className={i === 0 ? '' : 'mt-10'}>
          <h2 className="t-h3 mb-4 capitalize text-ink">
            {SECTION_LABEL[section]}
          </h2>
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((c) => (
              <motion.div key={c.id} variants={fadeUp} className="h-full">
                <CollectionCard c={c} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  )
}
