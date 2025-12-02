import { create } from 'zustand'

export type CounterState = { count: number }
export type CounterActions = { increment: () => void; decrement: () => void; reset: () => void }
export type CounterStore = CounterState & CounterActions

export function createCounterStore() {
  return create<CounterStore>()((set, get) => ({
    count: 0,
    increment: () => set({ count: get().count + 1 }),
    decrement: () => set({ count: get().count - 1 }),
    reset: () => set({ count: 0 }),
  }))
}
