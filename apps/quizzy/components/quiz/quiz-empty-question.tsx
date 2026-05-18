'use client'

import { Avatar, type AvatarConfig } from '@/components/avatar/avatar'

const CONFIG: AvatarConfig = {
  Headshape: 5,
  SkinTone: 2,
  Body: 1,
  EyeColor: 947303,
  MainHair: 64,
  MainHairColor: 2,
  ClothingColor: 1,
  BackgroundColor: 0,
  ENG_ONLY_Zoom: 1,
  Expression: 5,
}

export function QuizEmptyQuestion() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Avatar config={CONFIG} className="size-28" />
      <p className="text-ink-3 text-base font-semibold">
        Câu này chưa có nội dung.
        <br />
        Đang chuẩn bị thêm câu hỏi! 🐛
      </p>
    </div>
  )
}
