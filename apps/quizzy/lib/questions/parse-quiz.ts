import matter from 'gray-matter'
import type { Choice, ChoiceKey, Question, QuizSet } from '@/models/quiz'

// Match: ### 7. Title text
const Q_HEADING = /^###\s+(\d+)\.\s+(.+)$/

// Match: - A: text   (no [x]/[ ] marker — answer is hidden in <details>)
const CHOICE_LINE = /^-\s+([A-D]):\s+(.*)$/

// Match the answer marker inside a <details> block: **B** or **B** — text
const ANSWER_LETTER = /\*\*([A-D])\*\*/

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
  }
}

/** Pull out the <details>…</details> block. Returns the extracted block (or null) and the chunk with it removed. */
function extractDetails(chunk: string): { details: string | null; rest: string } {
  const open = chunk.indexOf('<details>')
  if (open === -1) return { details: null, rest: chunk }
  const close = chunk.indexOf('</details>', open)
  if (close === -1) return { details: null, rest: chunk }
  const details = chunk.slice(open + '<details>'.length, close)
  const rest = chunk.slice(0, open) + chunk.slice(close + '</details>'.length)
  return { details, rest }
}

/** Strip the <summary>…</summary> tag and return only the answer body. */
function stripSummary(details: string): string {
  return details.replace(/<summary>[\s\S]*?<\/summary>/i, '').trim()
}

/** Grab the content following a marker emoji on its own line, up to the next blank line or marker. */
function extractAfterMarker(body: string, marker: string): string | undefined {
  const lines = body.split('\n')
  const start = lines.findIndex((l) => l.trim().startsWith(marker))
  if (start === -1) return undefined
  const collected: string[] = []
  // First line: strip the marker prefix.
  const firstStripped = lines[start].trim().slice(marker.length).trim()
  if (firstStripped) collected.push(firstStripped)
  for (let i = start + 1; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t === '') break
    if (t.startsWith('✅') || t.startsWith('❌')) break
    collected.push(lines[i])
  }
  return collected.join('\n').trim() || undefined
}

function parseDetails(details: string): {
  answerKey?: ChoiceKey
  correct?: string
  wrong?: string
} {
  const body = stripSummary(details)
  const letter = ANSWER_LETTER.exec(body)?.[1] as ChoiceKey | undefined
  const correct = extractAfterMarker(body, '✅')
  const wrong = extractAfterMarker(body, '❌')
  return { answerKey: letter, correct, wrong }
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

    for (const rawChunk of qChunks) {
      // Pull out the <details> answer block first so it never leaks into body.
      const { details, rest: qChunkNoDetails } = extractDetails(rawChunk)
      const detailsInfo = details ? parseDetails(details) : {}

      const qLines = qChunkNoDetails.split('\n')
      const headingLine = qLines[0].trim()
      const match = Q_HEADING.exec(headingLine)
      if (!match) continue

      const qId = parseInt(match[1], 10)
      const title = match[2].trim()

      let topic: string | undefined
      let stem: string | undefined
      const choices: Choice[] = []
      const bodyLines: string[] = []

      let i = 1
      while (i < qLines.length) {
        const line = qLines[i]

        if (line.startsWith('topic: ')) {
          topic = line.slice('topic: '.length).trim()
        } else if (line.startsWith('stem: ')) {
          stem = line.slice('stem: '.length).trim()
        } else {
          const choiceMatch = CHOICE_LINE.exec(line)
          if (choiceMatch) {
            const key = choiceMatch[1] as ChoiceKey
            const rawText = choiceMatch[2].trim()
            // Backtick-wrapped text → code: true
            const codeMatch = /^`([^`]+)`$/.exec(rawText)
            const text = codeMatch ? codeMatch[1] : rawText
            const choice: Choice = { key, text }
            if (codeMatch) choice.code = true
            if (detailsInfo.answerKey === key) choice.correct = true
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
      if (detailsInfo.correct || detailsInfo.wrong) {
        q.explanation = {
          correct: detailsInfo.correct ?? '',
          wrong: detailsInfo.wrong ?? '',
        }
      }

      questions.push(q)
    }
  }

  return questions.sort((a, b) => a.id - b.id)
}
