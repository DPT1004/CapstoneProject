import React from 'react'
import {
    View,
    Text,
    StatusBar,
    LayoutAnimation,
    Button
} from 'react-native';
import { COLORS } from '../../common/theme'
import { useSelector, useDispatch } from 'react-redux'
import { clearInfoCompetitive } from '../../redux/Slice/userCompetitiveSlice'
import { useNavigation, useRoute } from "@react-navigation/native"
import FormButton from '../../components/FormButton'
import ResultModal from './components/ResultModal'
import AnswerCheckBox from '../Answer/AnswerCheckBox/AnswerCheckBox'
import AnswerMultiChoice from '../Answer/AnswerMultiChoice/AnswerMultiChoice'
import { screenName } from '../../navigator/screens-name';


const PlayQuiz = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute()
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const [questions, setQuestions] = React.useState(route.params.questionList)
    const [isResultModalVisible, setIsResultModalVisible] = React.useState(false)

    console.log("currentIndexQuestion: ", currentIndexQuestion)
    const renderQuestion = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: "linear", property: "opacity" },
            update: { type: 'linear', property: 'opacity' },
            delete: { type: 'linear', property: 'opacity' },
        })

        if (currentIndexQuestion >= questions.length) {
            return (<View style={{ flex: 1 }}>
                <Text>All done</Text>
                <FormButton
                    labelText="Submit"
                    style={{ margin: 10 }}
                    handleOnPress={() => {
                        // Show Result modal
                        setIsResultModalVisible(true);
                    }}
                />
            </View>)
        } else if (questions[currentIndexQuestion].questionType === "MultipleChoice") {
            return (
                <AnswerMultiChoice
                    question={questions[currentIndexQuestion]}
                />
            )
        } else if (questions[currentIndexQuestion].questionType === "CheckBox") {
            return (
                <AnswerCheckBox
                    quest={questions[currentIndexQuestion]}
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
