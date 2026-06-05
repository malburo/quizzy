'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SettingsState = { soundEnabled: boolean }
type SettingsActions = { toggleSound: () => void }
type SettingsStore = SettingsState & { actions: SettingsActions }

// SSR-safe no-op storage so the store can be created during server render without
// touching localStorage. On the client, persist hydrates synchronously at creation;
// SoundToggle guards the first paint to avoid a hydration mismatch.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const useStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      actions: {
        toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      },
    }),
    {
      name: 'quizzy:settings',
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage
      ),
      partialize: (s) => ({ soundEnabled: s.soundEnabled }),
    }
  )
)

export const useSoundEnabled = () => useStore((s) => s.soundEnabled)
export const useSettingsActions = () => useStore((s) => s.actions)
