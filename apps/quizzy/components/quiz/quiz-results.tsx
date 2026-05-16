'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Avatar, type AvatarConfig } from '@/components/avatar/avatar'
import { Button } from '@/components/ui/button'
import { GitHubStarButton } from '@/components/ui/github-star-button'
import { fadeUp, popIn, staggerContainer } from '@/lib/motion'

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
    <motion.div
      variants={staggerContainer(0.12)}
      initial="hidden"
      animate="show"
      className="mx-auto flex min-h-full w-full max-w-220 flex-col items-center justify-center gap-8 px-4 md:px-6 py-10 text-center"
    >
      <motion.div {...popIn}>
        <Avatar
          config={passed ? CONFIG_HAPPY : CONFIG_SAD}
          className="size-50 md:size-60"
        />
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <h2 className="m-0 t-display text-ink">
          {passed ? 'Hoàn thành! 🎉' : 'Cần ôn thêm 💪'}
        </h2>
        <p className="m-0 t-caption text-ink-2">
          <span className="text-correct-deep">{correctCount} đúng</span>
          <span className="mx-2 text-ink-3">•</span>
          <span className="text-wrong-deep">{wrongCount} sai</span>
          <span className="mx-2 text-ink-3">•</span>
          <span className="text-ink">{percent}%</span>
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex w-full max-w-100 flex-col gap-3"
      >
        <Button
          type="button"
          onClick={onRetry}
          variant="brand"
          size="lg"
          className="w-full"
        >
          Làm lại bộ này
        </Button>
        <Button asChild variant="neutral" size="lg" className="w-full">
          <Link href="/quizzes">Chọn bộ khác</Link>
        </Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GitHubStarButton />
      </motion.div>
    </motion.div>
  )
}
