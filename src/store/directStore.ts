import { create } from 'zustand'

type DirectState = {
  x: number
  y: number
  tick: number
  incX: () => void
  incY: () => void
  incTick: () => void
}

export const useDirectStore = create<DirectState>()((set) => ({
  x: 0,
  y: 0,
  tick: 0,
  incX: () => set((s) => ({ x: s.x + 1 })),
  incY: () => set((s) => ({ y: s.y + 1 })),
  incTick: () => set((s) => ({ tick: s.tick + 1 })),
}))
