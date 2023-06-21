import { createSlice } from '@reduxjs/toolkit'

//typeActiveShuffle = 1 is active for eachplayer have the different shuffle, =2 is active for allplayer the same shuffle
const initialState = {
    currentIndexQuestion: 0,
    isShowLeaderBoard: true,
    isActiveTimeCounter: true,
    isActiveShuffleQuestion: false,
    typeActiveShuffle: 2,
    isHostJoinGame: false
}

export const userCompetitiveSlice = createSlice({
    name: 'userCompetitive',
    initialState,
    reducers: {
        clearInfoCompetitive: (state) => {
            state.currentIndexQuestion = 0
            state.isShowLeaderBoard = true
            state.isActiveTimeCounter = true
            state.isActiveShuffleQuestion = false
            state.typeActiveShuffle = 2
            state.isHostJoinGame = false
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
export const { clearInfoCompetitive, nextQuestion, showLeaderBoard, setIsActiveTimeCounter, setIsActiveShuffleQuestion, setTypeActiveShuffle, setIsHostJoinGame } = userCompetitiveSlice.actions

export default userCompetitiveSlice.reducer