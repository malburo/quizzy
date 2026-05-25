'use client'

import { useEffect, useState } from 'react'
import { Avatar, type AvatarConfig } from '@/components/avatar'
import { useIsMobile } from '@/hooks'
import type { ChoiceKey } from '@/models'
import { useResult } from '@/stores'

const BASE: Omit<AvatarConfig, 'ENG_ONLY_Zoom'> = {
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
  ENG_ONLY_Animation: 0,
  ENG_ONLY_XPBoost: 0,
  ENG_ONLY_HeadFlip: 0,
}

const CONFIG_IDLE_MD: AvatarConfig = { ...BASE, ENG_ONLY_Zoom: 2, Expression: 5 }
const CONFIG_CORRECT_MD: AvatarConfig = { ...BASE, ENG_ONLY_Zoom: 2, Expression: 11 }
const CONFIG_WRONG_MD: AvatarConfig = { ...BASE, ENG_ONLY_Zoom: 2, Expression: 12 }

const CONFIG_IDLE_SM: AvatarConfig = { ...BASE, ENG_ONLY_Zoom: 0, Expression: 5 }
const CONFIG_CORRECT_SM: AvatarConfig = { ...BASE, ENG_ONLY_Zoom: 0, Expression: 11 }
const CONFIG_WRONG_SM: AvatarConfig = { ...BASE, ENG_ONLY_Zoom: 0, Expression: 12 }

/** Persistent mascot — render once and keep mounted across question changes. */
export function QuizMascot({ correctKey }: { correctKey: ChoiceKey | null }) {
  const result = useResult(correctKey)
  const isMobile = useIsMobile()

  const config = isMobile
    ? (result === 'correct' ? CONFIG_CORRECT_SM : result === 'wrong' ? CONFIG_WRONG_SM : CONFIG_IDLE_SM)
    : (result === 'correct' ? CONFIG_CORRECT_MD : result === 'wrong' ? CONFIG_WRONG_MD : CONFIG_IDLE_MD)

  const [bounceSignal, setBounceSignal] = useState(0)
  useEffect(() => {
    if (result !== 'idle') setBounceSignal((n) => n + 1)
  }, [result])

  return (
    <Avatar
      config={config}
      bounceSignal={bounceSignal}
      className="size-20 shrink-0 md:size-45"
    />
  )
}

export function QuizBubble({ stem }: { stem?: string }) {
  return (
    <div className="cq-bubble flex-1 min-w-0 pb-6 pr-8">
      <div className="t-h3 md:t-h2 text-ink text-pretty">{stem}</div>
    </div>
  )
}
