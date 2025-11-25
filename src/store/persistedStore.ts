import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type PersistedState = {
  pcount: number
  inc: () => void
  hydrated: boolean
  setHydrated: (v: boolean) => void
}

export const usePersisted = create<PersistedState>()(
  persist(
    (set, get) => ({
      pcount: 0,
      inc: () => set({ pcount: get().pcount + 1 }),
      hydrated: false,
      setHydrated: (v: boolean) => set({ hydrated: v }),
    }),
    {
      name: 'persist-demo',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export function useHydrated() {
  return usePersisted((s) => s.hydrated)
}
