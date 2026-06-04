import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadAllQuizIds as getAvailableQuizIds, loadQuiz as getQuizById } from '@/lib/server/load-quiz'
import { QuizApp } from '@/components/quiz'

export async function generateStaticParams() {
  return (await getAvailableQuizIds()).map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const quiz = await getQuizById(id)
  if (!quiz) return {}
  return { title: quiz.title, description: quiz.desc }
}

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quiz = await getQuizById(id)
  if (!quiz) notFound()

  // Bodies are already rendered to HTML by the quiz parser (one markdown pipeline).
  return (
    <Suspense fallback={null}>
      <QuizApp quiz={quiz} />
    </Suspense>
  )
}
