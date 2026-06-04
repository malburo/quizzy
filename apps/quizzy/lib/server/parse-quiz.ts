import 'server-only'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { toString } from 'mdast-util-to-string'
import type { List, Paragraph, Root, RootContent } from 'mdast'
import type { Choice, ChoiceKey, Question, QuizSet } from '@/models'
import { renderNodes } from './markdown'

const parser = unified().use(remarkParse)

export async function parseQuiz(id: string, raw: string): Promise<QuizSet> {
  const { data: fm, content } = matter(raw)
  const questions = await toQuestions(parser.parse(content) as Root)
  validate(id, questions)

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

type Block = { id: number; title: string; section: string; nodes: RootContent[] }

/** Group the flat node list into question blocks: `## ` sets the section, `### N. Title` opens one. */
async function toQuestions(tree: Root): Promise<Question[]> {
  const blocks: Block[] = []
  let section = ''

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) {
      section = toString(node).trim()
    } else if (node.type === 'heading' && node.depth === 3) {
      const m = /^(\d+)\.\s+(.+)$/.exec(toString(node).trim())
      if (m) blocks.push({ id: Number(m[1]), title: m[2].trim(), section, nodes: [] })
    } else {
      blocks.at(-1)?.nodes.push(node)
    }
  }

  const questions = await Promise.all(blocks.map(buildQuestion))
  return questions.sort((a, b) => a.id - b.id)
}

async function buildQuestion({ id, title, section, nodes }: Block): Promise<Question> {
  // Split off the <details> answer block (answer marker + explanation).
  const start = nodes.findIndex((n) => n.type === 'html' && n.value.includes('<details'))
  const end = nodes.findIndex((n) => n.type === 'html' && n.value.includes('</details>'))
  const hasDetails = start !== -1 && end > start
  const main = hasDetails ? nodes.slice(0, start) : nodes
  const detail = hasDetails ? nodes.slice(start + 1, end).filter((n) => n.type !== 'html') : []

  // main = [stem paragraph?, choices list?, ...body (code/prose)]
  const stem = main.find((n) => n.type === 'paragraph' && /^stem:/i.test(toString(n)))
  const list = main.find((n): n is List => n.type === 'list')
  const answer = detail[0] ? answerKey(detail[0]) : undefined

  const [body, explanation] = await Promise.all([
    renderNodes(main.filter((n) => n !== stem && n !== list)),
    renderNodes(detail.slice(1)),
  ])

  return {
    id,
    title,
    section,
    ...(stem && { stem: toString(stem).replace(/^stem:\s*/i, '').trim() }),
    ...(body && { body }),
    ...(list && { choices: toChoices(list, answer) }),
    ...(explanation && { explanation }),
  }
}

/** Answer = the **X** at the start of the first node inside <details>. */
function answerKey(node: RootContent): ChoiceKey | undefined {
  const strong = node.type === 'paragraph' ? node.children.find((c) => c.type === 'strong') : undefined
  const letter = strong && toString(strong).trim()
  return letter && /^[A-D]$/.test(letter) ? (letter as ChoiceKey) : undefined
}

function toChoices(list: List, answer?: ChoiceKey): Choice[] {
  return list.children.flatMap((item) => {
    const para = item.children.find((c): c is Paragraph => c.type === 'paragraph')
    const m = para && /^([A-D]):\s*([\s\S]+)$/.exec(toString(para).trim())
    if (!para || !m) return []
    const key = m[1] as ChoiceKey
    return [
      {
        key,
        text: m[2].trim(),
        ...(isCodeOnly(para, key) && { code: true }),
        ...(key === answer && { correct: true }),
      },
    ]
  })
}

/** True when the choice content (after the "X:" prefix) is a single inline-code span. */
function isCodeOnly(para: Paragraph, key: ChoiceKey): boolean {
  const rest = para.children.filter((c) => !(c.type === 'text' && new RegExp(`^${key}:\\s*$`).test(c.value)))
  return rest.length === 1 && rest[0].type === 'inlineCode'
}

/** Malformed quizzes throw → fail the build instead of rendering broken content. */
function validate(id: string, questions: Question[]): void {
  if (questions.length === 0) throw new Error(`[quiz:${id}] no questions parsed`)
  const ids = new Set<number>()
  for (const q of questions) {
    if (ids.has(q.id)) throw new Error(`[quiz:${id}] duplicate question id ${q.id}`)
    ids.add(q.id)
    const correct = q.choices?.filter((c) => c.correct).length ?? 0
    if (q.choices?.length && correct !== 1) {
      throw new Error(`[quiz:${id}] question ${q.id}: expected exactly 1 correct choice, got ${correct}`)
    }
  }
}
