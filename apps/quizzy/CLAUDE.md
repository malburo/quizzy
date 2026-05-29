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

Next.js 16 App Router, React 19, TypeScript, Tailwind v4. Self-contained: no shared portfolio code beyond the monorepo tooling.

### Next.js 16 features enabled (`next.config.ts`)

- `reactCompiler: true` — React Compiler auto-memoizes; do NOT hand-write `useMemo`/`useCallback`/`memo` for pure perf.
- `cacheComponents: true` — opts into Next 16's component-level caching (PPR-style). Server Components are statically prerendered where possible, with dynamic boundaries for `useSearchParams`/cookies.
- `typedRoutes: true` — `Link`/`router.push` get type-safe routes. `link.d.ts` is regenerated lazily by Turbopack on first visit, or eagerly by `next build`.
- `output: 'standalone'` — Docker-friendly self-contained build.

### Routes (Server Components by default)

- `/` — RSC, statically prerendered (**SSG**). Calls `getAllQuizzes()` (server), renders the static shell (header/footer markup lives in `page.tsx`) + `<LibraryContent>` client island (search + cards + motion). Per-card progress fills in after hydration.
- `/quizzes` — RSC. `redirect('/')`.
- `/quizzes/[id]` — RSC. `generateStaticParams` + `generateMetadata`. Renders body markdown to HTML server-side via Shiki/marked, passes `bodyMap` into `<QuizApp>` client island. `params` is `Promise<{ id: string }>` (Next 15+ async).
- `/playground-avatar` — Client page (Rive needs `canvas`, dynamic-imports `AvatarPlayground` with `ssr: false`).

### Data layer

Quizzes live as markdown files in `content/quizzes/<slug>.md` with frontmatter (`title`, `desc`, `category`, `icon`, `iconMono`, `tint`, `inkOfTint`, `level`, `section`, `minutes`, `isNew`). Questions are `### N. Title` headings inside `## Section Name` blocks. Answer + explanation live inside a `<details>` block per question.

`lib/server/parse-quiz.ts` reads frontmatter via gray-matter and parses question blocks into `Question[]`. `lib/server/load-quiz.ts` reads markdown files from disk (`node:fs`) and uses `'use cache'` so reads are memoized across requests. Both live under `lib/server/` because they import `node:fs` / use `'server-only'` — barreling them would pull `fs` into client bundles.

### Library logos + grouping (`components/library/`)

Library cards render official **colored brand SVG logos** (Devicon) from `public/logos/<tech>.svg`, mapped by quiz id in `quiz-logo.tsx` (the frontmatter `icon`/`iconMono` is only a fallback for unmapped ids). `quiz-groups.tsx` owns the library ordering: `groupQuizzes()` splits quizzes into **Frontend** / **Backend** domains and sorts each by a fixed tech order (html → css → js → ts → react → nextjs, then express → mongo → socketio). `LibraryContent` renders these groups as a flat search-filtered grid with a borderless heading + count per domain.

`lib/questions/quiz-helpers.ts` is the pure helpers module (find next unanswered, get correct key, etc.) — safe for both server and client. The `lib/questions/index.ts` barrel re-exports ONLY these helpers; server-side loaders are deep-imported from `@/lib/server/load-quiz` directly in RSC pages.

Body content is converted to HTML by `marked` (server-side) and injected via `dangerouslySetInnerHTML` into `.cq-md` containers — styled by the `.cq-md` block in `globals.css`.

### State management — Zustand store (`stores/quiz-store.ts`)

Single store with `persist` middleware (localStorage). Holds:
- `statuses` — `Record<string, QuestionStatuses>` keyed by quiz id; each map: `Record<questionId, 'correct' | 'wrong'>`
- `session` — current `quizId`, `questionId`, `correctKey`, `explanation`, plus transient flags `selected` (chosen key) and `checked` (whether answer was submitted)

Derived selectors: `useResult()` (returns `'idle' | 'correct' | 'wrong'`), `useExplanation()` (returns explanation HTML only when `checked`), `useSession()` (returns `selected`, `checked`, `correctKey`, `currentId`, `canCheck`).

