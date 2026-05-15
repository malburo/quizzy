'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-wrong">Lỗi</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink">
        Có gì đó sai sai
      </h1>
      <p className="mt-3 text-ink-2">Bạn có thể thử lại — nếu vẫn lỗi, refresh trang.</p>
      <Button onClick={reset} variant="brand" size="md" className="mt-8">
        Thử lại
      </Button>
    </main>
  )
}
