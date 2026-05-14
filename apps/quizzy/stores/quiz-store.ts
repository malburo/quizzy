'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { ChoiceKey, Question, QuestionStatuses } from '@/models/quiz'

type Result = 'idle' | 'correct' | 'wrong'

/**
 * Per-question session state. Set when QuizApp syncs the URL → store.
 * Resets `selected` / `checked` whenever a new question is entered.
 */
type Session = {
  quizId: string
  questionId: number
  correctKey: ChoiceKey | null
  explanation: Question['explanation'] | null
  selected: ChoiceKey | null
  checked: boolean
}

type QuizState = {
  // Persisted answer records, keyed by quizId.
  statuses: Record<string, QuestionStatuses>

  // Ephemeral session — only the active question. Cleared/replaced on navigation.
  session: Session | null

  // Hydration flag.
  hasHydrated: boolean
}

type QuizActions = {
  setSession: (ctx: Pick<Session, 'quizId' | 'questionId' | 'correctKey' | 'explanation'>) => void
  select: (key: ChoiceKey) => void
  check: () => void
  resetQuiz: (quizId: string) => void
  setHasHydrated: (v: boolean) => void
}

// Actions are nested so a single `useQuizActions()` hook can return them all
// with a stable reference (no re-render churn — the object never changes).
type QuizStore = QuizState & { actions: QuizActions }

const useStore = create<QuizStore>()(
  persist(
    (set) => ({
      statuses: {},
      session: null,
      hasHydrated: false,

      actions: {
        setHasHydrated: (v) => set({ hasHydrated: v }),

        setSession: (ctx) =>
          set((state) => {
            // Same question as before → keep selected/checked so a re-render doesn't wipe progress.
            if (state.session?.quizId === ctx.quizId && state.session.questionId === ctx.questionId) {
              return state
            }
            return {
              session: { ...ctx, selected: null, checked: false },
            }
          }),

        select: (key) =>
          set((state) => {
            if (!state.session) return state
            return { session: { ...state.session, selected: key } }
          }),

        check: () =>
          set((state) => {
            const s = state.session
            if (!s || s.selected == null) return state
            const result = s.selected === s.correctKey ? 'correct' : 'wrong'
            return {
              statuses: {
                ...state.statuses,
                [s.quizId]: {
                  ...(state.statuses[s.quizId] ?? {}),
                  [s.questionId]: result,
                },
              },
              session: { ...s, checked: true },
            }
          }),

        resetQuiz: (quizId) =>
          set((state) => {
            if (!(quizId in state.statuses)) return state
            const next = { ...state.statuses }
            delete next[quizId]
            return { statuses: next }
          }),
      },
    }),
    {
      name: 'quizzy:progress',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Only `statuses` is persisted; `session`, `hasHydrated`, and `actions` are runtime-only.
      partialize: (state) => ({ statuses: state.statuses }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.actions.setHasHydrated(true)
      },
    }
  )
)

// ============================================================
// Public hooks — consumers don't import the raw store.
// ============================================================

/** Actions reference is stable (never changes), so this never causes re-renders. */
export const useQuizActions = () => useStore((s) => s.actions)

export const useHasHydrated = () => useStore((s) => s.hasHydrated)

export const useStatuses = (quizId: string): QuestionStatuses => useStore((s) => s.statuses[quizId] ?? EMPTY_STATUSES)

export const useAnsweredCount = (quizId: string): number =>
  useStore((s) => Object.keys(s.statuses[quizId] ?? {}).length)

export const useSession = () =>
  useStore(
    useShallow((s) => ({
      selected: s.session?.selected ?? null,
      checked: s.session?.checked ?? false,
      correctKey: s.session?.correctKey ?? null,
      currentId: s.session?.questionId ?? 0,
      canCheck: s.session?.selected != null,
    }))
  )

export const useResult = (): Result =>
  useStore((s) => {
    if (!s.session?.checked) return 'idle'
    return s.session.selected === s.session.correctKey ? 'correct' : 'wrong'
  })

export const useExplanation = (): string | undefined =>
  useStore((s) => {
    const ss = s.session
    if (!ss?.checked || !ss.explanation) return undefined
    const isCorrect = ss.selected === ss.correctKey
    return isCorrect ? ss.explanation.correct : ss.explanation.wrong
  })

/** Trigger localStorage hydration once on the client. Safe to call from many components — rehydrate is idempotent. */
export function useHydrateQuizStore() {
  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])
}

// Shared empty reference so `useStatuses` returns the same object when no data exists
// (prevents unnecessary re-renders on stores that never had data for a quiz).
const EMPTY_STATUSES: QuestionStatuses = {}
