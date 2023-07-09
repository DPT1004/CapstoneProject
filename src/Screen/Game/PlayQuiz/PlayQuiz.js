import React from 'react'
import {
    View,
    StatusBar,
    LayoutAnimation,
} from 'react-native'
import { COLORS } from '../../../common/theme'
import { useSelector } from 'react-redux'
import AnswerCheckBox from '../../Answer/AnswerCheckBox/AnswerCheckBox'
import AnswerMultiChoice from '../../Answer/AnswerMultiChoice/AnswerMultiChoice'
import AnswerFillInTheBlank from '../../Answer/AnswerFillInTheBlank/AnswerFillInTheBlank'
import AnswerDragAndSort from '../../Answer/AnswerDragAndSort/AnswerDragAndSort'
import PreviewAndLeaderBoard from '../PreviewAndLeaderBoard/PreviewAndLeaderBoard'
import HostScreen from '../HostScreen/HostScreen'

const PlayQuiz = () => {

    const userCompetitive = useSelector((state) => state.userCompetitive)
    const user = useSelector((state) => state.user)
    const game = useSelector((state) => state.game)
    const quiz = useSelector((state) => state.newQuiz)
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const [questions, setQuestions] = React.useState(quiz.questionList)


    const renderQuestion = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: "linear", property: "opacity" },
            update: { type: 'linear', property: 'opacity' },
            delete: { type: 'linear', property: 'opacity' },
        })

        if (userCompetitive.isHostJoinGame == false && user.userId == game.hostId) {
            <HostScreen />
        }
        else if (userCompetitive.isShowLeaderBoard) {
            return (
                <PreviewAndLeaderBoard />
            )
        }
        else if (questions[currentIndexQuestion].questionType === "MultipleChoice") {
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
        else if (questions[currentIndexQuestion].questionType === "Fill-In-The-Blank") {
            return (
                <AnswerFillInTheBlank
                    question={questions[currentIndexQuestion]}
                />
            )
        }
        else if (questions[currentIndexQuestion].questionType === "DragAndSort") {
            return (
                <AnswerDragAndSort
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
        </View>
    );
};

export default PlayQuiz;
