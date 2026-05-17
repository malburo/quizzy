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

- `/` — library (grid of `CollectionCard`) — the landing page
- `/quizzes` — redirects to `/`
- `/quizzes/[id]` — quiz page; `?id=<questionId>` selects current question
- `/playground-avatar` — Rive avatar tuner (config builder + JSON export)

### Data layer

Quizzes live as markdown files in `content/quizzes/<slug>.md` with frontmatter (`title`, `desc`, `category`, `icon`, `tint`, `level`, `section`, `minutes`, `isNew`). Questions are `### N. Title` headings inside `## Section Name` blocks. Answer + explanation live inside a `<details>` block per question.

`lib/questions/parse-quiz.ts` reads frontmatter via gray-matter and parses question blocks into `Question[]`. `load-quiz.ts` caches the parsed result with React `cache()`.

Body content is converted to HTML by `marked` (server-side) and injected via `dangerouslySetInnerHTML` into `.cq-md` containers — styled by the `.cq-md` block in `globals.css`.

### State management — Zustand store (`stores/quiz-store.ts`)

Single store with `persist` middleware (localStorage). Holds:
- `statuses` — `Record<string, QuestionStatuses>` keyed by quiz id; each map: `Record<questionId, 'correct' | 'wrong'>`
- `session` — current `quizId`, `questionId`, `correctKey`, `explanation`, plus transient flags `selected` (chosen key) and `checked` (whether answer was submitted)

Derived selectors: `useResult()` (returns `'idle' | 'correct' | 'wrong'`), `useExplanation()` (returns explanation HTML only when `checked`), `useSession()` (returns `selected`, `checked`, `correctKey`, `currentId`, `canCheck`).

Hooks exposed: `useStatuses(quizId)`, `useAnsweredCount(quizId)`, `useResult()`, `useSession()`, `useExplanation()`, `useQuizActions()` (returns `{ select, check, setSession, resetQuiz }`).

**Hydration gate**: components that depend on persisted state must guard with `useHasHydrated()` (returns true after `onRehydrateStorage`). `QuizLibrary` and `QuizApp` both gate on this — showing `BeatLoader` until hydrated.

### Models (`models/quiz.ts`)

Minimal. `ChoiceKey`, `Choice`, `Question`, `QuizSet`, `QuizLevel`, `QuizSection`, `QuestionStatuses`. No comments — types are self-explanatory. `category` is plain `string` (stored but not validated).

### URL routing

Quiz page reads `?id=<n>` from `useSearchParams()` and treats URL as source of truth. `QuizApp` syncs URL → store via `setSession` on every render. Navigation uses `router.replace` (no history pollution). When all questions answered + URL has no `?id`, results screen is shown.

## Avatar (Rive)

`components/avatar/avatar.tsx` wraps `@rive-app/react-webgl2`. Driven by a single `config: AvatarConfig` prop applying input values to state machine `SMButtons`. Two SMs are loaded (`SMAvatar`, `SMButtons`); `default_avatar_bool` is forced off on mount so config takes effect.

**Inputs that drive the SM directly**: most fields (`SkinTone`, `MainHair`, `Expression`, etc.).

**Inputs that DON'T drive the SM** (require `rive.play()` directly): `ENG_ONLY_Animation`, `ENG_ONLY_XPBoost`. The component handles this via `PLAY_ON_VALUE` map — when the config sets one of these, the corresponding animation name is played.

**`bounceSignal` prop**: increment to fire the `bounce_trig` trigger (e.g. when an answer is judged). Used by `QuizMascotRow` to bounce on correct/wrong transitions.

`components/avatar/random-avatar.tsx` — wraps `Avatar` in a `<button>`, randomises `MainHair` + `Expression` on click and on first render. Used in the library hero.

`components/avatar/avatar-playground.tsx` is the config tuner UI — color/shape/bool pickers per state machine input, with JSON export. Not refactored to the design system; uses its own internal styling.

## Design system

See [`docs/superpowers/specs/2026-05-15-quizzy-design-system-design.md`](../../docs/superpowers/specs/2026-05-15-quizzy-design-system-design.md) for the full spec. Summary below.

### Color tokens (`app/globals.css`)

- **Brand**: `--brand-purple{,-deep,-soft,-tint}` → Tailwind `bg-brand-purple`, `text-brand-purple-deep`, etc.
- **Status**: `--status-correct{,-deep,-soft}`, `--status-wrong{,-deep,-soft}` → utilities `bg-correct`, `text-wrong-deep`, etc.
- **Accents** (Duolingo secondary): `bee` (yellow), `fox` (orange), `macaw` (blue), `mask` (pink), `sea` (teal). Each has `-soft` (light bg) and `-deep` (text/shadow).
- **Neutrals**: `paper`/`paper-2`/`paper-3` (cream surfaces), `ink`/`ink-2`/`ink-3`/`ink-4` (text scale), `line`/`line-2` (border, offset shadow color).

shadcn semantic tokens (`--primary`, `--destructive`, etc.) are mapped to the Quizzy palette in `:root`; default shadcn utilities (`bg-primary`, `text-destructive-foreground`) resolve to brand colors.

### Radius + shadow tokens

- `rounded-xs/sm/md/lg/xl/pill` (6/10/14/18/24/9999px)
- `shadow-chunky-sm/md/lg` — neutral offset shadows using `--line-2`
- `shadow-chunky-sm-brand/macaw/correct/wrong` — colored offset shadows for interactive elements
- `shadow-chunky-md-brand/correct/wrong` — heavier tier (buttons use `sm`, hover/active drops to `none`)

### Typography utilities

