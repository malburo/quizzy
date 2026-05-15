export type ChoiceKey = 'A' | 'B' | 'C' | 'D'

export type Choice = {
  key: ChoiceKey
  text: string
  /** Render text with monospace font (code answers). */
  code?: boolean
  correct?: boolean
}

export type Question = {
  id: number
  /** Sidebar label. */
  title: string
  /** Sidebar group heading. */
  section: string
  /** Pill above the bubble headline (e.g. "TypeScript · Type narrowing"). */
  topic?: string
  /** Bubble headline. */
  stem?: string
  /** Light markdown: paragraphs, **bold**, *em*, `inline`, ```fenced``` blocks. */
  body?: string
  choices?: Choice[]
  /** Single explanation shown after the user submits an answer. Inline markdown already converted to HTML. */
  explanation?: string
}

export type QuizCategory = 'code' | 'english' | 'animal' | 'fun' | 'world' | 'science'

export type QuizLevel = 'easy' | 'mid' | 'hard'

export type QuizSection = 'đang học' | 'đã hoàn thành' | 'khám phá'

export type QuizSet = {
  /** URL slug. */
  id: string
  category: QuizCategory
  title: string
  desc: string
  /** Emoji or short mono text. */
  icon: string
  /** Render icon with mono font instead of emoji style. */
  iconMono?: boolean
  /** Top-of-card color stripe (hex). */
  tint: string
  /** Contrast ink for mono icon on the tint stripe. */
  inkOfTint: string
  level: QuizLevel
  questions: Question[]
  minutes: number
  section: QuizSection
  isNew?: boolean
}

/** A QuizSet enriched with availability info for the library cards. */
export type QuizCard = QuizSet & { available: boolean }

/** Map of question id → answer status. Persisted in localStorage. */
export type QuestionStatuses = Record<number, 'correct' | 'wrong'>
