import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Button,
    StyleSheet,
    Animated
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { useNavigation } from "@react-navigation/native"
import { useRoute } from '@react-navigation/native'
import { screenName } from '../../navigator/screens-name'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FormButton from '../../components/FormButton';
import ResultModal from '../../components/playQuizScreen/ResultModal';
import arrQuestions from '../../questions.json'
import AnswerCheckBox from '../Answer/AnswerCheckBox/AnswerCheckBox'
import AnswerMultiChoice from '../Answer/AnswerMultiChoice/AnswerMultiChoice'
import CustomViewScore from '../../components/playQuizScreen/CustomViewScore'

const Test2 = () => {

    const navigation = useNavigation()
    const route = useRoute();
    const [currentQuizId, setCurrentQuizId] = useState("Quiz Test");
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState(arrQuestions);
    const [currentIndexQuestion, setCurrentIndexQuestion] = useState(1)

    const handleNextQuestion = (nextQuest) => {
        setCurrentIndexQuestion(nextQuest)
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            {
                currentIndexQuestion === arrQuestions.questions.length ? navigation.navigate(screenName.SignIn) :
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
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

})

export default Test2;
