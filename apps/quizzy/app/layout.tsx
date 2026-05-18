import type { Metadata, Viewport } from 'next'
import { Nunito, JetBrains_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#6b5bd2',
}

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Quizzy — Học bằng trắc nghiệm',
    template: '%s | Quizzy',
  },
  description: 'Học code, tiếng Anh và nhiều thứ vui khác bằng trắc nghiệm cùng Debby.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quizzy',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={cn(nunito.variable, jetbrainsMono.variable)}>
      <body>{children}</body>
    </html>
  )
}
