'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSoundEnabled, useSettingsActions } from '@/stores'
import { Button } from './button'

export function SoundToggle({ className }: { className?: string }) {
  const enabled = useSoundEnabled()
  const { toggleSound } = useSettingsActions()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Before mount, render the default-on icon so SSR and first client paint match.
  const showOn = mounted ? enabled : true

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleSound}
      aria-pressed={showOn}
      aria-label={showOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
      title={showOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
      className={cn('size-8 min-w-0 px-0 text-ink-3 hover:text-ink', className)}
    >
      {showOn ? <VolumeOnIcon /> : <VolumeOffIcon />}
    </Button>
  )
}

function VolumeOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function VolumeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  )
}
