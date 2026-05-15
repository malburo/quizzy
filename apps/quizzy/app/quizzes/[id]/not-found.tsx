import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-ink-3">404</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink">
        Bộ câu hỏi không tồn tại
      </h1>
      <p className="mt-3 text-ink-2">
        Bộ này có thể chưa được chuẩn bị xong hoặc bạn gõ sai URL.
      </p>
      <Link
        href="/quizzes"
        className="mt-8 inline-block font-bold text-brand-purple-deep underline decoration-brand-purple-tint underline-offset-4"
      >
        Xem tất cả bộ câu hỏi
      </Link>
    </main>
  )
}
