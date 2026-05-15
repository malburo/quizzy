'use client'

import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

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
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'chunky-btn w-full md:w-auto',
            'bg-paper-2 text-ink shadow-[0_2px_0_var(--line-2)] hover:bg-paper-2 hover:brightness-95',
            'active:translate-y-0.5 active:shadow-[0_1px_0_var(--line-2)]'
          )}
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            'chunky-btn w-full md:w-auto',
            'bg-wrong text-white shadow-[0_4px_0_var(--wrong-deep)] hover:brightness-110',
            'active:translate-y-0.5 active:shadow-[0_2px_0_var(--wrong-deep)]'
          )}
        >
          Xóa tất cả
        </button>
      </div>
    </Dialog>
  )
}
