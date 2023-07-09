import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native'
import { COLORS, SIZES } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { nextQuestion, showLeaderBoard } from '../../../redux/Slice/userCompetitiveSlice'
import { timeWaitToPreviewAndLeaderBoard } from '../../../common/shareVarible'
import { WebView } from 'react-native-webview'
import DuoDragDrop, { Lines } from "@jamsch/react-native-duo-drag-drop"
import TopBar from '../../Game/PlayQuiz/components/TopBar'
import CustomViewScore from '../../Game/PlayQuiz/components/CustomViewScore'
import YoutubePlayer from "react-native-youtube-iframe"
import socketServcies from '../../../until/socketServices'

const AnswerDragAndSort = ({ question }) => {

    const dispatch = useDispatch()
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const game = useSelector((state) => state.game)
    const user = useSelector((state) => state.user)
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const [activeSubmit, setActiveSubmit] = React.useState(false)
    const [time, setTime] = React.useState(question.time)
    const [isOutOfTime, setIsOutOfTime] = React.useState(false)
    const arrAnswer = React.useMemo(() => {
        var arrAnswer = []
        question.answerList.forEach(answer => {
            arrAnswer.push(answer.answer)
        })
        return arrAnswer
    }, [question])
    const arrCorrectAnswer = React.useMemo(() => {
        var arrCorrect = []
        var arrAnswer = [...question.answerList]
        arrAnswer.sort((a, b) => a.order - b.order)
            .forEach(answer => {
                if (answer.isCorrect) {
                    arrCorrect.push(answer.answer)
                }
            })
        return arrCorrect
    }, [question])
    const score = React.useRef()
    const timeUserAnswer = React.useRef(time)
    const refDuo = React.useRef()

    const isUserAnswerCorrect = () => {
        var answered = refDuo.current?.getAnsweredWords()
        if (answered.length == 0) {
            return false
        } else if (String(answered) == String(arrCorrectAnswer)) {
            return true
        }
        return false
    }

    const calculateScore = () => {
        var scoreRecieve = 600
        if (userCompetitive.isActiveTimeCounter == false) {
            scoreRecieve = isUserAnswerCorrect() ? 600 : 0
            score.current = scoreRecieve
        } else {
            scoreRecieve = isUserAnswerCorrect() ? score.current : 0
        }
        return scoreRecieve
    }

    const handleAfterDone = () => {

        var scoreRecieve = calculateScore()
        var userAnswer = refDuo.current?.getAnsweredWords()

        setTimeout(() => {
            dispatch(showLeaderBoard(true))

            var userId = user.userId
            var pin = game.pin
            var playerResult = {
                question: question,
                score: scoreRecieve,
                arrPlayerAnswer: userAnswer,
                timeAnswer: timeUserAnswer.current
            }

            if (socketServcies.socket.connected) {
                socketServcies.emit("player-send-score-and-currentIndexQuestion", { userId, pin, scoreRecieve, currentIndexQuestion, playerResult })
            }

            dispatch(nextQuestion())
        }, timeWaitToPreviewAndLeaderBoard)

    }

    const handleComplete = () => {
        setActiveSubmit(true)
        setIsOutOfTime(true)
        handleAfterDone()
    }

    const handleUpdate = (currentTime) => {
        var timeUserResponed = time - currentTime
        timeUserAnswer.current = timeUserResponed
        var takenScore = 1 - (timeUserResponed / time) / 2
        score.current = Number(takenScore).toFixed(3) * 1000
    }

    React.useEffect(() => {
        if (activeSubmit === true && isOutOfTime == false) {
            handleAfterDone()
        }
    }, [activeSubmit])


    return (
        <>
            <TouchableWithoutFeedback
                onPress={() => { Keyboard.dismiss() }}
                accessible={false}>
                <View style={styles.container}>
                    <TopBar
                        activeSubmit={activeSubmit}
                        time={time}
                        handleComplete={handleComplete}
                        handleUpdate={(currentTime) => handleUpdate(currentTime)}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50, paddingTop: 5 }}>
                        {/* Container Question */}
                        <View style={styles.containerQuestion}>
                            <Text style={styles.txtQuestion}>{question.question}</Text>
                            {
                                question.backgroundImage != '' &&
                                <Image
                                    source={{ uri: question.backgroundImage }}
                                    resizeMode={"stretch"}
                                    style={styles.imgQuestion}
                                />
                            }
                            {
                                question.video != "" &&
                                <View style={styles.video}>
                                    <WebView
                                        allowsFullscreenVideo={true}
                                        source={{ uri: question.video }} />
                                </View>
                            }
                            {
                                question.youtube != "" &&
                                <View style={styles.videoYoutube} pointerEvents='none'>
                                    <YoutubePlayer
                                        height={"100%"}
                                        width={"100%"}
                                        initialPlayerParams={{ start: question.startTime, end: question.endTime, controls: false, iv_load_policy: 3 }}
                                        play={true}
                                        allowWebViewZoom={true}
                                        videoId={question.youtube}
                                    />
                                </View>
                            }
                        </View>

                        {/* Render answer/option */}
                        <View style={styles.containerOptionOnlyText} onStartShouldSetResponder={() => true}>
                            <DuoDragDrop
                                ref={refDuo}
                                gesturesDisabled={activeSubmit}
                                renderLines={(props) => (
                                    <Lines {...props} containerStyle={{ backgroundColor: "transparent" }} lineStyle={{ borderColor: "#CCC" }} />
                                )}
                                words={arrAnswer} />
                        </View>
                    </ScrollView>

                    {/**Button submit */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={activeSubmit}
                        onPress={() => {
                            setActiveSubmit(true)
                        }}
                        style={[styles.btnSubmit, { backgroundColor: activeSubmit ? COLORS.gray : COLORS.primary }]} >
                        <Text style={styles.txtSubmitOrClearAnswer}>Submit</Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
            {
                activeSubmit ? <CustomViewScore score={score.current} isCorrect={isUserAnswerCorrect()} /> : <></>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: COLORS.white
    },
    containerQuestion: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    containerOptionOnlyText: {
        flex: 1.5,
        paddingTop: 10,
    },
    video: {
        width: SIZES.windowWidth,
        height: 230,
        alignSelf: "center",
        marginBottom: 5
    },
    videoYoutube: {
        width: SIZES.windowWidth * 0.9,
        height: 200,
        alignSelf: "center",
        marginBottom: 5
    },
    imgQuestion: {
        height: 200,
        width: "80%",
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 5,
    },
    btnSubmit: {
        position: "absolute",
        bottom: 5,
        right: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        width: SIZES.windowWidth * 0.4,
        alignItems: "center",
        justifyContent: "center",
    },
    txtQuestion: {
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.black,
    },
    txtSubmitOrClearAnswer: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold"
    },
})

export default AnswerDragAndSort