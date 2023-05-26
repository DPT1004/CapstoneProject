import React from 'react'
import {
    View,
    StatusBar,
    LayoutAnimation,
} from 'react-native'
import { COLORS } from '../../../common/theme'
import { useSelector, useDispatch } from 'react-redux'
import { clearInfoCompetitive } from '../../../redux/Slice/userCompetitiveSlice'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../../navigator/screens-name'
import ResultModal from './components/ResultModal'
import AnswerCheckBox from '../../Answer/AnswerCheckBox/AnswerCheckBox'
import AnswerMultiChoice from '../../Answer/AnswerMultiChoice/AnswerMultiChoice'
import PreviewAndLeaderBoard from '../PreviewAndLeaderBoard/PreviewAndLeaderBoard'

const PlayQuiz = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const quiz = useSelector((state) => state.newQuiz)
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const [questions, setQuestions] = React.useState(quiz.questionList)
    const [isResultModalVisible, setIsResultModalVisible] = React.useState(false)

    const renderQuestion = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: "linear", property: "opacity" },
            update: { type: 'linear', property: 'opacity' },
            delete: { type: 'linear', property: 'opacity' },
        })

        if (userCompetitive.isShowLeaderBoard) {
            return (
                <PreviewAndLeaderBoard />
            )
        }
        // else if (currentIndexQuestion >= quiz.numberOfQuestions) {
        //     return (<View style={{ flex: 1 }}>
        //         <Text>All done</Text>
        //         <FormButton
        //             labelText="Submit"
        //             style={{ margin: 10 }}
        //             handleOnPress={() => {
        //                 // Show Result modal
        //                 setIsResultModalVisible(true);
        //             }}
        //         />
        //     </View>)
        // }    
        if (questions[currentIndexQuestion].questionType === "MultipleChoice") {
            return (
                <AnswerMultiChoice
                    question={questions[currentIndexQuestion]}
                />
            )
        }
        else if (questions[currentIndexQuestion].questionType === "CheckBox") {
            return (
                <AnswerCheckBox
                    question={questions[currentIndexQuestion]}
                />
            )
        }
    }

    return (
        <View style={{ flex: 1 }}>
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
                    dispatch(clearInfoCompetitive())
                    navigation.goBack()
                    setIsResultModalVisible(false)
                }}
                handleHome={() => {
                    dispatch(clearInfoCompetitive())
                    navigation.navigate(screenName.ManageQuiz);
                    setIsResultModalVisible(false)
                }}
            />
        </View>
    );
};

export default PlayQuiz;
