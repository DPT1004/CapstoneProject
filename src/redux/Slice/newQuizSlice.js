import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "",
    description: "",
    backgroundImage: "",
    isPublic: false,
    categories: [],
    questionList: []
}

export const newQuizSlice = createSlice({
    name: 'newQuiz',
    initialState,
    reducers: {
        addNewQuiz: (state, actions) => {
            state.name = actions.payload.name
            state.description = actions.payload.description
            state.backgroundImage = actions.payload.backgroundImage
            state.isPublic = actions.payload.isPublic
            state.categories = actions.payload.categories
            state.questionList = actions.payload.questionList
        },
        addNewQuestion: (state, actions) => {
            state.questionList.push(actions.payload)
        },
        updateQuestionList: (state, actions) => {
            state.questionList = actions.payload
        },
        deleteQuestionByIndex: (state, actions) => {
            state.questionList.splice(actions.payload, 1)
        },
    },
})

// Action creators are generated for each case reducer function
export const { addNewQuiz, addNewQuestion, updateQuestionList, deleteQuestionByIndex } = newQuizSlice.actions

export default newQuizSlice.reducer