'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { crossfade } from './motion'

// Single-active adaptation of motion-primitives' TransitionPanel: crossfades the
// child whenever `activeKey` changes. mode="wait" keeps one child in the DOM at a
// time, so varying child heights never cause a layout jump.
export function TransitionPanel({
  activeKey,
  children,
  className,
}: {
  activeKey: string | number
  children: ReactNode
  className?: string
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        initial={crossfade.initial}
        animate={crossfade.animate}
        exit={crossfade.exit}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
