'use client'

import { MotionConfig } from 'motion/react'

// `reducedMotion="user"` makes every Framer Motion animation honor the OS
// "reduce motion" setting (the CSS @media block only covers CSS animations).
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
