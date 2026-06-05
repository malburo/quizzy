'use client'

import { useReducedMotion } from 'motion/react'
import { playSound, type SoundName } from '@/lib/sound'
import { useSoundEnabled } from '@/stores'

export type FeedbackEvent = SoundName

// Vibration patterns in ms. `pick` has none (would spam on every selection).
const VIBRATE: Partial<Record<FeedbackEvent, number | number[]>> = {
  correct: 15,
  wrong: 40,
  complete: [15, 40, 15],
  incomplete: 25,
}

/**
 * Returns `fire(event)`. The single sound toggle is the master switch — when off,
 * neither sound nor haptic fire. Haptic additionally requires vibrate support and is
 * suppressed under prefers-reduced-motion (it is literally motion).
 */
export function useFeedback() {
  const soundEnabled = useSoundEnabled()
  const reduce = useReducedMotion()

  const fire = (event: FeedbackEvent) => {
    if (!soundEnabled) return
    playSound(event)
    if (reduce) return
    const pattern = VIBRATE[event]
    if (pattern != null && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // ignore — best-effort
      }
    }
  }

  return { fire }
}
