'use client'

import { useEffect, useRef, useState } from 'react'
import { useAnimationControls } from 'motion/react'

export function useCrossfade<T>(value: T, fadeOutMs = 150, fadeInMs = 200) {
  const controls = useAnimationControls()
  const [displayed, setDisplayed] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (Object.is(prevRef.current, value)) return
    prevRef.current = value
    let cancelled = false
    ;(async () => {
      await controls.start({
        opacity: 0,
        transition: { duration: fadeOutMs / 1000, ease: [0.4, 0, 1, 1] },
      })
      if (cancelled) return
      setDisplayed(value)
      await controls.start({
        opacity: 1,
        transition: { duration: fadeInMs / 1000, ease: [0, 0, 0.58, 1] },
      })
    })()
    return () => {
      cancelled = true
    }
  }, [value, controls, fadeOutMs, fadeInMs])

  return { controls, displayed }
}
