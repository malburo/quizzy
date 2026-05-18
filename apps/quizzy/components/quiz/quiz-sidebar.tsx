'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { QuizzyLogo } from '@/components/ui/quizzy-logo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { Question, QuizSet } from '@/models/quiz'
import { useStatuses } from '@/stores/quiz-store'
import { QuizResetDialog } from './quiz-reset-dialog'

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
  currentId,
  onPick,
}: {
  quiz: QuizSet
  currentId: number
  onPick: (id: number) => void
}) {
  const statuses = useStatuses(quiz.id)
  const { isMobile, setOpenMobile } = useSidebar()

  const handlePick = (id: number) => {
    onPick(id)
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas" className="max-md:pt-[env(safe-area-inset-top)]">
      <SidebarHeader>
        <div className="flex h-12 items-center justify-between gap-2 px-1">
          <QuizzyLogo size="sm" />
          <QuizResetDialog quizId={quiz.id} />
        </div>
        <h2 className="px-2 pb-1 t-small font-extrabold text-ink leading-tight text-pretty">
          {quiz.title}
        </h2>
      </SidebarHeader>

      <SidebarContent>
        {groupBySection(quiz.questions).map((sec) => (
          <SidebarGroup key={sec.name}>
            <SidebarGroupLabel>{sec.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <motion.div
                variants={staggerContainer(0.02)}
                initial="hidden"
                animate="show"
              >
                <SidebarMenu>
                  {sec.items.map((q) => {
                    const status = statuses[q.id] ?? 'idle'
                    const isCurrent = q.id === currentId
                    return (
                      <motion.div key={q.id} variants={fadeUp}>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            isActive={isCurrent}
                            onClick={() => handlePick(q.id)}
                            title={q.title}
                            className="t-small font-display font-semibold"
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
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </motion.div>
                    )
                  })}
                </SidebarMenu>
              </motion.div>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
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
