import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-lg transition-[transform,box-shadow] duration-150', {
  variants: {
    variant: {
      default: 'bg-paper border-2 border-line-2 shadow-chunky-md',
      subtle: 'bg-paper-2',
      elevated: 'bg-paper border-2 border-line-2 shadow-chunky-lg',
    },
    interactive: {
      true: 'cursor-pointer hover:-translate-y-0.5 hover:shadow-chunky-lg active:translate-y-0',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', interactive: false },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, interactive }), className)} {...props} />
  )
)
Card.displayName = 'Card'

export { Card, cardVariants }
