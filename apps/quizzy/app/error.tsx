'use client'

import { useEffect } from 'react'
import { Button, CenteredMessage } from '@/components/ui'

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
    <CenteredMessage
      eyebrow="Lỗi"
      eyebrowClassName="text-wrong"
      title="Có gì đó sai sai"
      action={
        <Button onClick={reset} variant="brand" size="md">
          Thử lại
        </Button>
      }
    >
      Bạn có thể thử lại — nếu vẫn lỗi, refresh trang.
    </CenteredMessage>
  )
}
