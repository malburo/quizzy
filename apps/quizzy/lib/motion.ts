import type { Variants } from 'motion/react'

export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 380, damping: 22 },
  pop: { type: 'spring' as const, stiffness: 500, damping: 18 },
}

export const dur = { fast: 0.15, base: 0.22, slow: 0.4 }

export const pageEnter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: dur.base, ease: ease.out },
}

export const popIn = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  transition: ease.pop,
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: ease.spring,
}

export const pressable = {
  whileHover: { y: -2 },
  whileTap: { y: 1 },
  transition: ease.spring,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } },
}

export const staggerContainer = (delay = 0.04): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
})
