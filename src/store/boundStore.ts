import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

// Slice A
type SliceA = {
  valueA: number
  incA: () => void
  decA: () => void
}

const createSliceA = (set: any) => ({
  valueA: 0,
  incA: () => set((s: BoundStore) => ({ valueA: s.valueA + 1 })),
  decA: () => set((s: BoundStore) => ({ valueA: s.valueA - 1 })),
})

// Slice B
type SliceB = {
  valueB: number
  incB: () => void
  decB: () => void
}

const createSliceB = (set: any) => ({
  valueB: 0,
  incB: () => set((s: BoundStore) => ({ valueB: s.valueB + 1 })),
  decB: () => set((s: BoundStore) => ({ valueB: s.valueB - 1 })),
})

export type BoundStore = SliceA & SliceB

export const useBoundStore = create<BoundStore>()((...a) => ({
  ...createSliceA(...a),
  ...createSliceB(...a),
}))

// 便捷导出 shallow 选择器，用于组合选择避免不必要重渲染
export { useShallow }