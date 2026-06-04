import type { Metadata } from 'next'
import { loadAllQuizzes as getAllQuizzes } from '@/lib/server/load-quiz'
import { GitHubStarButton, QuizzyLogo } from '@/components/brand'
import { LibraryContent } from '@/components/library'

export const metadata: Metadata = {
  // absolute → bypass the "%s | Quizzy" template so the brand isn't doubled.
  title: { absolute: 'Quizzy — Quiz nhỏ mỗi ngày' },
  description: 'Chọn một bộ câu hỏi để bắt đầu học.',
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const quizzes = await getAllQuizzes()

  return (
    // min-h-dvh (dynamic viewport) keeps the footer at the bottom of the screen
    // when content is short, and handles the iOS/Android browser chrome correctly.
    <div className="flex min-h-dvh flex-col">
      {/* Header — sticky frosted bar. Static → server. */}
      <header className="border-line bg-paper/70 sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 md:px-8">
          <QuizzyLogo />
          <GitHubStarButton />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 md:px-8">
        {/* Interactive list — flex-1 grows to push the footer down when content is short */}
        <div className="flex-1">
          <LibraryContent quizzes={quizzes} />
        </div>

        {/* Footer — static → server. pb keeps the text off the screen edge while sitting at the bottom. */}
        <footer className="border-line t-caption text-ink-3 mt-16 flex items-center justify-between gap-4 border-t pt-5 pb-8">
          <span>Made with Next.js & Claude Code</span>
          <span>@malburo</span>
        </footer>
      </div>
    </div>
  )
}
