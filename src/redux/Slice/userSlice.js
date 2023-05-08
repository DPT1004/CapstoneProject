import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: "",
    userId: "",
    token: "",
    refreshToken: ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        handleUserLogin: (state, actions) => {
            state.email = actions.payload.user.email
            state.userId = actions.payload.user.id
            state.token = actions.payload.accessToken
            state.refreshToken = actions.payload.refreshToken
        },
        handleUserLogOut: (state) => {
            state.email = ""
            state.userId = ""
            state.token = ""
            state.refreshToken = ""
        }
    },
})

// Action creators are generated for each case reducer function
export const { handleUserLogin, handleUserLogOut } = userSlice.actions

export default userSlice.reducer