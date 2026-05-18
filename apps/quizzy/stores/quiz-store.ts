'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ChoiceKey, QuestionStatuses } from '@/models/quiz'

type Status = 'correct' | 'wrong'
type Result = 'idle' | 'correct' | 'wrong'

type QuizState = {
  statuses: Record<string, QuestionStatuses>
  selected: ChoiceKey | null
  checked: boolean
  hasHydrated: boolean
}

type QuizActions = {
  pick: (key: ChoiceKey) => void
  submit: (args: { quizId: string; questionId: number; correctKey: ChoiceKey }) => void
  resetActive: () => void
  resetQuiz: (quizId: string) => void
  setHasHydrated: (v: boolean) => void
}

type QuizStore = QuizState & { actions: QuizActions }

const useStore = create<QuizStore>()(
  persist(
    (set) => ({
      statuses: {},
      selected: null,
      checked: false,
      hasHydrated: false,

      actions: {
        setHasHydrated: (v) => set({ hasHydrated: v }),

        pick: (key) => set({ selected: key }),

        submit: ({ quizId, questionId, correctKey }) =>
          set((state) => {
            if (state.selected == null) return state
            const result: Status = state.selected === correctKey ? 'correct' : 'wrong'
            return {
              checked: true,
              statuses: {
                ...state.statuses,
                [quizId]: {
                  ...(state.statuses[quizId] ?? {}),
                  [questionId]: result,
                },
              },
            }
          }),

        resetActive: () => set({ selected: null, checked: false }),

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
      partialize: (state) => ({ statuses: state.statuses }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.actions.setHasHydrated(true)
      },
    }
  )
)

export const useQuizActions = () => useStore((s) => s.actions)

export const useHasHydrated = () => useStore((s) => s.hasHydrated)

export const useStatuses = (quizId: string): QuestionStatuses =>
  useStore((s) => s.statuses[quizId] ?? EMPTY_STATUSES)

export const useAnsweredCount = (quizId: string): number =>
  useStore((s) => Object.keys(s.statuses[quizId] ?? {}).length)

export const useSelected = () => useStore((s) => s.selected)
export const useChecked = () => useStore((s) => s.checked)

export const useResult = (correctKey: ChoiceKey | null): Result => {
  const selected = useSelected()
  const checked = useChecked()
  if (!checked || correctKey == null) return 'idle'
  return selected === correctKey ? 'correct' : 'wrong'
}

export function useHydrateQuizStore() {
  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])
}

const EMPTY_STATUSES: QuestionStatuses = {}
