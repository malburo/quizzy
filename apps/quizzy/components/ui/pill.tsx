import { cn } from '@/lib/utils'

type PillVariant = 'purple' | 'amber' | 'pink' | 'correct' | 'wrong' | 'subtle'

const variantClasses: Record<PillVariant, string> = {
  purple: 'bg-purple-soft text-purple-deep',
  amber: 'bg-[#fff1d6] text-[#a36a10]',
  pink: 'bg-[#ffe4ee] text-[#9c2865]',
  correct: 'bg-correct-soft text-[#2a8224]',
  wrong: 'bg-wrong-soft text-[#a93838]',
  subtle: 'bg-paper-2 text-ink-3 border border-line',
}

const dotClasses: Record<PillVariant, string> = {
  purple: 'bg-purple',
  amber: 'bg-amber',
  pink: 'bg-pink',
  correct: 'bg-correct',
  wrong: 'bg-wrong',
  subtle: 'bg-ink-3',
}

export function Pill({
  children,
  variant = 'purple',
  dot = false,
  className,
}: {
  children: React.ReactNode
  variant?: PillVariant
  dot?: boolean
  className?: string
}) {
  return (
    <span className={cn('pill-mono', variantClasses[variant], className)}>
      {dot ? <span className={cn('size-1.5 rounded-full', dotClasses[variant])} /> : null}
      {children}
    </span>
  )
}
