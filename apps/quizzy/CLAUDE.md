# Quizzy

Guidance for Claude Code when working in `apps/quizzy/`.

## Commands

```bash
pnpm --filter @malburo/quizzy dev         # dev server (Turbopack)
pnpm --filter @malburo/quizzy build       # production build
pnpm --filter @malburo/quizzy lint
pnpm --filter @malburo/quizzy type-check
```

No test suite.

## Architecture

Next.js 15 App Router, React 19, TypeScript, Tailwind v4. Self-contained: no shared portfolio code beyond the monorepo tooling.

### Routes

- `/` — landing (placeholder)
- `/quizzes` — library (grid of `CollectionCard`)
- `/quizzes/[id]` — quiz page; `?id=<questionId>` selects current question
- `/playground-avatar` — Rive avatar tuner (config builder + JSON export)

### Data layer

Quizzes live as markdown files in `content/quizzes/<slug>.md` with frontmatter (`title`, `desc`, `category`, `icon`, `tint`, `level`, `section`, `minutes`, `isNew`). Questions are `### N. Title` headings inside `## Section Name` blocks. Answer + explanation live inside a `<details>` block per question.

`lib/questions/parse-quiz.ts` reads frontmatter via gray-matter and parses question blocks into `Question[]`. `load-quiz.ts` caches the parsed result with React `cache()`.

Body content is converted to HTML by `marked` (server-side) and injected via `dangerouslySetInnerHTML` into `.cq-md` containers — styled by the `.cq-md` block in `globals.css`.

### State management — Zustand store (`stores/quiz-store.ts`)

Single store with `persist` middleware (localStorage). Holds:
- `statuses` — `Record<string, QuestionStatuses>` keyed by quiz id; each map: `Record<questionId, 'correct' | 'wrong'>`
- `session` — current `quizId`, `questionId`, `correctKey`, `explanation`, plus transient flags `selectedKey`, `result`, `canCheck`

Hooks exposed: `useStatuses(quizId)`, `useAnsweredCount(quizId)`, `useResult()`, `useSession()`, `useExplanation()`, `useQuizActions()` (returns `{ select, check, setSession, resetQuiz }`).

**Hydration gate**: components that depend on persisted state must guard with `useHasHydrated()` (returns true after `onRehydrateStorage`). `QuizApp` renders `<QuizAppLoading />` until hydrated.

### Models (`models/quiz.ts`)

Minimal. `ChoiceKey`, `Choice`, `Question`, `QuizSet`, `QuizLevel`, `QuizSection`, `QuestionStatuses`. No comments — types are self-explanatory. `category` is plain `string` (stored but not validated).

### URL routing

Quiz page reads `?id=<n>` from `useSearchParams()` and treats URL as source of truth. `QuizApp` syncs URL → store via `setSession` on every render. Navigation uses `router.replace` (no history pollution). When all questions answered + URL has no `?id`, results screen is shown.

## Avatar (Rive)

`components/avatar/avatar.tsx` wraps `@rive-app/react-webgl2`. Driven by a single `config: AvatarConfig` prop applying input values to state machine `SMButtons`. Two SMs are loaded (`SMAvatar`, `SMButtons`); `default_avatar_bool` is forced off on mount so config takes effect.

**Inputs that drive the SM directly**: most fields (`SkinTone`, `MainHair`, `Expression`, etc.).

**Inputs that DON'T drive the SM** (require `rive.play()` directly): `ENG_ONLY_Animation`, `ENG_ONLY_XPBoost`. The component handles this via `PLAY_ON_VALUE` map — when the config sets one of these, the corresponding animation name is played.

**`bounceSignal` prop**: increment to fire the `bounce_trig` trigger (e.g. when an answer is judged). Used by `QuizMascotRow` to bounce on correct/wrong transitions.

`components/avatar/avatar-playground.tsx` is the config tuner UI — color/shape/bool pickers per state machine input, with JSON export. Not refactored to the design system yet; uses its own internal styling.

## Design system

See [`docs/superpowers/specs/2026-05-15-quizzy-design-system-design.md`](../../docs/superpowers/specs/2026-05-15-quizzy-design-system-design.md) for the full spec. Summary below.

### Color tokens (`app/globals.css`)

- **Brand**: `--brand-purple{,-deep,-soft,-tint}` → Tailwind `bg-brand-purple`, `text-brand-purple-deep`, etc.
- **Status**: `--status-correct{,-deep,-soft}`, `--status-wrong{,-deep,-soft}` → utilities `bg-correct`, `text-wrong-deep`, etc.
- **Accents** (Duolingo secondary): `bee` (yellow), `fox` (orange), `macaw` (blue), `mask` (pink), `sea` (teal). Each has `-soft` (badge bg) and `-deep` (badge text / shadow).
- **Neutrals**: `paper`/`paper-2`/`paper-3` (cream surfaces), `ink`/`ink-2`/`ink-3`/`ink-4` (text scale), `line`/`line-2` (border, offset shadow color).

