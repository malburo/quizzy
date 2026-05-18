'use client'

import BeatLoader from 'react-spinners/BeatLoader'

export function QuizAppLoading() {
  return (
    <div aria-busy="true" aria-label="Đang tải bộ câu hỏi" className="flex min-h-dvh items-center justify-center">
      <BeatLoader color="var(--ink-4)" size={10} />
    </div>
  )
}
