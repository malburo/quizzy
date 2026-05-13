import matter from 'gray-matter'
import type { Choice, ChoiceKey, Question, QuizSet } from '@/lib/types'

// Match: ### 7. Title text
const Q_HEADING = /^###\s+(\d+)\.\s+(.+)$/

// Match: - [ ] A: text  or  - [x] A: text
const CHOICE_LINE = /^-\s+\[([x ])\]\s+([A-D]):\s+(.*)$/

export function parseQuiz(id: string, raw: string): QuizSet {
  const { data: fm, content } = matter(raw)
  const questions = parseQuestions(content)
  return {
    id,
    title: fm.title ?? id,
    desc: fm.desc ?? '',
    category: fm.category ?? 'fun',
    icon: fm.icon ?? '?',
    iconMono: fm.iconMono ?? false,
    tint: fm.tint ?? '#ebebeb',
    inkOfTint: fm.inkOfTint ?? '#333',
    level: fm.level ?? 'easy',
    minutes: fm.minutes ?? 10,
    section: fm.section ?? 'đang học',
    isNew: fm.isNew ?? false,
    questions,
    progress: fm.progress ?? 0,
  }
}

function parseQuestions(content: string): Question[] {
  // Split by H2 sections (## Section Name)
  const sectionChunks = content.split(/\n(?=## )/)
  const questions: Question[] = []

  for (const chunk of sectionChunks) {
    const lines = chunk.split('\n')
    const firstLine = lines[0].trim()

    // Determine current section name
    const section = firstLine.startsWith('## ')
      ? firstLine.replace(/^## /, '').trim()
      : ''

    // Split the chunk into question blocks by ### heading
    const qChunks = chunk.split(/\n(?=### )/)

    for (const qChunk of qChunks) {
      const qLines = qChunk.split('\n')
      const headingLine = qLines[0].trim()
      const match = Q_HEADING.exec(headingLine)
      if (!match) continue

      const qId = parseInt(match[1], 10)
      const title = match[2].trim()

      let topic: string | undefined
      let stem: string | undefined
      let correctExplanation: string | undefined
      let wrongExplanation: string | undefined
      const choices: Choice[] = []
      const bodyLines: string[] = []

      let i = 1
      while (i < qLines.length) {
        const line = qLines[i]

        if (line.startsWith('topic: ')) {
          topic = line.slice('topic: '.length).trim()
        } else if (line.startsWith('stem: ')) {
          stem = line.slice('stem: '.length).trim()
        } else if (line.startsWith('correct: ')) {
          correctExplanation = line.slice('correct: '.length).trim()
        } else if (line.startsWith('wrong: ')) {
          wrongExplanation = line.slice('wrong: '.length).trim()
        } else {
          const choiceMatch = CHOICE_LINE.exec(line)
          if (choiceMatch) {
            const isCorrect = choiceMatch[1] === 'x'
            const key = choiceMatch[2] as ChoiceKey
            const rawText = choiceMatch[3].trim()
            // Backtick-wrapped text → code: true
            const codeMatch = /^`([^`]+)`$/.exec(rawText)
            const text = codeMatch ? codeMatch[1] : rawText
            const choice: Choice = { key, text }
            if (codeMatch) choice.code = true
            if (isCorrect) choice.correct = true
            choices.push(choice)
          } else {
            bodyLines.push(line)
          }
        }
        i++
      }

      const body = bodyLines
        .join('\n')
        .replace(/^\n+/, '')
        .replace(/\n+$/, '')
        .trim()

      const q: Question = { id: qId, title, section }
      if (topic) q.topic = topic
      if (stem) q.stem = stem
      if (body) q.body = body
      if (choices.length > 0) q.choices = choices
      if (correctExplanation || wrongExplanation) {
        q.explanation = {
          correct: correctExplanation ?? '',
          wrong: wrongExplanation ?? '',
        }
      }

      questions.push(q)
    }
  }

  return questions.sort((a, b) => a.id - b.id)
}
