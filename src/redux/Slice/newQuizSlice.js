import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: "",
    name: "",
    description: "",
    backgroundImage: "",
    creatorId: "",
    numberOfQuestions: "",
    isPublic: false,
    categories: [],
    dateCreated: "",
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
        updateQuiz: (state, actions) => {
            state.id = actions.payload._id
            state.name = actions.payload.name
            state.description = actions.payload.description
            state.backgroundImage = actions.payload.backgroundImage
            state.creatorId = actions.payload.creatorId
            state.numberOfQuestions = actions.payload.numberOfQuestions
            state.isPublic = actions.payload.isPublic
            state.categories = actions.payload.categories
            state.dateCreated = actions.payload.dateCreated
            state.questionList = actions.payload.questionList
        },
        addNewQuestion: (state, actions) => {
            state.questionList.unshift(actions.payload)
        },
        updateQuestionList: (state, actions) => {
            state.questionList = actions.payload
        },
        deleteQuestionByIndex: (state, actions) => {
            state.questionList.splice(actions.payload, 1)
        },
        updateBackgroundImage: (state, actions) => {
            state.backgroundImage = actions.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addNewQuiz, updateQuiz, updateBackgroundImage, addNewQuestion, updateQuestionList, deleteQuestionByIndex } = newQuizSlice.actions

export default newQuizSlice.reducer