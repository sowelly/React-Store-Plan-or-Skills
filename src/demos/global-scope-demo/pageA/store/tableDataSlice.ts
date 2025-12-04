const tableDataSlice = (set: any, get: any) => ({
  data: [{ a: 0, b: 0 }],
  setData: () =>
    set((s: { data: Array<{ a: number; b: number }> }) => ({
      data: [...s.data, { a: Math.random(), b: Math.random() }],
    })),
})

export default tableDataSlice
