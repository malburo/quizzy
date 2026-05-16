'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { AvatarConfig } from '@/components/avatar/avatar'
import type { QuizSet } from '@/models/quiz'
import { Input } from '@/components/ui/input'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { CollectionCard } from './collection-card'

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return quizzes
    return quizzes.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    )
  }, [query, quizzes])

  return (
    <div className="mx-auto max-w-310 px-4 sm:px-6 md:px-8 pb-14">
      {/* Nav */}
      <nav className="flex items-center gap-5 py-5 border-b border-line">
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

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-xl bg-brand-purple-tint border-2 border-brand-purple-soft mt-6 mb-8 flex items-stretch shadow-chunky-md">
        {/* Clouds */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="cq-cloud ck1" />
          <div className="cq-cloud ck2" />
          <div className="cq-cloud ck3" />
          <div className="cq-cloud ck4" />
          <div className="cq-cloud ck5" />
          <div className="cq-cloud ck6" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 px-6 py-8 md:px-10 min-w-0">
          <p className="t-caption text-brand-purple font-extrabold mb-2 tracking-widest uppercase">
            Quiz · Học · Flex 🐝
          </p>
          <h1 className="t-display text-ink leading-tight">
            Não đang rảnh?<br />Thôi học đi 🔥
          </h1>
          <p className="mt-3 mb-6 t-body text-ink-2">
            {quizzes.length} bộ câu hỏi đang chờ — vài câu thôi, không đau đầu đâu 🫡
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
      {filtered.length === 0 ? (
        <div className="text-center py-20 t-body text-ink-3">
          <div className="text-5xl mb-2">🔍</div>
          Không tìm thấy bộ câu hỏi nào khớp
        </div>
      ) : null}

      {/* Flat grid */}
      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((c) => (
          <motion.div key={c.id} variants={fadeUp} className="h-full">
            <CollectionCard c={c} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
