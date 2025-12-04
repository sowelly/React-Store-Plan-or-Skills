import { create } from 'zustand'
import { createStoreFactory } from '@/store/factory'

type GlobalState = {
  userName: string
  count: number
  lastUpdated: number | null
  savingUser: boolean
  error: string | null
}

type GlobalActions = {
  setUser: (name: string) => void
  increment: () => void
  reset: () => void
  saveUser: (name: string) => Promise<void>
}

export type GlobalStore = GlobalState & GlobalActions

const globalStoreFactory = createStoreFactory(() => create<GlobalStore>()((set, get) => ({
  userName: 'Alice',
  count: 0,
  lastUpdated: null,
  savingUser: false,
  error: null,
  setUser: (name) => set({ userName: name, lastUpdated: Date.now() }),
  increment: () => set({ count: get().count + 1, lastUpdated: Date.now() }),
  reset: () => set({ count: 0, lastUpdated: Date.now() }),
  saveUser: async (name: string) => {
    set({ savingUser: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      set({ userName: name, lastUpdated: Date.now(), savingUser: false })
    } catch (e) {
      set({ error: 'save failed', savingUser: false })
    }
  },
})))

export const selectDirect = (key: keyof GlobalStore) => (state: GlobalStore) => state[key]

export const globalStore = globalStoreFactory('global')
