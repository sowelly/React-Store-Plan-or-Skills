import { useRef } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'

export function createScopedStore<S>(createStoreFn: () => UseBoundStore<StoreApi<S>>) {
  return () => useRef(createStoreFn()).current
}
