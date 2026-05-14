'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const COLORS = ['#58cc4a', '#6b5bd2', '#f4a93a', '#ff5fa2', '#3178c6', '#7c6cdc']

type Piece = {
  i: number
  color: string
  dx: number
  dy: number
  rot: number
  delay: number
  dur: number
  size: number
  shape: 0 | 1 | 2
  left: number
}

function generatePieces(seed: boolean): Piece[] {
  void seed
  return Array.from({ length: 60 }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / 60 + (Math.random() - 0.5) * 0.4
    const dist = 220 + Math.random() * 280
    return {
      i,
      color: COLORS[i % COLORS.length],
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist + 280,
      rot: Math.random() * 720 - 360,
      delay: Math.random() * 0.12,
      dur: 1.3 + Math.random() * 0.7,
      size: 7 + Math.random() * 7,
      shape: (i % 3) as 0 | 1 | 2,
      left: 50 + (Math.random() - 0.5) * 8,
    }
  })
}

export function Confetti({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const pieces = useMemo(() => generatePieces(active), [active])

  if (!active || reduce) return null

  return (
    <div className="fixed top-[30%] inset-x-0 bottom-0 pointer-events-none z-200 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.shape === 2 ? p.size * 0.4 : p.size,
            height: p.shape === 2 ? p.size * 1.6 : p.size,
            borderRadius: p.shape === 1 ? '50%' : p.shape === 2 ? '1px' : '2px',
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
          animate={{ x: p.dx, y: p.dy, rotate: p.rot, opacity: [0, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.2, 0.6, 0.4, 1], times: [0, 0.1, 1] }}
        />
      ))}
    </div>
  )
}
