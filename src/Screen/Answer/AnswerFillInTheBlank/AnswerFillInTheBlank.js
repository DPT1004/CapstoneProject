import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native'
import { COLORS, SIZES } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { nextQuestion, showLeaderBoard } from '../../../redux/Slice/userCompetitiveSlice'
import { timeWaitToPreviewAndLeaderBoard } from '../../../common/shareVarible'
import { WebView } from 'react-native-webview'
import TopBar from '../../Game/PlayQuiz/components/TopBar'
import CustomViewScore from '../../Game/PlayQuiz/components/CustomViewScore'
import YoutubePlayer from "react-native-youtube-iframe"
import socketServcies from '../../../until/socketServices'

const AnswerFillInTheBlank = ({ question }) => {

    const dispatch = useDispatch()
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const game = useSelector((state) => state.game)
    const user = useSelector((state) => state.user)
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const [userAnswer, setUserAnswer] = React.useState("")
    const [activeSubmit, setActiveSubmit] = React.useState(false)
    const [time, setTime] = React.useState(question.time)
    const [isOutOfTime, setIsOutOfTime] = React.useState(false)
    const refUserAnswer = React.useRef("")
    const score = React.useRef()
    const timeUserAnswer = React.useRef(time)

    const isUserAnswerCorrect = () => {
        if (userAnswer == "") {
            return false
        }
        else if (question.answerList.some(answer => answer.answer == refUserAnswer.current.trim())) {
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

        setTimeout(() => {
            dispatch(showLeaderBoard(true))

            var userId = user.userId
            var pin = game.pin
            var playerResult = {
                question: question,
                score: scoreRecieve,
                playerAnswer: refUserAnswer.current,
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
        setUserAnswer("")
        setIsOutOfTime(true)
        refUserAnswer.current = ""
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

    const renderOption = () => {
        return (
            < View style={styles.containerOptionOnlyText}>
                <TextInput
                    placeholder='Type answer here'
                    style={{ width: "100%", fontSize: 16, borderWidth: 1.5, borderColor: COLORS.gray, borderRadius: 5 }}
                    multiline={true}
                    editable={!activeSubmit}
                    onChangeText={(txt) => {
                        setUserAnswer(txt)
                        refUserAnswer.current = txt
                    }}
                    value={userAnswer}
                />
            </View>
        )
    }

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
                            <View style={{ flex: 1, width: "100%", marginBottom: 5 }}>
                                <WebView
                                    allowsFullscreenVideo={true}
                                    source={{ uri: question.video }} />
                            </View>
                        }
                        {
                            question.youtube != "" &&
                            <View style={{ flex: 1, aspectRatio: 16 / 9, marginBottom: 5 }} pointerEvents='none'>
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
                    {
                        renderOption()
                    }
                    <View style={styles.containerBtn}>
                        {/**Button clear answer */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={activeSubmit}
                            onPress={() => {
                                setUserAnswer("")
                                refUserAnswer.current = ""
                            }}
                            style={styles.btnSubmitOrClearAnswer}>
                            <Text style={styles.txtSubmitOrClearAnswer}>Clear Answer</Text>
                        </TouchableOpacity>

                        {/**Button submit */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={activeSubmit}
                            onPress={() => {
                                calculateScore()
                                setActiveSubmit(true)
                            }}
                            style={styles.btnSubmitOrClearAnswer} >
                            <Text style={styles.txtSubmitOrClearAnswer}>Submit</Text>
                        </TouchableOpacity>
                    </View>

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
        paddingTop: 3
    },
    containerOptionOnlyText: {
        flex: 1.5,
        paddingTop: 10
    },
    containerBtn: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5
    },
    imgQuestion: {
        flex: 1,
        height: "100%",
        width: "75%",
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 5,
    },
    btnSubmitOrClearAnswer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        width: SIZES.windowWidth * 0.4,
        alignItems: "center",
        justifyContent: "center"
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

export default AnswerFillInTheBlank