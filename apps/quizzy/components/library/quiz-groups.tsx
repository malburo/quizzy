import type { QuizSet } from '@/models'

// Domain groups for the library. Order of ids inside each group = display order.
export type QuizDomain = 'frontend' | 'backend'

const GROUPS: Record<QuizDomain, string[]> = {
  frontend: [
    'html-basics',
    'css-basics',
    'javascript-essentials',
    'js-quirks',
    'in-js-we-trust',
    'typescript-essentials',
    'ts-basics',
    'react-basics',
    'nextjs-basics',
  ],
  backend: ['expressjs-basics', 'mongodb-basics', 'socketio-basics'],
}

export const DOMAIN_ORDER: QuizDomain[] = ['frontend', 'backend']
export const DOMAIN_LABEL: Record<QuizDomain, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
}

const DOMAIN_OF: Record<string, QuizDomain> = Object.fromEntries(
  DOMAIN_ORDER.flatMap((d) => GROUPS[d].map((id) => [id, d]))
)

function domainOf(id: string): QuizDomain {
  return DOMAIN_OF[id] ?? 'frontend'
}

function orderIn(domain: QuizDomain, id: string): number {
  const i = GROUPS[domain].indexOf(id)
  return i === -1 ? GROUPS[domain].length : i
}

export function groupQuizzes(
  quizzes: QuizSet[]
): { domain: QuizDomain; label: string; items: QuizSet[] }[] {
  return DOMAIN_ORDER.map((domain) => ({
    domain,
    label: DOMAIN_LABEL[domain],
    items: quizzes
      .filter((q) => domainOf(q.id) === domain)
      .sort((a, b) => orderIn(domain, a.id) - orderIn(domain, b.id)),
  })).filter((g) => g.items.length > 0)
}
