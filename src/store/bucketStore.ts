import { create } from 'zustand'

type BucketState = {
  bucket: { a: number; b: number }
  incA: () => void
  incB: () => void
}

export const useBucket = create<BucketState>()((set, get) => ({
  bucket: { a: 0, b: 0 },
  incA: () => set((s) => ({ bucket: { ...s.bucket, a: s.bucket.a + 1 } })),
  incB: () => set((s) => ({ bucket: { ...s.bucket, b: s.bucket.b + 1 } })),
}))

