import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-display text-5xl font-black tracking-tight text-ink">
        Quizzy
      </h1>
      <p className="mt-4 text-lg text-ink-2">
        Học bằng trắc nghiệm. Đang thiết kế landing —{' '}
        <Link
          href="/quizzes"
          className="font-bold text-brand-purple-deep underline decoration-brand-purple-tint underline-offset-4 hover:decoration-brand-purple-deep"
        >
          vào /quizzes
        </Link>{' '}
        để học thử.
      </p>
    </main>
  )
}
