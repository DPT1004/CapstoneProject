import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../../common/shareVarible'
import { ToastAndroid } from 'react-native'

const initialState = {
    quizzes: [],
    page: 1,
    totalPage: 1,
    txtSearch: "",
    chooseCategories: [],
    isRefreshing: false,
}

export const GET_refreshListQuiz = createAsyncThunk("refreshListQuiz", async (params, { rejectWithValue }) => {
    const { token } = params
    try {
        const response = await fetch(BASE_URL + "/quiz/search?page=" + 1, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                searchQuery: "",
                categories: []
            })
        })

        const result = await response.json()
        if (result.message) {
            ToastAndroid.show(result.message, ToastAndroid.SHORT)
        }
        return result
    } catch (error) {
        ToastAndroid.show(String(error), ToastAndroid.SHORT)
        return rejectWithValue(error)
    }
})

export const GET_getQuizBySearch = createAsyncThunk("getQuizBySearch", async (params, { rejectWithValue }) => {
    const { token, currentPage, txtSearch, chooseCategories } = params

    try {
        const response = await fetch(BASE_URL + "/quiz/search?page=" + currentPage, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                searchQuery: txtSearch,
                categories: chooseCategories
            })
        })

        const result = await response.json()
        if (result.message) {
            ToastAndroid.show(result.message, ToastAndroid.SHORT)
        }
        return result
    } catch (error) {
        ToastAndroid.show(String(error), ToastAndroid.SHORT)
        return rejectWithValue(error)
    }
})

export const listQuizSlice = createSlice({
    name: 'listQuiz',
    initialState,
    reducers: {
        clearQuizList: (state) => {
            state.quizzes = []
        },
        setTxtSearch: (state, actions) => {
            state.txtSearch = actions.payload
        },
        setChooseCategories: (state, actions) => {
            state.chooseCategories = actions.payload
        },
        setPage: (state, actions) => {
            state.page = actions.payload
        }
    },
    extraReducers: builder => {

        builder.addCase(GET_refreshListQuiz.pending, (state) => {
            state.isRefreshing = true
        })
        builder.addCase(GET_refreshListQuiz.fulfilled, (state, actions) => {
            state.isRefreshing = false
            state.quizzes = actions.payload.data
            state.totalPage = actions.payload.numberOfPages
        })
        builder.addCase(GET_refreshListQuiz.rejected, (state) => {
            state.isRefreshing = false
        })

        builder.addCase(GET_getQuizBySearch.fulfilled, (state, actions) => {
            state.quizzes = state.quizzes.concat(actions.payload.data)
            state.totalPage = actions.payload.numberOfPages
        })

    }
})

// Action creators are generated for each case reducer function
export const { clearQuizList, setTxtSearch, setChooseCategories, setPage } = listQuizSlice.actions

export default listQuizSlice.reducer