Hooks exposed: `useStatuses(quizId)`, `useAnsweredCount(quizId)`, `useResult()`, `useSession()`, `useExplanation()`, `useQuizActions()` (returns `{ select, check, setSession, resetQuiz }`).

**Hydration gate**: `QuizApp` (quiz page) guards with `useHasHydrated()` (true after `onRehydrateStorage`), showing `QuizAppLoading` until hydrated. The home page does **not** gate — it's SSG; `QuizCard` progress just renders nothing until the store rehydrates (server + first client render both read an empty store → no mismatch).

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

Defined as `@utility` blocks: `.t-display` (clamp 28–42px), `.t-h1` (32), `.t-h2` (24), `.t-h3` (18), `.t-body-lg` (17), `.t-body` (15), `.t-small` (13, display font semibold), `.t-caption` (11, display font, normal case), `.t-mono` (inline mono).

**One UI font.** All interface text uses the display font (Nunito) — including `.t-caption`, which is no longer mono/uppercase. JetBrains Mono is reserved for **code only**: fenced code blocks (`.cq-code`), inline code (`.cq-md code`), and code-valued answer choices. Don't apply `font-mono` or `uppercase` to chrome/labels.

Never use `text-[Npx]` / `tracking-[N]` for typography — use a utility. Exceptions: relative `em` for inline code (`text-[0.92em]`) and clamp expressions for responsive display headings.

### Max-width convention

Use named Tailwind values — never raw numbers like `max-w-220`:
- `max-w-4xl` (56rem) — quiz content area and footer
- `max-w-7xl` (80rem) — library page and wide layouts
- `max-w-sm` (24rem) — narrow containers (search input, button groups)
- `max-w-2xl` (42rem) — error / not-found pages

### Motion (`components/core/`)

Animation lives in `components/core/` (imported via the `@/components/core` barrel).

