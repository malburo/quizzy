export type ChoiceKey = 'A' | 'B' | 'C' | 'D'

export type Choice = {
  key: ChoiceKey
  text: string
  code?: boolean
  correct?: boolean
}

export type Question = {
  id: number
  title: string
  section: string
  stem?: string
  body?: string
  choices?: Choice[]
  explanation?: string
}

export type QuizLevel = 'easy' | 'mid' | 'hard'
export type QuizSection = 'đang học' | 'đã hoàn thành' | 'khám phá'

export type QuizSet = {
  id: string
  category: string
  title: string
  desc: string
  icon: string
  iconMono?: boolean
  tint: string
  inkOfTint: string
  level: QuizLevel
  section: QuizSection
  questions: Question[]
  minutes: number
  isNew?: boolean
}

export type QuestionStatuses = Record<number, 'correct' | 'wrong'>
