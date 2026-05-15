import { cache } from 'react'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { parseQuiz } from './parse-quiz'
import type { QuizSet } from '@/models/quiz'

const CONTENT_DIR = join(process.cwd(), 'content/quizzes')

export const loadQuiz = cache((id: string): QuizSet | null => {
  try {
    const raw = readFileSync(join(CONTENT_DIR, `${id}.md`), 'utf-8')
    return parseQuiz(id, raw)
  } catch {
    return null
  }
})

export const loadAllQuizzes = cache((): QuizSet[] => {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort()
  return files.map((f) => loadQuiz(f.replace('.md', ''))!)
})

export const loadAllQuizIds = cache((): string[] =>
  readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
)
