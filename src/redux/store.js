import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Slice/counterSlice'
import textSlice from './Slice/textSlice'
import userCompetitiveSlice from './Slice/userCompetitiveSlice'

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        text: textSlice,
        userCompetitive: userCompetitiveSlice
    },
})