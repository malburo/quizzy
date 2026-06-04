import type { Metadata, Viewport } from 'next'
import { Nunito, JetBrains_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { MotionProvider } from '@/components/core'
import './globals.css'

const DESCRIPTION = 'Học code, tiếng Anh và nhiều thứ vui khác bằng trắc nghiệm cùng Debby.'
const TITLE = 'Quizzy — Học bằng trắc nghiệm'

export const viewport: Viewport = {
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
  metadataBase: new URL('https://quiz.malburo.site'),
  title: {
    default: TITLE,
    template: '%s | Quizzy',
  },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://quiz.malburo.site',
    siteName: 'Quizzy',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quizzy',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={cn(nunito.variable, jetbrainsMono.variable)}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
