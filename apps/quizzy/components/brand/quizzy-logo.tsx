import Link from 'next/link'
import type { Route } from 'next'
import { cn } from '@/lib/utils'

type QuizzyLogoSize = 'sm' | 'md'

const SIZE: Record<QuizzyLogoSize, { badge: string; text: string }> = {
  sm: {
    badge: 'size-8 rounded-sm text-base [box-shadow:0_3px_0_var(--brand-purple-deep),inset_0_-2px_0_rgb(0_0_0/0.12)]',
    text: 'text-lg',
  },
  md: {
    badge: 'size-10 rounded-md text-2xl [box-shadow:0_4px_0_var(--brand-purple-deep),inset_0_-3px_0_rgb(0_0_0/0.12)]',
    text: '',
  },
}

export function QuizzyLogo({
  size = 'md',
  href = '/',
  className,
}: {
  size?: QuizzyLogoSize
  href?: Route
  className?: string
}) {
  const s = SIZE[size]
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2.5 no-underline text-ink', className)}
    >
      <span
        className={cn(
          'bg-brand-purple text-white grid place-items-center font-display font-black leading-none -rotate-6 transition-transform duration-220 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-6 group-hover:scale-105',
          s.badge
        )}
      >
        Q
      </span>
      <span className={cn('font-display font-extrabold tracking-tight', s.text)}>Quizzy</span>
    </Link>
  )
}
