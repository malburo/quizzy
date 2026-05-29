'use client'

import { useEffect, useState } from 'react'
import { useAnimationControls } from 'motion/react'

export function useCrossfade<T>(value: T, fadeOutMs = 150, fadeInMs = 200) {
  const controls = useAnimationControls()
  const [displayed, setDisplayed] = useState(value)

  // Swap on a timer rather than awaiting the animation promise: motion's
  // controls.start() can hang (e.g. called as the element mounts), which would
  // leave `displayed` stuck on the wrong value and desync it from `value`.
  // Comparing against `displayed` also self-heals an interrupted swap.
  useEffect(() => {
    if (Object.is(displayed, value)) return
    controls.start({
      opacity: 0,
      transition: { duration: fadeOutMs / 1000, ease: [0.4, 0, 1, 1] },
    })
    const t = setTimeout(() => {
      setDisplayed(value)
      controls.start({
        opacity: 1,
        transition: { duration: fadeInMs / 1000, ease: [0, 0, 0.58, 1] },
      })
    }, fadeOutMs)
    return () => clearTimeout(t)
  }, [value, displayed, controls, fadeOutMs, fadeInMs])

  return { controls, displayed }
}
