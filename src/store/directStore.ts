import { create } from 'zustand'

type DirectState = {
  x: number
  y: number
  incX: () => void
  incY: () => void
}

export const useDirectStore = create<DirectState>()((set, get) => ({
  x: 0,
  y: 0,
  incX: () => set((s) => ({ x: s.x + 1 })),
  incY: () => set((s) => ({ y: s.y + 1 })),
}))

