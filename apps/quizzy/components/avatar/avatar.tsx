'use client'

import { useEffect } from 'react'
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-webgl2'

const STATE_MACHINES = ['SMAvatar', 'SMButtons']
const TARGET_SM = 'SMButtons'

export type AvatarConfig = Partial<{
  Headshape: number
  SkinTone: number
  Body: number
  Expression: number
  EyeColor: number
  Wrinkles: number
  MainHair: number
  MainHairColor: number
  Piercings: number
  'Nose Piercing': number
  FacialHair: number
  FacialHairColor: number
  Glasses: number
  GlassesColor: number
  Headwear: number
  HeadwearColor: number
  Headphones: number
  HeadphonesColour: number
  ClothingColor: number
  BackgroundColor: number
  ENG_ONLY_Zoom: number
  ENG_ONLY_Animation: number
  ENG_ONLY_XPBoost: number
  ENG_ONLY_HeadFlip: number | boolean
}>

/** Number inputs that don't drive the SM — animations must be triggered directly. */
const PLAY_ON_VALUE: Record<string, Record<number, string | null>> = {
  ENG_ONLY_Animation: {
    0: null,
    1: 'Animation_Idle_STANDARD',
    2: 'Animation_Idle_TRANSITION',
  },
  ENG_ONLY_XPBoost: {
    0: null,
    1: 'XPBoost_01_ON',
  },
}

/**
 * The Rive file ships with a "default avatar" mode that overrides custom inputs.
 * Turn it off on every state machine so our config actually applies.
 */
function disableDefaultAvatarMode(rive: NonNullable<ReturnType<typeof useRive>['rive']>) {
  for (const sm of STATE_MACHINES) {
    const defaultInput = rive.stateMachineInputs(sm)?.find((i) => i.name === 'default_avatar_bool')
    if (defaultInput) defaultInput.value = false
  }
}

export function Avatar({
  config,
  bounceSignal,
  className,
}: {
  config: AvatarConfig
  /** Increment to fire the bounce trigger (e.g. when answer is judged). */
  bounceSignal?: number
  className?: string
}) {
  const { rive, RiveComponent } = useRive({
    src: '/avatar_builder_25_sept2025.riv',
    stateMachines: STATE_MACHINES,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  })

  const bounce = useStateMachineInput(rive, 'SMAvatar', 'bounce_trig')

  useEffect(() => {
    if (bounceSignal && bounce) bounce.fire()
  }, [bounceSignal, bounce])

  useEffect(() => {
    if (!rive) return

    disableDefaultAvatarMode(rive)

    const inputs = rive.stateMachineInputs(TARGET_SM) ?? []
    for (const [name, value] of Object.entries(config)) {
      if (value == null) continue

      const input = inputs.find((i) => i.name === name)
      if (input) {
        input.value = typeof input.value === 'boolean' ? Boolean(value) : Number(value)
      }

      const animationName = PLAY_ON_VALUE[name]?.[Number(value)]
      if (animationName) rive.play(animationName)
    }
  }, [rive, config])

  return (
    <RiveComponent
      onClick={() => bounce?.fire()}
      className={className}
      style={{ cursor: bounce ? 'pointer' : undefined }}
    />
  )
}
