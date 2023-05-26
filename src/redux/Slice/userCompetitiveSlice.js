import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    correctCount: 0,
    incorrectCount: 0,
    totalScore: 0,
    currentIndexQuestion: 0,
    isShowLeaderBoard: true
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
            state.isShowLeaderBoard = true
        },
        nextQuestion: (state) => {
            state.currentIndexQuestion += 1
        },
        showLeaderBoard: (state, actions) => {
            state.isShowLeaderBoard = actions.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { moreCorrect, moreIncorrect, clearInfoCompetitive, nextQuestion, showLeaderBoard } = userCompetitiveSlice.actions

export default userCompetitiveSlice.reducer