import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Slice/counterSlice'
import userCompetitiveSlice from './Slice/userCompetitiveSlice'
import userSlice from './Slice/userSlice'
import newQuizSlice from './Slice/newQuizSlice'

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        userCompetitive: userCompetitiveSlice,
        user: userSlice,
        newQuiz: newQuizSlice,
    },
})