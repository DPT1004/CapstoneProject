import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: "",
    userId: "",
    token: "",
    refreshToken: "",
    name: "",
    photo: "",
    isLoginBySocial: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        handleUserLogin: (state, actions) => {
            state.email = actions.payload.user.email
            state.userId = actions.payload.user.id
            state.name = actions.payload.user.name
            state.photo = actions.payload.user.photo
            state.token = actions.payload.accessToken
            state.refreshToken = actions.payload.refreshToken
            state.isLoginBySocial = actions.payload.isLoginBySocial
        },
        handleUserLogOut: (state) => {
            state.email = ""
            state.userId = ""
            state.token = ""
            state.refreshToken = ""
            state.name = ""
            state.photo = ""
            state.isLoginBySocial = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { handleUserLogin, handleUserLogOut } = userSlice.actions

export default userSlice.reducer