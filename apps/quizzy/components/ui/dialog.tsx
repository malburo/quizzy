'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { popIn } from '@/lib/motion'

export function Dialog({
  open,
  onClose,
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  className?: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center px-4"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 animate-[cqfadeIn_0.15s_ease-out]"
        aria-hidden
      />
      <motion.div
        {...popIn}
        className={cn(
          'relative w-full max-w-md rounded-lg border-2 border-line-2 bg-paper p-6 shadow-chunky-md',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}
