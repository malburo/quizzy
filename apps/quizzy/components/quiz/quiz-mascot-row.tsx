'use client'

import { useEffect, useState } from 'react'
import { Avatar, type AvatarConfig } from '@/components/avatar/avatar'
import { useResult } from '@/stores/quiz-store'

const BASE: AvatarConfig = {
  Headshape: 5,
  SkinTone: 2,
  Body: 1,
  EyeColor: 947303,
  Wrinkles: 0,
  MainHair: 64,
  MainHairColor: 2,
  Piercings: 0,
  'Nose Piercing': 0,
  FacialHair: 0,
  FacialHairColor: 0,
  Glasses: 0,
  GlassesColor: 0,
  Headwear: 0,
  HeadwearColor: 0,
  Headphones: 0,
  HeadphonesColour: 0,
  ClothingColor: 1,
  BackgroundColor: 0,
  ENG_ONLY_Zoom: 2,
  ENG_ONLY_Animation: 0,
  ENG_ONLY_XPBoost: 0,
  ENG_ONLY_HeadFlip: 0,
}

const CONFIG_IDLE: AvatarConfig = { ...BASE, Expression: 5 }
const CONFIG_CORRECT: AvatarConfig = { ...BASE, Expression: 11 }
const CONFIG_WRONG: AvatarConfig = { ...BASE, Expression: 12 }

export function QuizMascotRow({ stem }: { stem?: string }) {
  const result = useResult()

  const config =
    result === 'correct' ? CONFIG_CORRECT : result === 'wrong' ? CONFIG_WRONG : CONFIG_IDLE

  // Bounce only on non-idle transitions (i.e. when an answer is judged).
  const [bounceSignal, setBounceSignal] = useState(0)
  useEffect(() => {
    if (result !== 'idle') setBounceSignal((n) => n + 1)
  }, [result])

  return (
    <div className="flex items-center gap-3.5 md:gap-6">
      <Avatar
        config={config}
        bounceSignal={bounceSignal}
        className="size-20 shrink-0 md:size-45"
      />
      <div className="cq-bubble min-w-0 w-fit pb-6 pr-8">
        <div className="text-lg md:text-2xl font-extrabold leading-tight text-ink text-pretty w-fit">
          {stem}
        </div>
      </div>
    </div>
  )
}
