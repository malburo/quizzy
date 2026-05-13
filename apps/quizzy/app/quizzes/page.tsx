import type { Metadata } from 'next'
import { getAllQuizzes } from '@/lib/questions'
import { QuizLibrary } from '@/components/library/quiz-library'

export const metadata: Metadata = {
  title: 'Bộ câu hỏi',
  description: 'Chọn một bộ câu hỏi để bắt đầu học.',
}

export default function QuizzesPage() {
  const quizzes = getAllQuizzes()
  return <QuizLibrary quizzes={quizzes} />
}
