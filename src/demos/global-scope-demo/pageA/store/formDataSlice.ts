import type {BoundStore} from "../../../../store/boundStore.ts";

const aInfoSlice =(set: any) => ({
    valueA: 0,
    incA: () => set((s: BoundStore) => ({ valueA: s.valueA + 1 })),
    decA: () => set((s: BoundStore) => ({ valueA: s.valueA - 1 })),
})

export default aInfoSlice