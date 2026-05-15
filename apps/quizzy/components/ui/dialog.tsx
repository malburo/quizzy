'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

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
        className="absolute inset-0 bg-black/50 animate-[cqfadeIn_0.15s_ease-out]"
        aria-hidden
      />
      <div
        className={cn(
          'relative w-full max-w-md rounded-2xl border-2 border-line-2 bg-paper p-6 shadow-[0_4px_0_var(--line-2)]',
          'animate-[cqpop_0.2s_cubic-bezier(0.22,1,0.36,1)]',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
