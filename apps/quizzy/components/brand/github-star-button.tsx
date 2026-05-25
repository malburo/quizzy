import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const REPO_URL = 'https://github.com/malburo/portfolio'

export function GitHubStarButton({ className }: { className?: string }) {
  return (
    <Button
      asChild
      variant="pill"
      size="sm"
      className={cn('gap-2', className)}
      aria-label="Star Quizzy on GitHub"
    >
      <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
        <span>Star</span>
        <span aria-hidden className="text-ink-3">|</span>
        <StarIcon />
      </a>
    </Button>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.12 3.04.73.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56C20.22 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-bee" aria-hidden>
      <path d="m12 17.27 5.18 3.13c.5.3 1.11-.15.98-.71l-1.37-5.89 4.57-3.96c.44-.38.2-1.1-.38-1.15l-6.03-.51-2.36-5.57c-.22-.53-.97-.53-1.19 0L9.04 8.18l-6.03.51c-.58.05-.82.77-.38 1.15l4.57 3.96-1.37 5.89c-.13.56.48 1.01.98.71L12 17.27Z" />
    </svg>
  )
}
