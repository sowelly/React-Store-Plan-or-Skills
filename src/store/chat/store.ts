import { create } from 'zustand'
import { createConnectionSlice } from './connectionSlice'
import { createMessageSlice } from './messageSlice'
import { createInputSlice } from './inputSlice'
import type { ConnectionSlice } from './connectionSlice'
import type { MessageSlice } from './messageSlice'
import type { InputSlice } from './inputSlice'

export type ChatStore = ConnectionSlice & MessageSlice & InputSlice

export const useChatStore = create<ChatStore>()((set, get) => ({
  ...createConnectionSlice(set, get),
  ...createMessageSlice(set, get),
  ...createInputSlice(set, get),
}))
