import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-ink-3">404</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink">
        Không tìm thấy trang
      </h1>
      <p className="mt-3 text-ink-2">Trang này không tồn tại hoặc đã bị di chuyển.</p>
      <Link
        href="/"
        className="mt-8 inline-block font-bold text-brand-purple-deep underline decoration-brand-purple-tint underline-offset-4"
      >
        Về trang chủ
      </Link>
    </main>
  )
}
