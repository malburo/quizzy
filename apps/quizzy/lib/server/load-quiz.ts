import 'server-only'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { parseQuiz } from './parse-quiz'
import type { QuizSet } from '@/models'

const CONTENT_DIR = join(process.cwd(), 'content/quizzes')

export async function loadQuiz(id: string): Promise<QuizSet | null> {
  'use cache'
  let raw: string
  try {
    raw = readFileSync(join(CONTENT_DIR, `${id}.md`), 'utf-8')
  } catch {
    return null // missing file → not found
  }
  // Parse/validation errors propagate on purpose — a malformed quiz should fail
  // the build, not be silently dropped.
  return parseQuiz(id, raw)
}

export async function loadAllQuizzes(): Promise<QuizSet[]> {
  'use cache'
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort()
  return (await Promise.all(files.map((f) => loadQuiz(f.replace('.md', ''))))).filter(
    (q): q is QuizSet => q !== null
  )
}

export async function loadAllQuizIds(): Promise<string[]> {
  'use cache'
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
}