shadcn semantic tokens (`--primary`, `--destructive`, etc.) are mapped to the Quizzy palette in `:root`; default shadcn utilities (`bg-primary`, `text-destructive-foreground`) resolve to brand colors.

### Radius + shadow tokens

- `rounded-xs/sm/md/lg/xl/pill` (6/10/14/18/24/9999px)
- `shadow-chunky-sm/md/lg` — offset shadows using `--line-2`
- `shadow-chunky-md-brand/correct/wrong` — colored offset shadows for filled buttons (use `var(--brand-purple-deep)` etc.). Active state drops one tier: `md → sm`.

### Typography utilities

Defined as `@utility` blocks: `.t-display` (clamp 28–42px), `.t-h1` (32), `.t-h2` (24), `.t-h3` (18), `.t-body-lg` (17), `.t-body` (15), `.t-small` (13), `.t-caption` (11 mono uppercase), `.t-mono` (inline mono).

Never use `text-[Npx]` / `tracking-[N]` for typography — use a utility. Exceptions: relative `em` for inline code (`text-[0.92em]`) and clamp expressions for responsive display headings.

### Motion (`lib/motion.ts`)

- `ease.out` — cubic-bezier `[0.22, 1, 0.36, 1]` for natural fades
- `ease.spring` — stiffness 380, damping 22 (general bounce)
- `ease.pop` — stiffness 500, damping 18 (entry pops)
- `pageEnter`, `popIn`, `slideUp`, `pressable` — preset spreadable props for `motion.*`
- `fadeUp` Variants + `staggerContainer(delay)` — for parent/child stagger sequences

**Pattern**: any new `motion.*` should import a preset from here. Don't redefine `initial`/`animate`/`transition` inline.

### Components (`components/ui/`)

shadcn-style primitives, customized to chunky aesthetic:

- **`Button`** — variants: `brand` / `success` / `danger` / `neutral` / `ghost` / `pill`. Sizes: `sm` / `md` / `lg` / `icon`. `asChild` supported (Slot). All chunky variants have active state translate-y-0.5 + drop one shadow tier.
- **`Card`** — variants: `default` (chunky-md shadow) / `subtle` (no shadow) / `elevated` (chunky-lg). Optional `interactive` prop adds hover-lift.
- **`Badge`** — 9 variants: `brand` + 5 accents (`bee`, `fox`, `macaw`, `mask`, `sea`) + `correct`/`wrong` + `neutral`. Always rendered with `.t-caption` text.
- **`Dialog`** — overlay `bg-ink/40`, content uses `popIn` motion + `shadow-chunky-md`.
- **`Input` / `Label`** — chunky bordered input with `shadow-chunky-sm`; label uses `.t-caption`.
- **`GitHubStarButton`** — wraps `Button variant="pill"`.

### Markdown content styling (`@layer components`)

`.cq-bubble` — speech bubble with pseudo-element tail (mascot row).
`.cq-code` — fenced code blocks with chrome (header, dots, language swatch).
`.cq-md` — body markdown container (paragraphs, strong, em, inline code).

These cannot easily become React components due to pseudo-element/nested selector requirements. Keep in CSS.

## Conventions

- Pages are Client Components when they need hooks/browser APIs. The quiz pages dynamically import `QuizApp` and `AvatarPlayground` (`ssr: false`) because they use `localStorage`/`canvas`.
- Form-style controlled inputs use shadcn `Input` + `Label`. Validation state via `aria-invalid` (not class swap).
- `cn()` from `@/lib/utils` for all conditional class merging. Never template literals — Tailwind v4 scanner needs literal classes (the `LEVEL_DOT_CLASS` map in `collection-card.tsx` is the pattern for variant-driven classes).
- File naming: kebab-case, singular for one-item components (`collection-card`), plural/descriptive for collections (`quiz-library`).
- `cq-bubble` / `cq-md` / `cq-code` utilities are retained from the pre-refactor design; do not delete or rename — markdown content rendering depends on them.

## Key files (cheat sheet)

| Concern | File |
|---|---|
| Design tokens | `app/globals.css` |
| Motion presets | `lib/motion.ts` |
| Store | `stores/quiz-store.ts` |
| Models | `models/quiz.ts` |
| Quiz parser | `lib/questions/parse-quiz.ts` |
| Quiz loader (cached) | `lib/questions/load-quiz.ts` |
| Quiz page orchestrator | `components/quiz/quiz-app.tsx` |
| Avatar | `components/avatar/avatar.tsx` |
| Avatar tuner | `components/avatar/avatar-playground.tsx` |
