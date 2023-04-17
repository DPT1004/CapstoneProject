import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: "",
}

export const textSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        updateText: (state, action) => {
            state.value = action.payload
        },

    },
})

// Action creators are generated for each case reducer function
export const { updateText } = textSlice.actions

export default textSlice.reducer