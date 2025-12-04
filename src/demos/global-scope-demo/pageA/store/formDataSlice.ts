const formDataSlice = (set: any) => ({
    formData: {},
    submitForm: (val) => set(() => ({formData: val})),
})

export default formDataSlice