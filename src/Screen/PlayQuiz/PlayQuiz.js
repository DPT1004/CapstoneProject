import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Button,
    LayoutAnimation
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { getQuestionsByQuizId, getQuizById } from '../../utils/database';
import { useNavigation } from "@react-navigation/native"
import { useRoute } from '@react-navigation/native'
import { screenName } from '../../navigator/screens-name'
import FormButton from '../../components/FormButton';
import ResultModal from '../../components/playQuizScreen/ResultModal';
import arrQuestions from '../../questions.json'
import AnswerCheckBox from '../Answer/AnswerCheckBox/AnswerCheckBox'
import AnswerMultiChoice from '../Answer/AnswerMultiChoice/AnswerMultiChoice'
import { useSelector, useDispatch } from 'react-redux'
import { clearInfoCompetitive } from '../../redux/Slice/userCompetitiveSlice'

const PlayQuiz = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute();
    const [currentQuizId, setCurrentQuizId] = useState(route.params.quizId);
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState(arrQuestions);
    const [currentIndexQuestion, setCurrentIndexQuestion] = useState(0)
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);

    const handleNextQuestion = (nextQuest) => {
        setCurrentIndexQuestion(nextQuest)
    }

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate random number
            let j = Math.floor(Math.random() * (i + 1));

            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    const getQuizAndQuestionDetails = async () => {
        // Get Quiz
        let currentQuiz = await getQuizById(currentQuizId);
        currentQuiz = currentQuiz.data();
        setTitle(currentQuiz.title);

        // Get Questions for current quiz
        const questions = await getQuestionsByQuizId(currentQuizId);

        // Transform and shuffle options
        let tempQuestions = [];
        questions.docs.forEach(async res => {
            let question = res.data();

            // Create Single array of all options and shuffle it
            question.allOptions = shuffleArray([
                ...question.incorrect_answers,
                question.correct_answer,
            ]);
            tempQuestions.push(question);
        });

        setQuestions([...tempQuestions]);
    };

    // useEffect(() => {
    //     getQuizAndQuestionDetails();
    // }, []);

    const renderQuestion = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: "easeIn", property: "scaleXY" },
            update: { type: 'easeIn', property: 'scaleXY' },
            delete: { type: 'easeIn', property: 'scaleXY' },
        })
        return (
            currentIndexQuestion === arrQuestions.questions.length ?
                <View style={{ flex: 1 }}>
                    <Text>All done</Text>
                    <FormButton
                        labelText="Submit"
                        style={{ margin: 10 }}
                        handleOnPress={() => {
                            // Show Result modal
                            setIsResultModalVisible(true);
                        }}
                    />
                </View>
                :
                arrQuestions.questions[currentIndexQuestion].typeQuestion === 1 ?
                    <AnswerMultiChoice
                        quest={arrQuestions.questions[currentIndexQuestion]}
                        indexQuestion={currentIndexQuestion}
                        handleNextQuestion={handleNextQuestion}
                    />
                    :
                    arrQuestions.questions[currentIndexQuestion].typeQuestion === 2 ?
                        <AnswerCheckBox
                            quest={arrQuestions.questions[currentIndexQuestion]}
                            indexQuestion={currentIndexQuestion}
                            handleNextQuestion={handleNextQuestion}
                        />
                        :
                        <></>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1
            }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            {/*Show question*/}
            {
                renderQuestion()
            }
            {/* Result Modal */}
            <ResultModal
                isModalVisible={isResultModalVisible}
                correctCount={userCompetitive.correctCount}
                incorrectCount={userCompetitive.incorrectCount}
                totalCount={questions.length}
                handleOnClose={() => {
                    setIsResultModalVisible(false);
                }}
                handleRetry={() => {
                    getQuizAndQuestionDetails();
                    setIsResultModalVisible(false);
                }}
                handleHome={() => {
                    dispatch(clearInfoCompetitive())
                    navigation.goBack();
                    setIsResultModalVisible(false);
                }}
            />
        </SafeAreaView>
    );
};

export default PlayQuiz;
