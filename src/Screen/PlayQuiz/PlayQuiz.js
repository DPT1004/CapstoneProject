import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StatusBar,
    LayoutAnimation
} from 'react-native';
import { COLORS } from '../../common/theme';
import { useNavigation, useRoute } from "@react-navigation/native"
import { screenName } from '../../navigator/screens-name'
import FormButton from '../../components/FormButton';
import ResultModal from './components/ResultModal';
import AnswerCheckBox from '../Answer/AnswerCheckBox/AnswerCheckBox'
import AnswerMultiChoice from '../Answer/AnswerMultiChoice/AnswerMultiChoice'
import { useSelector, useDispatch } from 'react-redux'
import { clearInfoCompetitive } from '../../redux/Slice/userCompetitiveSlice'

const PlayQuiz = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute()

    const userCompetitive = useSelector((state) => state.userCompetitive)
    const [questions, setQuestions] = useState(route.params?.questionList)
    const [currentIndexQuestion, setCurrentIndexQuestion] = useState(0)
    const [isResultModalVisible, setIsResultModalVisible] = useState(false)

    const handleNextQuestion = (nextQuest) => {
        setCurrentIndexQuestion(nextQuest)
    }

    const renderQuestion = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: "easeIn", property: "scaleXY" },
            update: { type: 'easeIn', property: 'scaleXY' },
            delete: { type: 'easeIn', property: 'scaleXY' },
        })
        return (
            currentIndexQuestion === questions.length ?
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
                questions[currentIndexQuestion].questionType === "MultipleChoice" ?
                    <AnswerMultiChoice
                        quest={questions[currentIndexQuestion]}
                        indexQuestion={currentIndexQuestion}
                        handleNextQuestion={() => handleNextQuestion()}
                    />
                    :
                    questions[currentIndexQuestion].questionType === "CheckBox" ?
                        <AnswerCheckBox
                            quest={questions[currentIndexQuestion]}
                            indexQuestion={currentIndexQuestion}
                            handleNextQuestion={() => handleNextQuestion()}
                        />
                        :
                        <></>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            {/*Show question*/}
            {
                renderQuestion()
            }
            {/* Result Modal */}
            <FormButton
                labelText="Go back"
                style={{ margin: 10 }}
                handleOnPress={() => {
                    navigation.navigate(screenName.ManageQuiz)
                }}
            />
            <ResultModal
                isModalVisible={isResultModalVisible}
                correctCount={userCompetitive.correctCount}
                incorrectCount={userCompetitive.incorrectCount}
                totalCount={questions.length}
                handleOnClose={() => {
                    setIsResultModalVisible(false);
                }}
                handleRetry={() => {
                    setIsResultModalVisible(false);
                }}
                handleHome={() => {
                    dispatch(clearInfoCompetitive())
                    navigation.goBack();
                    setIsResultModalVisible(false);
                }}
            />
        </View>
    );
};

export default PlayQuiz;
