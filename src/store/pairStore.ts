import { create } from 'zustand'

type PairState = {
  a: number
  b: number
  incA: () => void
  incB: () => void
}

export const usePairStore = create<PairState>()((set, get) => ({
  a: 0,
  b: 0,
  incA: () => set((s) => ({ a: s.a + 1 })),
  incB: () => set((s) => ({ b: s.b + 1 })),
}))

