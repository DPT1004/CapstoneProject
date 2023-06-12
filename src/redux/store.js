import { configureStore } from '@reduxjs/toolkit'
import userCompetitiveSlice from './Slice/userCompetitiveSlice'
import userSlice from './Slice/userSlice'
import newQuizSlice from './Slice/newQuizSlice'
import whenToFetchApiSlice from './Slice/whenToFetchApiSlice'
import gameSlice from './Slice/gameSlice'
import listQuizSlice from './Slice/listQuizSlice'
import internetSlice from './Slice/internetSlice'

export const store = configureStore({
    reducer: {
        userCompetitive: userCompetitiveSlice,
        user: userSlice,
        newQuiz: newQuizSlice,
        whenToFetchApi: whenToFetchApiSlice,
        game: gameSlice,
        listQuiz: listQuizSlice,
        internet: internetSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})