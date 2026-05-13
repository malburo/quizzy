'use client'

import { cn } from '@/lib/utils'
import type { Question, QuestionStatus } from '@/lib/types'

type Section = { name: string; items: Question[] }

function groupBySection(questions: Question[]): Section[] {
  const sections: Section[] = []
  for (const q of questions) {
    const last = sections[sections.length - 1]
    if (!last || last.name !== q.section) sections.push({ name: q.section, items: [q] })
    else last.items.push(q)
  }
  return sections
}

export function QuizSidebar({
  track,
  questions,
  statuses,
  currentId,
  totalAnswered,
  onPick,
}: {
  track: string
  questions: Question[]
  statuses: Record<number, 'correct' | 'wrong'>
  currentId: number
  totalAnswered: number
  onPick: (id: number) => void
}) {
  const progress = totalAnswered / questions.length

  return (
    <aside className="sticky top-0 self-start h-screen w-[304px] flex flex-col bg-paper border-r-2 border-line">
      <div className="p-4 border-b border-line bg-gradient-to-b from-[color-mix(in_srgb,var(--purple-soft)_60%,transparent)] to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <span className="size-9.5 rounded-[10px] bg-white border-2 border-line-2 shadow-[0_2px_0_var(--line-2)] grid place-items-center shrink-0 overflow-hidden">
            <svg viewBox="0 0 24 24" fill="#3178c6" stroke="#1f5fa3" strokeWidth="1.2" strokeLinejoin="round" className="size-7">
              <rect x="2" y="2" width="20" height="20" rx="2.5" />
              <text x="12" y="17" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="800" fontSize="11" fill="#fff">
                TS
              </text>
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-extrabold text-ink leading-tight truncate">{track}</div>
            <div className="font-mono text-[11px] text-ink-3 font-semibold mt-0.5">
              {totalAnswered}/{questions.length} câu đã làm
            </div>
          </div>
        </div>
        <div className="h-2 bg-paper-2 rounded-full border border-line overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(180deg, #7c6cdc 0%, var(--purple) 100%)',
            }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2.5" aria-label="Danh sách câu hỏi">
        {groupBySection(questions).map((sec) => (
          <div key={sec.name} className="mb-2.5">
            <div className="font-mono text-[10px] font-bold text-ink-3 uppercase tracking-[0.08em] px-2.5 pt-2.5 pb-1.5">
              {sec.name}
            </div>
            {sec.items.map((q) => {
              const status: QuestionStatus = statuses[q.id] ?? 'idle'
              const isCurrent = q.id === currentId
              const canNavigate = Boolean(q.body)
              return (
                <button
                  key={q.id}
                  type="button"
                  disabled={!canNavigate}
                  onClick={() => onPick(q.id)}
                  title={q.title}
                  className={cn(
                    'group flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-[10px] bg-transparent border-0 cursor-pointer text-left font-display text-[13px] font-semibold text-ink-2 transition-[background,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] relative',
                    canNavigate && 'hover:bg-paper-2 hover:text-ink',
                    !canNavigate && 'cursor-not-allowed opacity-60',
                    isCurrent && 'bg-paper-2 text-ink'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[11px] font-bold w-5.5 shrink-0 text-center',
                      isCurrent ? 'text-purple font-extrabold' : 'text-ink-3'
                    )}
                  >
                    {String(q.id).padStart(2, '0')}
                  </span>
                  <span className="flex-1 min-w-0 truncate">{q.title}</span>
                  <span className="size-5 shrink-0 grid place-items-center">
                    {status === 'correct' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-correct">
                        <path d="M5 12.5l5 5 9-11" />
                      </svg>
                    ) : status === 'wrong' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" className="size-3.5 text-wrong">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="size-2 rounded-full bg-purple animate-[cqpulse_1.6s_ease-in-out_infinite]" />
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
