import type { Metadata } from 'next'
import { getAllQuizzes } from '@/lib/questions'
import { QuizLibrary } from '@/components/library'

export const metadata: Metadata = {
  title: 'Quizzy — Quiz nhỏ mỗi ngày',
  description: 'Chọn một bộ câu hỏi để bắt đầu học.',
}

export default async function HomePage() {
  const quizzes = await getAllQuizzes()
  return <QuizLibrary quizzes={quizzes} />
}
