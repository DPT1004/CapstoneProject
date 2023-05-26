import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../../common/shareVarible'
import { ToastAndroid } from 'react-native'
import socketServcies from '../../until/socketServices'

const initialState = {
    _id: "",
    hostId: "",
    quizId: "",
    date: "",
    pin: "",
    isLive: false,
    playerList: [],
    isLoading: false,
}

export const POST_createGame = createAsyncThunk("createGame", async (newGame, { rejectWithValue }) => {
    const response = await fetch(BASE_URL + "/game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
    })
    try {
        const result = await response.json()
        if (result.message) {
            ToastAndroid.show(result.message, ToastAndroid.SHORT)
        } else {
            socketServcies.emit("init-game", result)
        }
        return result
    } catch (error) {
        state.isLoading = false
        return rejectWithValue(error)
    }
})


export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateGame: (state, actions) => {
            state._id = actions.payload._id
            state.hostId = actions.payload.hostId
            state.quizId = actions.payload.quizId
            state.date = actions.payload.date
            state.pin = actions.payload.pin
            state.isLive = actions.payload.isLive
            state.playerList = actions.payload.playerList
        },
        updatePlayerList: (state, actions) => {
            state.playerList = actions.payload
        },
        clearGame: (state) => {
            state._id = ""
            state.hostId = ""
            state.quizId = ""
            state.date = ""
            state.pin = ""
            state.isLive = false
            state.playerList = []
        }
    },
    extraReducers: builder => {
        builder.addCase(POST_createGame.pending, (state, actions) => {
            state.isLoading = true
        })
        builder.addCase(POST_createGame.fulfilled, (state, actions) => {
            state.isLoading = false
            state._id = actions.payload._id
            state.hostId = actions.payload.hostId
            state.quizId = actions.payload.quizId
            state.date = actions.payload.date
            state.pin = actions.payload.pin
            state.isLive = actions.payload.isLive
            state.playerList = actions.payload.playerList
        })
        builder.addCase(POST_createGame.rejected, (state, actions) => {
            state.isLoading = false
        })
    }
})

// Action creators are generated for each case reducer function
export const { updateGame, updatePlayerList, setIsLoading, clearGame } = gameSlice.actions

export default gameSlice.reducer