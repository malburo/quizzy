import type { ChoiceKey, Question, QuestionStatuses, QuizSet } from '@/models'

export function getAnswerableQuestions(quiz: QuizSet): Question[] {
  return quiz.questions.filter((q) => q.body)
}

export function getFirstAnswerableId(quiz: QuizSet): number {
  return getAnswerableQuestions(quiz)[0]?.id ?? quiz.questions[0]?.id ?? 0
}

export function getFirstUnansweredId(quiz: QuizSet, statuses: QuestionStatuses): number {
  return getAnswerableQuestions(quiz).find((q) => !statuses[q.id])?.id ?? getFirstAnswerableId(quiz)
}

export function getQuestionById(quiz: QuizSet, id: number): Question {
  return (
    quiz.questions.find((q) => q.id === id) ??
    quiz.questions.find((q) => q.body) ??
    quiz.questions[0]
  )
}

export function parseQuestionId(quiz: QuizSet, raw: string | null): number | null {
  if (!raw) return null
  const id = parseInt(raw, 10)
  if (Number.isNaN(id)) return null
  return quiz.questions.some((q) => q.id === id) ? id : null
}

export function getCorrectKey(question: Question): ChoiceKey | null {
  return question.choices?.find((c) => c.correct)?.key ?? null
}

export function isQuizCompleted(quiz: QuizSet, statuses: QuestionStatuses): boolean {
  const answerable = getAnswerableQuestions(quiz)
  return answerable.length > 0 && answerable.every((q) => statuses[q.id])
}

export function findNextUnanswered(
  quiz: QuizSet,
  currentId: number,
  statuses: QuestionStatuses
): Question | null {
  const answerable = getAnswerableQuestions(quiz)
  return (
    answerable.find((q) => q.id > currentId && !statuses[q.id]) ??
    answerable.find((q) => q.id < currentId && !statuses[q.id]) ??
    null
  )
}
