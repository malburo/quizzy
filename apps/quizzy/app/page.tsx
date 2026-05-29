import type { Metadata } from 'next'
import { loadAllQuizzes as getAllQuizzes } from '@/lib/server/load-quiz'
import { GitHubStarButton, QuizzyLogo } from '@/components/brand'
import { LibraryContent } from '@/components/library'

export const metadata: Metadata = {
  title: 'Quizzy — Quiz nhỏ mỗi ngày',
  description: 'Chọn một bộ câu hỏi để bắt đầu học.',
}

export default async function HomePage() {
  const quizzes = await getAllQuizzes()

  return (
    <>
      {/* Header — sticky frosted bar. Static → server. */}
      <header className="border-line bg-paper/70 sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 md:px-8">
          <QuizzyLogo />
          <GitHubStarButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 md:px-8">
        {/* Interactive list (search + cards + motion) — single client island */}
        <LibraryContent quizzes={quizzes} />

        {/* Footer — static → server */}
        <footer className="border-line t-caption text-ink-3 mt-16 flex items-center justify-between gap-4 border-t pt-5">
          <span>Made with Next.js & Claude Code</span>
          <span>@malburo</span>
        </footer>
      </div>
    </>
  )
}
