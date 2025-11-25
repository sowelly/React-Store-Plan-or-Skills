import type { StateCreator } from 'zustand'

export type ChatMessage = {
  id: number
  text: string
  sender: 'me' | 'system'
  time: number
}

export type MessageSlice = {
  messages: ChatMessage[]
  addMessage: (text: string, sender?: 'me' | 'system') => void
  clearMessages: () => void
}

export const createMessageSlice: StateCreator<any, [], [], MessageSlice> = (set, get) => ({
  messages: [],
  addMessage: (text, sender = 'me') =>
    set((s: any) => ({
      messages: [
        ...s.messages,
        { id: Date.now(), text, sender, time: Date.now() },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
})
