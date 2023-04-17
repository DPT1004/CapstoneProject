import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Slice/counterSlice'
import textSlice from './Slice/textSlice'

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        text: textSlice
    },
})