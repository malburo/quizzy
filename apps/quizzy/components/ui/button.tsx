import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-extrabold transition-[transform,box-shadow,filter,background-color] duration-80 ease-[cubic-bezier(.2,.7,.3,1)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-tint focus-visible:ring-offset-2 focus-visible:ring-offset-paper [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        brand:
          'bg-brand-purple text-white shadow-chunky-md-brand hover:brightness-110 active:translate-y-1 active:shadow-none',
        success:
          'bg-correct text-white shadow-chunky-md-correct hover:brightness-110 active:translate-y-1 active:shadow-none',
        danger:
          'bg-wrong text-white shadow-chunky-md-wrong hover:brightness-110 active:translate-y-1 active:shadow-none',
        neutral:
          'bg-paper text-ink border-2 border-line-2 shadow-chunky-md hover:bg-paper-2 active:translate-y-1 active:shadow-none',
        muted: 'bg-paper-3 text-ink-3 disabled:opacity-100',
        ghost: 'bg-transparent text-ink-2 hover:bg-paper-2 hover:text-ink',
        pill:
          'rounded-pill bg-paper text-ink border-2 border-line-2 shadow-chunky-sm text-[12px] font-bold hover:bg-paper-2 active:translate-y-0.5 active:shadow-none',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs rounded-md min-w-25',
        md: 'h-11 px-6 text-sm rounded-md min-w-32',
        lg: 'h-13 px-8 text-base rounded-md min-w-44',
        icon: 'size-10 rounded-md p-0',
      },
    },
    compoundVariants: [
      { variant: 'pill', size: 'sm', class: 'h-8 px-3 text-[11px] min-w-0' },
      { variant: 'pill', size: 'md', class: 'h-9 px-4 min-w-0' },
      { variant: 'ghost', size: 'sm', class: 'h-8 rounded-sm' },
    ],
    defaultVariants: { variant: 'brand', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
