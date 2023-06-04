import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Slice/counterSlice'
import userCompetitiveSlice from './Slice/userCompetitiveSlice'
import userSlice from './Slice/userSlice'
import newQuizSlice from './Slice/newQuizSlice'
import whenToFetchApiSlice from './Slice/whenToFetchApiSlice'
import gameSlice from './Slice/gameSlice'
import listQuizSlice from './Slice/listQuizSlice'

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        userCompetitive: userCompetitiveSlice,
        user: userSlice,
        newQuiz: newQuizSlice,
        whenToFetchApi: whenToFetchApiSlice,
        game: gameSlice,
        listQuiz: listQuizSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})