'use client'

import { useState } from 'react'
import { Avatar, type AvatarConfig } from './avatar'
import { cn } from '@/lib/utils'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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
  Expression: 11,
}

export function RandomAvatar({ className }: { className?: string }) {
  const [config, setConfig] = useState<AvatarConfig>(() => ({
    ...BASE,
    MainHair: randInt(1, 73),
    Expression: randInt(1, 21),
  }))
  const [bounceSignal, setBounceSignal] = useState(0)

  const handleClick = () => {
    setConfig((prev) => ({
      ...prev,
      MainHair: randInt(1, 73),
      Expression: randInt(1, 21),
    }))
    setBounceSignal((n) => n + 1)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Đổi avatar ngẫu nhiên"
      className={cn('cursor-pointer', className)}
    >
      <Avatar config={config} bounceSignal={bounceSignal} className="size-full" />
    </button>
  )
}