Defined as `@utility` blocks: `.t-display` (clamp 28–42px), `.t-h1` (32), `.t-h2` (24), `.t-h3` (18), `.t-body-lg` (17), `.t-body` (15), `.t-small` (13, display font semibold), `.t-caption` (11 mono uppercase), `.t-mono` (inline mono).

Never use `text-[Npx]` / `tracking-[N]` for typography — use a utility. Exceptions: relative `em` for inline code (`text-[0.92em]`) and clamp expressions for responsive display headings.

### Max-width convention

Use named Tailwind values — never raw numbers like `max-w-220`:
- `max-w-4xl` (56rem) — quiz content area and footer
- `max-w-7xl` (80rem) — library page and wide layouts
- `max-w-sm` (24rem) — narrow containers (search input, button groups)
- `max-w-2xl` (42rem) — error / not-found pages

### Motion (`lib/motion.ts`)

- `ease.out` — cubic-bezier `[0.22, 1, 0.36, 1]` for natural fades
- `ease.spring` — stiffness 380, damping 22 (general bounce)
- `ease.pop` — stiffness 500, damping 18 (entry pops)
- `pageEnter`, `popIn`, `slideUp`, `pressable` — preset spreadable props for `motion.*`
- `fadeUp` Variants + `staggerContainer(delay)` — for parent/child stagger sequences

**Pattern**: any new `motion.*` should import a preset from here. Don't redefine `initial`/`animate`/`transition` inline.

### Components (`components/ui/`)

shadcn-style primitives, customized to chunky aesthetic:

- **`Button`** — variants: `brand` / `success` / `danger` / `neutral` / `muted` / `ghost` / `pill`. Sizes: `sm` / `md` / `lg` / `icon`. `asChild` supported (Slot). Text is sentence case — no `uppercase` in base. `muted` has `disabled:opacity-100` (already looks disabled via gray bg/text, no extra fade needed).
- **`Card`** — variants: `default` (chunky-md shadow) / `subtle` (no shadow) / `elevated` (chunky-lg). Optional `interactive` prop adds hover-lift.
- **`Badge`** — 9 variants: `brand` + 5 accents (`bee`, `fox`, `macaw`, `mask`, `sea`) + `correct`/`wrong` + `neutral`. Always rendered with `.t-caption` text.
- **`Dialog`** — overlay `bg-ink/40`, content uses `popIn` motion + `shadow-chunky-md`.
- **`Input` / `Label`** — chunky bordered input with `shadow-chunky-sm`; label uses `.t-caption`.
- **`GitHubStarButton`** — wraps `Button variant="pill"`.
- **`QuizzyLogo`** — Q badge + "Quizzy" wordmark. Props: `size` (`sm`|`md`), `href` (default `/`).

### Markdown content styling (`@layer components`)

`.cq-bubble` — speech bubble with pseudo-element tail (mascot row).
`.cq-code` — fenced code blocks with chrome (header, dots, language swatch).
`.cq-md` — body markdown container (paragraphs, strong, em, inline code).

These cannot easily become React components due to pseudo-element/nested selector requirements. Keep in CSS.

## Quiz answer flow

1. User selects a choice → card highlights in **macaw** (blue): `border-macaw bg-macaw-soft shadow-chunky-sm-macaw text-macaw-deep`. ABCD badge is `bg-transparent` (inherits card bg). No framer animation on hover/tap for choices.
2. User clicks "Kiểm tra" → `check()` action sets `session.checked = true`.
3. Footer shows result: icon + "Đúng!" / "Sai" + action button on colored `bg-correct-soft` / `bg-wrong-soft`.
4. `QuizExplanation` animates in below the choices — `bg-paper`, colored border, explanation text. On mobile it auto-scrolls into view.
5. "Tiếp tục" / "Hiểu rồi" → `handleNext()` navigates to next unanswered question via URL.

## Conventions

- Pages are Client Components when they need hooks/browser APIs. The quiz pages dynamically import `QuizApp` and `AvatarPlayground` (`ssr: false`) because they use `localStorage`/`canvas`.
- Form-style controlled inputs use shadcn `Input` + `Label`. Validation state via `aria-invalid` (not class swap).
- `cn()` from `@/lib/utils` for all conditional class merging. Never template literals — Tailwind v4 scanner needs literal classes (the `LEVEL` map in `collection-card.tsx` is the pattern for variant-driven classes).
- File naming: kebab-case, singular for one-item components (`collection-card`), plural/descriptive for collections (`quiz-library`).
- `cq-bubble` / `cq-md` / `cq-code` utilities are retained from the pre-refactor design; do not delete or rename — markdown content rendering depends on them.
- Dynamic per-card CSS vars (`--tint`, `--ink-of-tint`) are set via `style=` on the parent element and consumed in children with `bg-(--tint)` Tailwind v4 syntax. This is the only acceptable use of `style=` for color — all other styling goes through Tailwind classes.

## Key files (cheat sheet)

| Concern | File |
|---|---|
| Design tokens | `app/globals.css` |
| Motion presets | `lib/motion.ts` |
| Store | `stores/quiz-store.ts` |
| Models | `models/quiz.ts` |
| Quiz parser | `lib/questions/parse-quiz.ts` |
| Quiz loader (cached) | `lib/questions/load-quiz.ts` |
| Library page | `components/library/quiz-library.tsx` |
| Collection card | `components/library/collection-card.tsx` |
| Quiz page orchestrator | `components/quiz/quiz-app.tsx` |
| Quiz choices | `components/quiz/quiz-choices.tsx` |
| Quiz explanation (below choices) | `components/quiz/quiz-explanation.tsx` |
| Quiz footer | `components/quiz/quiz-footer.tsx` |
| Avatar | `components/avatar/avatar.tsx` |
| Random avatar (library hero) | `components/avatar/random-avatar.tsx` |
| Avatar tuner | `components/avatar/avatar-playground.tsx` |
