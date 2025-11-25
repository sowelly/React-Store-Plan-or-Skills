import type { StateCreator } from 'zustand'

export type ConnectionSlice = {
  connected: boolean
  connect: () => void
  disconnect: () => void
  toggle: () => void
}

export const createConnectionSlice: StateCreator<ConnectionSlice, [], [], ConnectionSlice> = (set, get) => ({
  connected: false,
  connect: () => set({ connected: true }),
  disconnect: () => set({ connected: false }),
  toggle: () => set((s: ConnectionSlice) => ({ connected: !s.connected })),
})
