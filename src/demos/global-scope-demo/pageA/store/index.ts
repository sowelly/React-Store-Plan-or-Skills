import { create } from 'zustand'
import { createContextStore } from '@/store/factory'
import tableDataSlice from './tableDataSlice'
import formDataSlice from './formDataSlice'
import picStoreSlice from "./picStoreSlice.ts";

type PageAStore = ReturnType<typeof tableDataSlice> & ReturnType<typeof formDataSlice>&ReturnType<typeof picStoreSlice>

const createPageAStore = () =>
  create<PageAStore>()((...args) => ({
    ...tableDataSlice(...args),
    ...formDataSlice(...args),
    ...picStoreSlice(...args),
  }))

const { Provider: PageAProvider, useCtxStore } = createContextStore<PageAStore>(createPageAStore)

// selector helper
export const usePageASelector = <K extends keyof PageAStore>(key: K) => useCtxStore((state) => state[key])

export { PageAProvider }
