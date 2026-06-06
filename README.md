<div align="center">

# 🦉 Quizzy

**A Duolingo-style quiz app for learning programming — playful, tactile, fast.**

[![Live demo](https://img.shields.io/badge/demo-quiz.malburo.site-58cc02?style=flat-square)](https://quiz.malburo.site)
&nbsp;![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs)
&nbsp;![React](https://img.shields.io/badge/React-19-1cb0f6?style=flat-square&logo=react)
&nbsp;![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)

</div>

![Quizzy](docs/hero.png)

Bite-sized multiple-choice quizzes for web fundamentals — HTML, CSS, JS, TS, React, Next.js, Express, MongoDB, Socket.io — with the chunky, satisfying feel of Duolingo. Questions are authored in plain Markdown and progress is saved locally, so there's no sign-up.

> Quiz content is in Vietnamese 🇻🇳.

## Features

- **Duolingo-style lesson flow** — 3D buttons, distinct choice states, a feedback panel that rises from the bottom, and randomized encouragement.
- **Interactive Rive mascot** that reacts to every answer.
- **Sound + haptics** — toggleable audio cues and vibration where supported.
- **Markdown quizzes** with server-side syntax highlighting (Shiki) and Next.js-docs–style code blocks + copy button.
- **Keyboard friendly** — press `1`–`4` to answer.
- **Offline-first progress** via `localStorage` (Zustand persist).
- **SEO & share cards** with `next/og`, sitemap, and robots.
- **Accessible motion** — honors `prefers-reduced-motion`.

## Screenshots

![Quizzy on desktop](docs/quiz-desktop.png)

Instant feedback, with the answer revealed and an explanation a tap away:

<table>
  <tr>
    <td align="center"><b>Correct</b></td>
    <td align="center"><b>Incorrect</b></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/correct.png" alt="Correct answer" /></td>
    <td width="50%"><img src="docs/wrong.png" alt="Incorrect answer" /></td>
  </tr>
</table>

## Tech stack

**Next.js 16** (App Router · RSC · Partial Prerendering · React Compiler) · **React 19** · **TypeScript** · **Tailwind CSS v4** · **Zustand** · **Rive** · **Shiki** · **Turborepo + pnpm**

## Getting started

```bash
pnpm install
pnpm dev            # → http://localhost:3001
```

Requires Node ≥ 20 and pnpm. Other tasks: `pnpm build`, `pnpm lint`, `pnpm type-check`.

Turborepo monorepo — the app lives in `apps/quizzy` (an `apps/admin` is planned).

---

<div align="center">

Designed &amp; built by **[malburo](https://malburo.site)** in collaboration with **[Claude Code](https://claude.com/claude-code)**.

If Quizzy made learning a little more fun, leave a ⭐

</div>
