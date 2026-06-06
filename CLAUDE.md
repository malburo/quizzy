# CLAUDE.md

Quizzy monorepo (Turborepo + pnpm workspaces). Per-app guidance lives in each app folder.

## Apps

| App | Path | Per-app guide |
|---|---|---|
| **quizzy** | `apps/quizzy/` | [`apps/quizzy/CLAUDE.md`](apps/quizzy/CLAUDE.md) |

An `admin` app for managing quizzes is planned (`apps/admin/`).

## Commands (run from repo root)

```bash
pnpm dev          # turbo run dev (quizzy → http://localhost:3001)
pnpm build
pnpm lint
pnpm type-check

pnpm --filter @malburo/quizzy <task>   # run a single app's task
```

Root scripts use `turbo run <task>` (not the `turbo <task>` shorthand). No test suite is configured.

Open [`apps/quizzy/CLAUDE.md`](apps/quizzy/CLAUDE.md) for the app's architecture, data layer, design tokens, and conventions.
