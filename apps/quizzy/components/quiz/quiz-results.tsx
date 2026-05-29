'use client'

import Link from 'next/link'
import { Avatar, type AvatarConfig } from '@/components/avatar'
import { Button } from '@/components/ui'
import { GitHubStarButton } from '@/components/brand'
import { AnimatedGroup } from '@/components/core'
import { getAnswerableQuestions } from '@/lib/questions'
import type { QuizSet } from '@/models'
import { useQuizActions, useStatuses } from '@/stores'
import { useQuizNavigation } from '@/hooks'

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

export function QuizResults({ quiz }: { quiz: QuizSet }) {
  const statuses = useStatuses(quiz.id)
  const { resetQuiz } = useQuizActions()
  const { clearQuestion } = useQuizNavigation(quiz)

  const answerable = getAnswerableQuestions(quiz)
  const correctCount = answerable.filter((q) => statuses[q.id] === 'correct').length
  const wrongCount = answerable.filter((q) => statuses[q.id] === 'wrong').length
  const total = answerable.length

  const ratio = total > 0 ? correctCount / total : 0
  const passed = ratio >= PASSING_RATIO
  const percent = Math.round(ratio * 100)

  const handleRetry = () => {
    resetQuiz(quiz.id)
    clearQuestion()
  }

  return (
    <AnimatedGroup
      preset="scale"
      className="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-center gap-8 px-4 md:px-6 py-10 text-center"
    >
      <div className="flex justify-center">
        <Avatar
          config={passed ? CONFIG_HAPPY : CONFIG_SAD}
          className="size-50 md:size-60"
        />
      </div>

      <div className="flex flex-col gap-3">
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
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
        <Button
          type="button"
          onClick={handleRetry}
          variant="brand"
          size="lg"
          className="w-full"
        >
          Làm lại bộ này
        </Button>
        <Button asChild variant="neutral" size="lg" className="w-full">
          <Link href="/">Chọn bộ khác</Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <GitHubStarButton />
      </div>
    </AnimatedGroup>
  )
}
