import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOnlineStatus: false
}

export const internetSLice = createSlice({
    name: 'internet',
    initialState,
    reducers: {
        setIsOnlineStatus: (state, actions) => {
            state.isOnlineStatus = actions.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setIsOnlineStatus } = internetSLice.actions

export default internetSLice.reducer