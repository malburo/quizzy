'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
} from '@/components/ui'
import { useIsMobile } from '@/hooks/use-mobile'
import type { QuizSet } from '@/models'
import { useAnsweredCount, useQuizActions } from '@/stores'
import { useQuizNavigation } from '@/hooks'

export function QuizResetDialog({ quiz }: { quiz: QuizSet }) {
  const answeredCount = useAnsweredCount(quiz.id)
  const { resetQuiz } = useQuizActions()
  const { clearQuestion } = useQuizNavigation(quiz)
  const isMobile = useIsMobile()

  const handleConfirm = () => {
    resetQuiz(quiz.id)
    clearQuestion()
  }

  const trigger = (
    <Button
      type="button"
      disabled={answeredCount === 0}
      variant="ghost"
      size="sm"
      className="h-8 shrink-0 gap-1.5 px-2 min-w-0 text-ink-3 hover:text-ink"
      aria-label="Xóa toàn bộ tiến độ"
      title="Xóa toàn bộ tiến độ"
    >
      <ResetIcon />
      <span className="t-caption">Reset</span>
    </Button>
  )

  const title = 'Xóa toàn bộ tiến độ?'
  const description = `Tất cả ${answeredCount} câu trả lời sẽ bị xóa. Không hoàn tác được.`

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="bg-paper">
          <DrawerHeader>
            <DrawerTitle className="t-h2 text-ink">{title}</DrawerTitle>
            <DrawerDescription className="t-body text-ink-2">{description}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" onClick={handleConfirm} variant="danger" size="md" className="w-full">
                Xóa tất cả
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button type="button" variant="neutral" size="md" className="w-full">
                Hủy
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <h3 className="m-0 mb-2 t-h2 text-ink">{title}</h3>
        <p className="m-0 mb-5 t-body text-ink-2">{description}</p>
        <div className="flex flex-col-reverse gap-2.5 md:flex-row md:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="neutral" size="md" className="w-full md:w-auto">
              Hủy
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleConfirm}
              variant="danger"
              size="md"
              className="w-full md:w-auto"
            >
              Xóa tất cả
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
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
