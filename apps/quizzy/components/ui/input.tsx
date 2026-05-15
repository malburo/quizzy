import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-md border-2 border-line-2 bg-paper px-3.5 t-body text-ink shadow-chunky-sm transition-[border-color,box-shadow] placeholder:text-ink-3 focus-visible:border-brand-purple focus-visible:outline-none focus-visible:shadow-chunky-sm-brand disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
