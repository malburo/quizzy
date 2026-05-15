'use client'

import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function QuizResetDialog({
  open,
  onClose,
  onConfirm,
  answeredCount,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  answeredCount: number
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="m-0 mb-2 font-display text-[20px] font-extrabold tracking-tight text-ink">
        Xóa toàn bộ tiến độ?
      </h3>
      <p className="m-0 mb-5 text-[14px] font-semibold text-ink-2 leading-relaxed">
        Tất cả {answeredCount} câu trả lời sẽ bị xóa. Không hoàn tác được.
      </p>
      <div className="flex flex-col-reverse gap-2.5 md:flex-row md:justify-end">
        <Button
          type="button"
          onClick={onClose}
          variant="neutral"
          size="md"
          className="w-full md:w-auto"
        >
          Hủy
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          variant="danger"
          size="md"
          className="w-full md:w-auto"
        >
          Xóa tất cả
        </Button>
      </div>
    </Dialog>
  )
}
