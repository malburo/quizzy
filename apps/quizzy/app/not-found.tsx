import Link from 'next/link'
import { CenteredMessage } from '@/components/ui'

export default function NotFound() {
  return (
    <CenteredMessage
      eyebrow="404"
      title="Không tìm thấy trang"
      action={
        <Link
          href="/"
          className="text-brand-purple-deep decoration-brand-purple-tint inline-block font-bold underline underline-offset-4"
        >
          Về trang chủ
        </Link>
      }
    >
      Trang này không tồn tại hoặc đã bị di chuyển.
    </CenteredMessage>
  )
}
