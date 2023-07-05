import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: "",
    name: "",
    description: "",
    backgroundImage: "",
    creatorId: "",
    questionList: [],
    numberOfQuestions: 0,
    isPublic: false,
    categories: [],
    dateCreated: "",
    numberOfQuestionsOrigin: 0
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
            state.numberOfQuestions = actions.payload.numberOfQuestions
            state.categories = actions.payload.categories
            state.questionList = actions.payload.questionList
            state.numberOfQuestionsOrigin = actions.payload.numberOfQuestions
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
            state.numberOfQuestionsOrigin = actions.payload.numberOfQuestions
        },
        addNewQuestion: (state, actions) => {
            state.questionList.unshift(actions.payload)
            state.numberOfQuestions += 1
            state.numberOfQuestionsOrigin += 1
        },
        addNewQuestionInLastArray: (state, actions) => {
            state.questionList.push(actions.payload)
            state.numberOfQuestions += 1
            state.numberOfQuestionsOrigin += 1
        },
        addManyNewQuestion: (state, actions) => {
            state.questionList = [...actions.payload, ...state.questionList]
            state.numberOfQuestions += actions.payload.length
            state.numberOfQuestionsOrigin += actions.payload.length
        },
        addManyNewQuestionInLastArray: (state, actions) => {
            state.questionList = [...state.questionList, ...actions.payload]
            state.numberOfQuestions += actions.payload.length
            state.numberOfQuestionsOrigin += actions.payload.length
        },
        updateTitle: (state, actions) => {
            state.name = actions.payload
        },
        updateDesc: (state, actions) => {
            state.description = actions.payload
        },
        updateDisplay: (state, actions) => {
            state.isPublic = actions.payload
        },
        updateQuestionList: (state, actions) => {
            state.questionList = actions.payload
        },
        updateNumberOfQuestionsOrigin: (state, actions) => {
            state.numberOfQuestionsOrigin += actions.payload
        },
        deleteQuestionByIndex: (state, actions) => {
            state.questionList.splice(actions.payload, 1)
            state.numberOfQuestions -= 1
            state.numberOfQuestionsOrigin += 1
        },
        updateBackgroundImage: (state, actions) => {
            state.backgroundImage = actions.payload
        },
        clearQuizInfo: (state) => {
            state.id = ""
            state.name = ""
            state.description = ""
            state.backgroundImage = ""
            state.creatorId = ""
            state.numberOfQuestions = 2
            state.isPublic = false
            state.categories = []
            state.dateCreated = ""
            state.questionList = []
        }
    },
})

// Action creators are generated for each case reducer function
export const { addNewQuiz, updateQuiz, updateBackgroundImage, updateTitle, updateDesc, updateDisplay, addNewQuestion, addNewQuestionInLastArray, addManyNewQuestion, addManyNewQuestionInLastArray, updateQuestionList, deleteQuestionByIndex, clearQuizInfo, updateNumberOfQuestionsOrigin } = newQuizSlice.actions

export default newQuizSlice.reducer