'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

// Rive uses <canvas>; load client-only.
const AvatarPlayground = dynamic(
  () => import('@/components/avatar/avatar-playground').then((m) => m.AvatarPlayground),
  { ssr: false }
)

export default function AvatarPlaygroundPage() {
  return (
    <main className="mx-auto max-w-7xl px-8 pt-6 pb-14">
      <nav className="flex items-center justify-between gap-5 pb-5 mb-7 border-b border-line">
        <Link
          href="/"
          className="inline-flex items-center gap-3 font-extrabold text-[17px] no-underline text-ink tracking-tight"
        >
          <span className="size-9.5 rounded-[11px] bg-white border-2 border-line-2 shadow-[0_2px_0_var(--line-2)] grid place-items-center font-mono font-extrabold text-[14px] text-brand-purple-deep">
            Q
          </span>
          <span>Quizzy</span>
        </Link>
      </nav>

      <header className="mb-7">
        <h1 className="font-display font-black tracking-tight leading-[1.1] text-[clamp(30px,4vw,42px)]">
          Avatar Playground
        </h1>
        <p className="mt-2 text-[15px] font-semibold text-ink-2">
          Tinh chỉnh avatar Rive — màu sắc, kiểu tóc, hiệu ứng. 🎨
        </p>
      </header>

      <AvatarPlayground className="size-90 shrink-0" />
    </main>
  )
}
