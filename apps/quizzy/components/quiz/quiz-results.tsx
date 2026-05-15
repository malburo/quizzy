'use client'

import Link from 'next/link'
import { Avatar, type AvatarConfig } from '@/components/avatar/avatar'
import { cn } from '@/lib/utils'

const PASSING_RATIO = 0.7

const BASE: AvatarConfig = {
  Headshape: 5,
  SkinTone: 2,
  Body: 1,
  EyeColor: 947303,
  MainHair: 64,
  MainHairColor: 2,
  ClothingColor: 1,
  BackgroundColor: 0,
  ENG_ONLY_Zoom: 2,
}

const CONFIG_HAPPY: AvatarConfig = { ...BASE, Expression: 11 }
const CONFIG_SAD: AvatarConfig = { ...BASE, Expression: 12 }

export function QuizResults({
  correctCount,
  wrongCount,
  total,
  onRetry,
}: {
  correctCount: number
  wrongCount: number
  total: number
  onRetry: () => void
}) {
  const ratio = total > 0 ? correctCount / total : 0
  const passed = ratio >= PASSING_RATIO
  const percent = Math.round(ratio * 100)

  return (
    <div className="mx-auto flex min-h-full w-full max-w-220 flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <Avatar config={passed ? CONFIG_HAPPY : CONFIG_SAD} className="size-50 md:size-60" />

      <div className="flex flex-col gap-3">
        <h2 className="m-0 font-display text-[clamp(28px,5vw,42px)] font-black tracking-tight leading-[1.05] text-ink">
          {passed ? 'Hoàn thành! 🎉' : 'Cần ôn thêm 💪'}
        </h2>

        <p className="m-0 font-mono text-[14px] font-bold tracking-[0.04em] text-ink-2">
          <span className="text-correct-deep">{correctCount} đúng</span>
          <span className="mx-2 text-ink-3">•</span>
          <span className="text-wrong-deep">{wrongCount} sai</span>
          <span className="mx-2 text-ink-3">•</span>
          <span className="text-ink">{percent}%</span>
        </p>
      </div>

      <div className="flex w-full max-w-100 flex-col gap-3">
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'chunky-btn w-full',
            'bg-purple text-white shadow-[0_4px_0_var(--purple-deep)] hover:brightness-110',
            'active:translate-y-0.5 active:shadow-[0_2px_0_var(--purple-deep)]'
          )}
        >
          Làm lại bộ này
        </button>
        <Link
          href="/quizzes"
          className={cn(
            'chunky-btn w-full grid place-items-center no-underline',
            'bg-paper text-ink border-2 border-line-2 shadow-[0_4px_0_var(--line-2)] hover:bg-paper-2',
            'active:translate-y-0.5 active:shadow-[0_2px_0_var(--line-2)]'
          )}
        >
          Chọn bộ khác
        </Link>
      </div>
    </div>
  )
}
