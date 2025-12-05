import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import type { StoreApi, UseBoundStore } from 'zustand'
import React from 'react'

export function createContextStore<S>(createStoreFn: () => UseBoundStore<StoreApi<S>>) {
  const Ctx = createContext<UseBoundStore<StoreApi<S>> | null>(null)

  const Provider = ({ children }: { children: ReactNode }) => {
    const [store] = useState(createStoreFn)
    return React.createElement(Ctx.Provider, { value: store }, children)
  }

  const useCtxStore = <U>(selector: (s: S) => U, eq = shallow) => {
    const store = useContext(Ctx)
    if (!store) throw new Error('Must use inside Provider')
    return useStoreWithEqualityFn(store, selector, eq)
  }

  return { Provider, useCtxStore }
}
