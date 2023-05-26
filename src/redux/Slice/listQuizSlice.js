import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../../common/shareVarible'
import { ToastAndroid } from 'react-native'

const initialState = {
    quizzes: [],
    totalPage: 1,
    isLoadingMore: false
}

export const GET_getAllQuiz = createAsyncThunk("getAllQuiz", async (params, { rejectWithValue }) => {
    const { token, currentPage } = params
    const response = await fetch(BASE_URL + "/quiz?page=" + currentPage, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
    })
    try {
        const result = await response.json()
        if (result.message) {
            ToastAndroid.show(result.message, ToastAndroid.SHORT)
        }
        return result
    } catch (error) {
        state.isLoading = false
        return rejectWithValue(error)
    }
})

export const listQuizSlice = createSlice({
    name: 'listQuiz',
    initialState,
    extraReducers: builder => {
        builder.addCase(GET_getAllQuiz.pending, (state, actions) => {
            state.isLoadingMore = true
        })
        builder.addCase(GET_getAllQuiz.fulfilled, (state, actions) => {
            state.isLoadingMore = false
            state.quizzes = actions.payload.data
            state.totalPage = actions.payload.numberOfPages
        })
        builder.addCase(GET_getAllQuiz.rejected, (state, actions) => {
            state.isLoadingMore = false
        })
    }
})

// Action creators are generated for each case reducer function
export const { nextPage, resetPage } = listQuizSlice.actions

export default listQuizSlice.reducer