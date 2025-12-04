import type { StoreApi, UseBoundStore } from 'zustand'

export function createStoreFactory<S>(createStoreFn: () => UseBoundStore<StoreApi<S>>) {
  const storeMap = new Map<string, UseBoundStore<StoreApi<S>>>()

  return (key: string) => {
    if (!storeMap.has(key)) {
      storeMap.set(key, createStoreFn())
    }
    return storeMap.get(key)!
  }
}
