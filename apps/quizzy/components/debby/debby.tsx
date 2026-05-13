'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'

type Mood = 'idle' | 'happy' | 'sad'

const bodyVariants: Variants = {
  idle: { y: 0, scale: 1, rotate: 0, transition: { duration: 0.5 } },
  happy: {
    y: [0, -14, -4, 0],
    scale: [1, 1.08, 1.02, 1],
    transition: { duration: 0.6, times: [0, 0.3, 0.6, 1] },
  },
  sad: {
    y: [0, 6, 2],
    rotate: [0, -3, 0],
    transition: { duration: 0.6, times: [0, 0.4, 1] },
  },
}

const SPARKLE_POSITIONS = [
  { x: 34, y: 44, color: '#f4a93a', size: 18 },
  { x: 160, y: 38, color: '#58cc4a', size: 14 },
  { x: 172, y: 80, color: '#ff5fa2', size: 16 },
  { x: 20, y: 92, color: '#3178c6', size: 13 },
]

export function Debby({ mood = 'idle', size = 180 }: { mood?: Mood; size?: number }) {
  const reduce = useReducedMotion()

  const idleAnim = reduce
    ? {}
    : {
        body: { animate: { y: [0, -6, 0] }, transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const } },
        wingL: { animate: { rotate: [-6, -18, -6] }, transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const } },
        wingR: { animate: { rotate: [6, 18, 6] }, transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const } },
        antennaL: { animate: { rotate: [-6, 6, -6] }, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const } },
        antennaR: { animate: { rotate: [6, -6, 6] }, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 } },
        blink: {
          animate: { scaleY: [1, 1, 0.05, 1] },
          transition: { duration: 4.5, repeat: Infinity, times: [0, 0.92, 0.97, 1] },
        },
      }

  const isHappy = mood === 'happy'
  const isSad = mood === 'sad'

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-label="Debby — chú bọ lập trình"
      style={{ filter: 'drop-shadow(0 8px 0 rgba(79, 63, 184, 0.18))' }}
    >
      <defs>
        <radialGradient id="dbody" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#9d8df0" />
          <stop offset="55%" stopColor="#6b5bd2" />
          <stop offset="100%" stopColor="#4f3fb8" />
        </radialGradient>
        <radialGradient id="dwing" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#dcd5ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#dcd5ff" stopOpacity="0.45" />
        </radialGradient>
      </defs>

      {isHappy && !reduce && (
        <g aria-hidden>
          {SPARKLE_POSITIONS.map((s, i) => (
            <motion.text
              key={i}
              x={s.x}
              y={s.y}
              fontFamily="JetBrains Mono, monospace"
              fontWeight="800"
              fontSize={s.size}
              fill={s.color}
              initial={{ scale: 0.7, opacity: 0.3 }}
              animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
            >
              ✦
            </motion.text>
          ))}
        </g>
      )}

      {/* Wings */}
      <motion.g style={{ transformOrigin: '70% 50%', transformBox: 'fill-box' }} {...(idleAnim.wingL ?? {})}>
        <ellipse cx="58" cy="92" rx="28" ry="34" fill="url(#dwing)" stroke="#6b5bd2" strokeWidth="2" opacity="0.85" />
      </motion.g>
      <motion.g style={{ transformOrigin: '30% 50%', transformBox: 'fill-box' }} {...(idleAnim.wingR ?? {})}>
        <ellipse cx="142" cy="92" rx="28" ry="34" fill="url(#dwing)" stroke="#6b5bd2" strokeWidth="2" opacity="0.85" />
      </motion.g>

      {/* Antennae */}
      <motion.g style={{ transformOrigin: '80px 52px' }} {...(idleAnim.antennaL ?? {})}>
        <path d="M 80 52 Q 70 30 64 22" stroke="#4f3fb8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <text x="56" y="22" fontFamily="JetBrains Mono, monospace" fontWeight="800" fontSize="14" fill="#4f3fb8">{'<'}</text>
      </motion.g>
      <motion.g style={{ transformOrigin: '120px 52px' }} {...(idleAnim.antennaR ?? {})}>
        <path d="M 120 52 Q 130 30 136 22" stroke="#4f3fb8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <text x="134" y="22" fontFamily="JetBrains Mono, monospace" fontWeight="800" fontSize="14" fill="#4f3fb8">{'>'}</text>
      </motion.g>

      {/* Body */}
      <motion.g
        {...(mood !== 'idle'
          ? { variants: bodyVariants, animate: reduce ? 'idle' : mood }
          : !reduce && idleAnim.body
          ? idleAnim.body
          : { variants: bodyVariants, animate: 'idle' }
        )}
      >
        <circle cx="100" cy="105" r="55" fill="url(#dbody)" stroke="#3d2f9c" strokeWidth="2.5" />
        <ellipse cx="100" cy="125" rx="32" ry="22" fill="#efecff" opacity="0.4" />
        <rect x="92" y="68" width="16" height="40" rx="8" fill="#4f3fb8" opacity="0.45" />
        <text x="100" y="98" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="800" fontSize="11" fill="#fff" opacity="0.85">
          TS
        </text>

        {/* Eyes */}
        {isHappy ? (
          <g>
            <path d="M 76 100 Q 84 90 92 100" stroke="#1a1428" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 108 100 Q 116 90 124 100" stroke="#1a1428" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        ) : isSad ? (
          <g>
            <ellipse cx="84" cy="98" rx="10" ry="11" fill="#fff" />
            <ellipse cx="116" cy="98" rx="10" ry="11" fill="#fff" />
            <ellipse cx="84" cy="102" rx="4" ry="5" fill="#1a1428" />
            <ellipse cx="116" cy="102" rx="4" ry="5" fill="#1a1428" />
            <path d="M 74 86 L 92 92" stroke="#1a1428" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 126 86 L 108 92" stroke="#1a1428" strokeWidth="3" strokeLinecap="round" fill="none" />
            {!reduce && (
              <motion.path
                d="M 80 112 q -3 6 0 9 q 3 -3 0 -9 z"
                fill="#7ec8ff"
                stroke="#3178c6"
                strokeWidth="0.8"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, 20], opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn' }}
                style={{ transformOrigin: '80px 112px' }}
              />
            )}
          </g>
        ) : (
          <g>
            <ellipse cx="84" cy="98" rx="11" ry="13" fill="#fff" />
            <ellipse cx="116" cy="98" rx="11" ry="13" fill="#fff" />
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              {...(idleAnim.blink ?? {})}
            >
              <ellipse cx="84" cy="100" rx="5" ry="6.5" fill="#1a1428" />
              <ellipse cx="116" cy="100" rx="5" ry="6.5" fill="#1a1428" />
              <circle cx="86" cy="97" r="1.8" fill="#fff" />
              <circle cx="118" cy="97" r="1.8" fill="#fff" />
            </motion.g>
          </g>
        )}

        {/* Cheeks */}
        <ellipse cx="74" cy="118" rx={isHappy ? 7 : 6} ry={isHappy ? 4.5 : 3.5} fill="#ff8aae" opacity={isHappy ? 0.85 : 0.55} />
        <ellipse cx="126" cy="118" rx={isHappy ? 7 : 6} ry={isHappy ? 4.5 : 3.5} fill="#ff8aae" opacity={isHappy ? 0.85 : 0.55} />

        {/* Mouth */}
        {isHappy ? (
          <g>
            <path d="M 86 122 Q 100 138 114 122 Q 100 130 86 122 Z" fill="#3d2f9c" stroke="#1a1428" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 92 128 Q 100 132 108 128" stroke="#ff8aae" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : isSad ? (
          <path d="M 91 130 Q 100 122 109 130" stroke="#1a1428" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 91 122 Q 100 130 109 122" stroke="#1a1428" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Laptop */}
        <g transform="translate(78 142)">
          <rect x="0" y="0" width="44" height="26" rx="3" fill="#2a2438" />
          <rect x="3" y="3" width="38" height="18" rx="1" fill="#9be3a4" />
          <text x="6" y="15" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="9" fill="#1f1830">{'> _'}</text>
          <rect x="-3" y="24" width="50" height="4" rx="2" fill="#1a1428" />
        </g>

        {/* Feet */}
        <ellipse cx="72" cy="158" rx="6" ry="4" fill="#3d2f9c" />
        <ellipse cx="128" cy="158" rx="6" ry="4" fill="#3d2f9c" />
      </motion.g>
    </svg>
  )
}
