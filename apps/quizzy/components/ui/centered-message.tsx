import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Shared layout for the 404 / error / empty full-page messages.
export function CenteredMessage({
  eyebrow,
  eyebrowClassName,
  title,
  children,
  action,
}: {
  eyebrow: string
  eyebrowClassName?: string
  title: string
  children: ReactNode
  action: ReactNode
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className={cn('t-caption', eyebrowClassName ?? 'text-ink-3')}>{eyebrow}</p>
      <h1 className="t-h1 text-ink mt-4">{title}</h1>
      <p className="t-body text-ink-2 mt-3">{children}</p>
      <div className="mt-8">{action}</div>
    </main>
  )
}
