import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 t-caption',
  {
    variants: {
      variant: {
        brand: 'bg-brand-purple-soft text-brand-purple-deep',
        bee: 'bg-bee-soft text-bee-deep',
        fox: 'bg-fox-soft text-fox-deep',
        macaw: 'bg-macaw-soft text-macaw-deep',
        mask: 'bg-mask-soft text-mask-deep',
        sea: 'bg-sea-soft text-sea-deep',
        correct: 'bg-correct-soft text-correct-deep',
        wrong: 'bg-wrong-soft text-wrong-deep',
        neutral: 'bg-paper-2 text-ink-2',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
