import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quizzy',
    short_name: 'Quizzy',
    description: 'Học code, tiếng Anh và nhiều thứ vui khác bằng trắc nghiệm cùng Debby.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#6b5bd2',
    background_color: '#fffdf7',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
