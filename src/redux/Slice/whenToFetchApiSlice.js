import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    afterUpdateQuiz: false,
    afterCreateQuiz: false,
}

export const whenToFetchApiSlice = createSlice({
    name: 'whenToFetchApi',
    initialState,
    reducers: {
        reloadAfterUpdateQuiz: (state) => {
            state.afterUpdateQuiz = !state.afterUpdateQuiz
        },
        reloadAfterCreateQuiz: (state) => {
            state.afterCreateQuiz = !state.afterCreateQuiz
        },
    },
})

// Action creators are generated for each case reducer function
export const { reloadAfterUpdateQuiz, reloadAfterCreateQuiz } = whenToFetchApiSlice.actions

export default whenToFetchApiSlice.reducer