**Rule**: reach for a [motion-primitives](https://motion-primitives.com) component first. If it doesn't exist, build a custom component in `components/core/` — don't scatter bespoke animation logic across feature folders.

- `AnimatedGroup` (`core/animated-group.tsx`) — staggered entrance for a list/grid of children. Wraps each child in a `motion.div` and applies a `preset` (`scale`, `fade`, `blur-slide`, `zoom`, …). Used by the library card grid, quiz answer choices, and the results screen. Adapted from motion-primitives: the `as`/`asChild` polymorphism was dropped (it tripped the React Compiler "no components during render" lint rule) — it always renders `div`s.
- `motion.ts` presets — `ease`, `pageEnter`, `popIn`, `slideUp`, `pressable`. Spreadable props for one-off `motion.*` elements.

**Pattern**: any new `motion.*` should import a preset from `@/components/core`. Don't redefine `initial`/`animate`/`transition` inline.

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
4. `QuizExplanation` shows below the choices — `bg-paper`, colored border, explanation text. **Desktop**: visible immediately after checking. **Mobile**: hidden by default; the footer shows a "Giải thích" button that reveals it and smooth-scrolls to it (`scroll-mb-8` leaves breathing room above the footer). `mobileShowExplanation` state lives in `QuizApp` and resets per question.
5. "Tiếp tục" / "Hiểu rồi" → `handleNext()` navigates to next unanswered question via URL.

## Conventions

### Folder structure + barrels

Components are grouped by **feature** (`avatar/`, `brand/`, `core/`, `debby/`, `library/`, `quiz/`, `ui/`), not by route — many components are shared across pages (e.g. `Avatar` lives in both library hero and quiz mascot row).

```
components/
  avatar/   brand/   core/   debby/   library/   quiz/   ui/
hooks/
models/
stores/
lib/
  questions/          (quiz-helpers + barrel — pure, client-safe)
  server/             (load-quiz, parse-quiz, highlight — NO barrel)
```

`core/` holds animation primitives shared across features: the `AnimatedGroup` component (from motion-primitives) and the `motion.ts` presets.

Every folder has an `index.ts` barrel **except** `app/` (Next routing) and `lib/server/` (server-only safety — importing a barrel would pull `node:fs` / Shiki into client bundles). Import via the barrel, not the deep path:

```ts
import { Button, Input } from '@/components/ui'                     // ✅
import { Button } from '@/components/ui/button'                     // ❌

import type { QuizSet } from '@/models'                             // ✅
import { useStatuses } from '@/stores'                              // ✅
import { useQuizNavigation } from '@/hooks'                         // ✅
import { findNextUnanswered } from '@/lib/questions'                // ✅ client-safe helpers

import { loadAllQuizzes } from '@/lib/server/load-quiz'             // ✅ deep — by design
import { renderQuestionBody } from '@/lib/server/highlight'         // ✅ deep — by design
```

**Exception — `dynamic()` imports keep deep paths** to preserve code splitting. Importing through a barrel pulls the whole chunk:

```ts
// app/playground-avatar/page.tsx
const AvatarPlayground = dynamic(
  () => import('@/components/avatar/avatar-playground').then((m) => m.AvatarPlayground),
  { ssr: false },
)
```

### Other rules

- React Compiler is on — do NOT hand-write `useMemo`/`useCallback`/`memo` for pure perf wins (only when needed for non-perf reasons like ref-equality).
- Pages are Server Components by default. Switch to `'use client'` only when the page needs hooks/browser APIs. Heavy client-only widgets (Rive, canvas) are dynamic-imported with `ssr: false`.
- Form-style controlled inputs use shadcn `Input` + `Label`. Validation state via `aria-invalid` (not class swap).
- `cn()` from `@/lib/utils` for all conditional class merging. Never template literals — Tailwind v4 scanner needs literal classes (the cva variant maps in `components/ui/button.tsx` are the pattern for variant-driven classes).
- File naming: kebab-case, singular for one-item components (`quiz-card`), plural/descriptive for collections (`library-content`). Prefer the domain term (`quiz-*`) over synonyms.
- `cq-bubble` / `cq-md` / `cq-code` utilities are retained from the pre-refactor design; do not delete or rename — markdown content rendering depends on them.
- Dynamic per-card CSS vars (`--tint`, `--ink-of-tint`) are set via `style=` on the parent element and consumed in children with `bg-(--tint)` Tailwind v4 syntax. This is the only acceptable use of `style=` for color — all other styling goes through Tailwind classes.
- **Tailwind v4 CSS-var syntax**: read a CSS variable with the `(--var)` shorthand — e.g. `w-(--sidebar-width)`. The v3 `[--var]` form compiles to invalid CSS in v4 and is silently dropped (this once made the sidebar collapse to content width). Watch for it when pasting shadcn components. The sidebar width is `18rem` (`SIDEBAR_WIDTH` in `components/ui/sidebar.tsx`); long question titles `truncate` rather than widen it.

## Key files (cheat sheet)

| Concern | File |
|---|---|
| Design tokens | `app/globals.css` |
| Animation (AnimatedGroup + motion presets) | `components/core/` |
| Store | `stores/quiz-store.ts` |
| Models | `models/quiz.ts` |
| Quiz parser (server) | `lib/server/parse-quiz.ts` |
| Quiz loader (server, cached) | `lib/server/load-quiz.ts` |
| Quiz helpers (client-safe) | `lib/questions/quiz-helpers.ts` |
| Markdown highlighter (server) | `lib/server/highlight.ts` |
| Home shell (server, SSG) | `app/page.tsx` |
| Library list island (client) | `components/library/library-content.tsx` |
| Quiz card | `components/library/quiz-card.tsx` |
| Quiz logos (by id) | `components/library/quiz-logo.tsx` |
| Domain grouping/ordering | `components/library/quiz-groups.tsx` |
| Brand logo SVGs | `public/logos/` |
| Quiz page orchestrator | `components/quiz/quiz-app.tsx` |
| Quiz choices | `components/quiz/quiz-choices.tsx` |
| Quiz explanation (below choices) | `components/quiz/quiz-explanation.tsx` |
| Quiz footer | `components/quiz/quiz-footer.tsx` |
| Avatar | `components/avatar/avatar.tsx` |
| Random avatar (library hero) | `components/avatar/random-avatar.tsx` |
| Avatar tuner | `components/avatar/avatar-playground.tsx` |
