import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAvailableQuizIds, getQuizById } from '@/lib/questions'
import { renderQuestionBody } from '@/lib/highlight'
import { QuizApp } from '@/components/quiz/quiz-app'

export async function generateStaticParams() {
  return getAvailableQuizIds().map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const quiz = getQuizById(id)
  if (!quiz) return {}
  return { title: quiz.title, description: quiz.desc }
}

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quiz = getQuizById(id)
  if (!quiz) notFound()

  const bodyEntries = await Promise.all(
    quiz.questions.map(
      async (q) => [q.id, q.body ? await renderQuestionBody(q.body) : null] as const
    )
  )
  const bodyMap = Object.fromEntries(bodyEntries) as Record<number, string | null>

  return <QuizApp quiz={quiz} bodyMap={bodyMap} />
}
