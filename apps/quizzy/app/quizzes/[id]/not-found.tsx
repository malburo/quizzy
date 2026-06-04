import Link from 'next/link'
import { CenteredMessage } from '@/components/ui'

export default function NotFound() {
  return (
    <CenteredMessage
      eyebrow="404"
      title="Bộ câu hỏi không tồn tại"
      action={
        <Link
          href="/quizzes"
          className="text-brand-purple-deep decoration-brand-purple-tint inline-block font-bold underline underline-offset-4"
        >
          Xem tất cả bộ câu hỏi
        </Link>
      }
    >
      Bộ này có thể chưa được chuẩn bị xong hoặc bạn gõ sai URL.
    </CenteredMessage>
  )
}
