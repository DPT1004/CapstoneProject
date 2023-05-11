import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    correctCount: 0,
    incorrectCount: 0,
    totalScore: 0,
    currentIndexQuestion: 0
}

export const userCompetitiveSlice = createSlice({
    name: 'userCompetitive',
    initialState,
    reducers: {
        moreCorrect: (state, actions) => {
            state.correctCount += 1
            state.totalScore += actions.payload
        },
        moreIncorrect: (state) => {
            state.incorrectCount += 1
        },
        clearInfoCompetitive: (state) => {
            state.correctCount = 0
            state.incorrectCount = 0
            state.totalScore = 0
            state.currentIndexQuestion = 0
        },
        nextQuestion: (state) => {
            state.currentIndexQuestion += 1
        }
    },
})

// Action creators are generated for each case reducer function
export const { moreCorrect, moreIncorrect, clearInfoCompetitive, nextQuestion } = userCompetitiveSlice.actions

export default userCompetitiveSlice.reducer