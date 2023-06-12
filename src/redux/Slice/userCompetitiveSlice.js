import { createSlice } from '@reduxjs/toolkit'

//typeActiveShuffle = 1 is active for eachplayer have the different shuffle, =2 is active for allplayer the same shuffle
const initialState = {
    correctCount: 0,
    incorrectCount: 0,
    totalScore: 0,
    currentIndexQuestion: 0,
    isShowLeaderBoard: true,
    playerResult: [],
    isActiveTimeCounter: true,
    isActiveShuffleQuestion: false,
    typeActiveShuffle: 2,
    isHostJoinGame: false
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
            state.playerResult = []
            state.isActiveTimeCounter = true
            state.isActiveShuffleQuestion = false
            state.typeActiveShuffle = 2
            state.isHostJoinGame = false
        },
        addPlayerResult: (state, actions) => {
            state.playerResult.push(actions.payload)
        },
        nextQuestion: (state) => {
            state.currentIndexQuestion += 1
        },
        showLeaderBoard: (state, actions) => {
            state.isShowLeaderBoard = actions.payload
        },
        setIsActiveTimeCounter: (state, actions) => {
            state.isActiveTimeCounter = actions.payload
        },
        setIsActiveShuffleQuestion: (state, actions) => {
            state.isActiveShuffleQuestion = actions.payload
        },
        setTypeActiveShuffle: (state, actions) => {
            state.typeActiveShuffle = actions.payload
        },
        setIsHostJoinGame: (state, actions) => {
            state.isHostJoinGame = actions.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { moreCorrect, moreIncorrect, clearInfoCompetitive, addPlayerResult, nextQuestion, showLeaderBoard, setIsActiveTimeCounter, setIsActiveShuffleQuestion, setTypeActiveShuffle, setIsHostJoinGame } = userCompetitiveSlice.actions

export default userCompetitiveSlice.reducer