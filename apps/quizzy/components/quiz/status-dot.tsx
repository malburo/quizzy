'use client'

type Status = 'idle' | 'correct' | 'wrong'

export function StatusDot({ status, isCurrent }: { status: Status; isCurrent: boolean }) {
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
