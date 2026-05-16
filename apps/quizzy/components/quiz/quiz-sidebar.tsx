'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { Question, QuizSet } from '@/models/quiz'
import { useAnsweredCount, useSession, useStatuses } from '@/stores/quiz-store'

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
  quiz,
  onPick,
  onReset,
  open,
  onToggle,
  onClose,
}: {
  quiz: QuizSet
  onPick: (id: number) => void
  onReset: () => void
  /** `undefined` → use viewport CSS default (mobile hidden, desktop wide). */
  open: boolean | undefined
  onToggle: () => void
  onClose: () => void
}) {
  const statuses = useStatuses(quiz.id)
  const totalAnswered = useAnsweredCount(quiz.id)
  const { currentId } = useSession()

  const correctCount = Object.values(statuses).filter((s) => s === 'correct').length
  const wrongCount = totalAnswered - correctCount

  // Desktop wide = open===true OR open===undefined (CSS default).
  const showWide = open !== false

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden',
          open === true ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden
      />

      <aside
        className={cn(
          'flex h-dvh flex-col bg-paper border-r-2 border-line',
          'transition-[width,transform] duration-200 ease-out',
          'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-72 max-md:shadow-2xl',
          'md:sticky md:top-0',
          // Mobile: hide unless user explicitly opens.
          open === true ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
          // Desktop: wide unless user explicitly closes.
          showWide ? 'md:w-72' : 'md:w-16'
        )}
      >
        <div
          className={cn(
            'flex items-center h-14 shrink-0 border-b border-line',
            showWide ? 'justify-between gap-2 px-3' : 'justify-center px-2'
          )}
        >
          {showWide ? (
            <>
              <span className="font-display text-lg font-extrabold tracking-tight text-ink">Quizzy</span>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  onClick={onReset}
                  disabled={totalAnswered === 0}
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Xóa toàn bộ tiến độ"
                  title="Xóa toàn bộ tiến độ"
                >
                  <ResetIcon />
                </Button>
                <Button
                  type="button"
                  onClick={onToggle}
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Đóng sidebar"
                >
                  <PanelIcon open />
                </Button>
              </div>
            </>
          ) : (
            <Button
              type="button"
              onClick={onToggle}
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Mở sidebar"
            >
              <PanelIcon open={false} />
            </Button>
          )}
        </div>

        {showWide ? (
          <>
            <div className="px-4 pt-4 pb-3.5 border-b border-line">
              <div className="flex items-center gap-3 mb-2.5">
                <span
                  className={cn(
                    'size-11 shrink-0 rounded-xl bg-paper-2 border-2 border-line-2 shadow-chunky-sm grid place-items-center text-2xl leading-none',
                    quiz.iconMono && 'font-mono font-extrabold text-base'
                  )}
                  style={quiz.iconMono ? { color: quiz.inkOfTint } : undefined}
                >
                  {quiz.icon}
                </span>
                <h2 className="min-w-0 t-small font-extrabold text-ink leading-tight text-pretty">
                  {quiz.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 t-caption">
                <span className="inline-flex items-center gap-1 text-correct-deep">
                  <CheckIcon />
                  {correctCount}
                </span>
                <span className="inline-flex items-center gap-1 text-wrong-deep">
                  <XIcon />
                  {wrongCount}
                </span>
                <span className="text-ink-3">/ {quiz.questions.length}</span>
              </div>
            </div>

            <motion.nav
              variants={staggerContainer(0.02)}
              initial="hidden"
              animate="show"
              className="flex-1 overflow-y-auto px-2 py-2.5"
              aria-label="Danh sách câu hỏi"
            >
              {groupBySection(quiz.questions).map((sec) => (
                <div key={sec.name} className="mb-2.5">
                  <div className="t-caption text-ink-3 px-2.5 pt-2.5 pb-1.5">
                    {sec.name}
                  </div>
                  {sec.items.map((q) => {
                    const status = statuses[q.id] ?? 'idle'
                    const isCurrent = q.id === currentId
                    return (
                      <motion.button
                        key={q.id}
                        variants={fadeUp}
                        type="button"
                        onClick={() => {
                          onPick(q.id)
                          if (window.innerWidth < 768) onClose()
                        }}
                        title={q.title}
                        className={cn(
                          'group flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-sm cursor-pointer text-left font-display t-small font-semibold text-ink-2 transition-[background,color] duration-150 ease-out',
                          'hover:bg-paper-2 hover:text-ink',
                          isCurrent && 'bg-paper-2 text-ink'
                        )}
                      >
                        <span
                          className={cn(
                            't-caption w-5.5 shrink-0 text-center',
                            isCurrent ? 'text-brand-purple font-extrabold' : 'text-ink-3'
                          )}
                        >
                          {String(q.id).padStart(2, '0')}
                        </span>
                        <span className="flex-1 min-w-0 truncate">{q.title}</span>
                        <StatusDot status={status} isCurrent={isCurrent} />
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </motion.nav>
          </>
        ) : (
          <motion.nav
            variants={staggerContainer(0.02)}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto py-2 hidden md:flex md:flex-col md:items-center md:gap-1"
            aria-label="Danh sách câu hỏi"
          >
            {quiz.questions.map((q) => {
              const status = statuses[q.id] ?? 'idle'
              const isCurrent = q.id === currentId
              return (
                <motion.button
                  key={q.id}
                  variants={fadeUp}
                  type="button"
                  onClick={() => onPick(q.id)}
                  title={q.title}
                  className={cn(
                    'grid size-9 place-items-center rounded-md t-caption transition-colors',
                    isCurrent
                      ? 'bg-paper-2 text-brand-purple-deep'
                      : status === 'correct'
                        ? 'text-correct-deep hover:bg-paper-2'
                        : status === 'wrong'
                          ? 'text-wrong-deep hover:bg-paper-2'
                          : 'text-ink-3 hover:bg-paper-2 hover:text-ink'
                  )}
                >
                  {String(q.id).padStart(2, '0')}
                </motion.button>
              )
            })}
          </motion.nav>
        )}
      </aside>
    </>
  )
}

function PanelIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      {open ? <path d="m16 15-3-3 3-3" /> : <path d="m14 9 3 3-3 3" />}
    </svg>
  )
}


function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" className="size-3">
      <path d="M5 12.5l5 5 9-11" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" className="size-3">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function StatusDot({ status, isCurrent }: { status: 'idle' | 'correct' | 'wrong'; isCurrent: boolean }) {
  return (
    <span className="size-5 shrink-0 grid place-items-center">
      {status === 'correct' ? (
        <span className="text-correct">
          <CheckIcon />
        </span>
      ) : status === 'wrong' ? (
        <span className="text-wrong">
          <XIcon />
        </span>
      ) : isCurrent ? (
        <span className="size-2 rounded-full bg-brand-purple animate-[cqpulse_1.6s_ease-in-out_infinite]" />
      ) : null}
    </span>
  )
}
