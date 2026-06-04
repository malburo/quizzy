import type { MetadataRoute } from 'next'
import { loadAllQuizIds } from '@/lib/server/load-quiz'

const BASE = 'https://quiz.malburo.site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ids = await loadAllQuizIds()
  const quizzes: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${BASE}/quizzes/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...quizzes,
  ]
}
