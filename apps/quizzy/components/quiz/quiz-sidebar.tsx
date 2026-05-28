'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { QuizzyLogo } from '@/components/brand'
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
} from '@/components/ui'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { Question, QuizSet } from '@/models'
import { useStatuses } from '@/stores'
import { QuizResetDialog } from './quiz-reset-dialog'
import { StatusDot } from './status-dot'

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
        <div className="flex h-12 items-center px-1">
          <QuizzyLogo size="sm" />
        </div>
        <div className="-mx-2 border-t border-line" />
        <div className="flex items-center justify-between gap-2 px-2 pt-1.5">
          <h2 className="flex-1 min-w-0 t-small font-extrabold text-ink leading-tight line-clamp-2">
            {quiz.title}
          </h2>
          <QuizResetDialog quiz={quiz} />
        </div>
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

