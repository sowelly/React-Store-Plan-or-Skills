import type { StateCreator } from 'zustand'

export type InputSlice = {
  input: string
  setInput: (v: string) => void
  send: () => void
}

export const createInputSlice: StateCreator<any, [], [], InputSlice> = (set, get) => ({
  input: '',
  setInput: (v) => set({ input: v }),
  send: () => {
    const text = get().input
    if (!text.trim()) return
    get().addMessage(text, 'me')
    set({ input: '' })
  },
})
