export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  in: [0.42, 0, 1, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 380, damping: 22 },
  pop: { type: 'spring' as const, stiffness: 500, damping: 18 },
}

export const dur = { fast: 0.15, base: 0.22, slow: 0.4 }

// Crossfade for AnimatePresence mode="wait": exit easeIn, enter easeOut.
export const crossfade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: dur.fast, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: dur.fast, ease: ease.in } },
}

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
