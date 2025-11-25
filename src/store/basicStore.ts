import { create } from 'zustand'

type BasicState = {
  count: number
  inc: () => void
  dec: () => void
}

export const useBasicStore = create<BasicState>()((set, get) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  dec: () => set((s) => ({ count: s.count - 1 })),
}))

