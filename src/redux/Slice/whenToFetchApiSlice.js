import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    afterUpdateQuiz: false,
    afterCreateQuiz: false,
    pushOrUnshiftNewQuestion: 'unshift'
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
        setPushOrUnshiftNewQuestion: (state, actions) => {
            state.pushOrUnshiftNewQuestion = actions.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { reloadAfterUpdateQuiz, reloadAfterCreateQuiz, setPushOrUnshiftNewQuestion } = whenToFetchApiSlice.actions

export default whenToFetchApiSlice.reducer