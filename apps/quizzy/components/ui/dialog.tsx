'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { popIn } from '@/components/core'

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog subcomponents must be used inside <Dialog>')
  return ctx
}

export function Dialog({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v)
      onOpenChange?.(v)
    },
    [isControlled, onOpenChange]
  )

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useDialog()
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp {...props} onClick={() => setOpen(true)}>
      {children}
    </Comp>
  )
}

export function DialogClose({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useDialog()
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp {...props} onClick={() => setOpen(false)}>
      {children}
    </Comp>
  )
}

export function DialogContent({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { open, setOpen } = useDialog()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center px-4"
    >
      <div
        onClick={() => setOpen(false)}
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
