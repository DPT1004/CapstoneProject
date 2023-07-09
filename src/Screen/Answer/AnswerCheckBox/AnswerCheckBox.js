import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import { COLORS, SIZES } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { nextQuestion, showLeaderBoard } from '../../../redux/Slice/userCompetitiveSlice'
import { timeWaitToPreviewAndLeaderBoard } from '../../../common/shareVarible'
import { WebView } from 'react-native-webview'
import TopBar from '../../Game/PlayQuiz/components/TopBar'
import CustomViewScore from '../../Game/PlayQuiz/components/CustomViewScore'
import Icon from "react-native-vector-icons/FontAwesome"
import YoutubePlayer from "react-native-youtube-iframe"
import socketServcies from '../../../until/socketServices'

const AnswerCheckBox = ({ question }) => {

    const dispatch = useDispatch()
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const game = useSelector((state) => state.game)
    const user = useSelector((state) => state.user)
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const [userAnswer, setUserAnswer] = React.useState([])
    const arrCorrectAnswer = React.useMemo(() => {
        var arrCorrect = []
        question.answerList.forEach(answer => {
            if (answer.isCorrect) {
                arrCorrect.push(answer)
            }
        })
        return arrCorrect
    }, [question])
    const [activeSubmit, setActiveSubmit] = React.useState(false)
    const [time, setTime] = React.useState(question.time)
    const [sizeContainerOption, setSizeContainerOption] = React.useState({
        width: 0,
        height: 0
    })
    const refUserAnswer = React.useRef([])
    const indexUserAnswer = React.useRef([])
    const score = React.useRef()
    const timeUserAnswer = React.useRef(time)

    const isUserAnswerCorrect = (array1, array2) => {
        if (array1.length === array2.length) {
            return array1.every(element => {
                if (array2.includes(element)) {
                    return true
                }

                return false
            });
        }
        return false
    }

    const calculateScore = () => {
        var scoreRecieve = 600
        if (userCompetitive.isActiveTimeCounter == false) {
            scoreRecieve = isUserAnswerCorrect(refUserAnswer.current, arrCorrectAnswer) ? 600 : 0
            score.current = scoreRecieve
        } else {
            scoreRecieve = isUserAnswerCorrect(refUserAnswer.current, arrCorrectAnswer) ? score.current : 0
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
                indexPlayerAnswer: indexUserAnswer.current,
                score: scoreRecieve,
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
        setUserAnswer([{
            isCorrect: false
        }])
        refUserAnswer.current = [{
            isCorrect: false
        }]
        indexUserAnswer.current = []
        handleAfterDone()
    }

    const handleUpdate = (currentTime) => {
        var timeUserResponed = time - currentTime
        timeUserAnswer.current = timeUserResponed
        var takenScore = 1 - (timeUserResponed / time) / 2
        score.current = Number(takenScore).toFixed(3) * 1000
    }

    const getOptionBgColor = (option, indexOption) => {
        if (activeSubmit) {
            if (option.isCorrect) {
                return COLORS.success
            } else {
                return COLORS.error
            }
        }
        else {
            switch (indexOption) {
                case 0:
                    return COLORS.answerA
                case 1:
                    return COLORS.answerB
                case 2:
                    return COLORS.answerC
                case 3:
                    return COLORS.answerD
            }
        }
    }

    React.useEffect(() => {
        if (activeSubmit === true && JSON.stringify(userAnswer[0]) !== JSON.stringify({ isCorrect: false })) {
            handleAfterDone()
        }
    }, [activeSubmit])

    const renderOption = () => {
        if (question.answerList.some(answer => answer.img !== "")) {
            return (
                <View style={styles.containerOptionImage}
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout
                        setSizeContainerOption({
                            width: width,
                            height: height
                        })
                    }}>
                    {
                        question.answerList.map((option, indexOption) => (
                            <View
                                key={indexOption}
                                style={[styles.btnOptionImage, {
                                    backgroundColor: getOptionBgColor(option, indexOption),
                                    width: (sizeContainerOption.width - 16) / 2,
                                    height: (sizeContainerOption.height - 16) / 2,
                                }]}
                            >
                                {
                                    option.img !== "" ?
                                        <Image
                                            style={styles.imgAnswer}
                                            resizeMode="stretch"
                                            source={{ uri: option.img }}
                                        />
                                        :
                                        <ScrollView>
                                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                <Text style={styles.txtOption}>{option.answer}</Text>
                                            </View>
                                        </ScrollView>
                                }
                                <TouchableOpacity
                                    style={styles.btnChoose}
                                    activeOpacity={1}
                                    disabled={activeSubmit}
                                    onPress={() => {
                                        var newUserAnswer = [...userAnswer]
                                        if (!newUserAnswer.includes(option)) {
                                            newUserAnswer.push(option);
                                        } else {
                                            newUserAnswer.splice(newUserAnswer.indexOf(option), 1);
                                        }
                                        setUserAnswer(newUserAnswer)
                                        refUserAnswer.current = newUserAnswer


                                        var newIndexUserAnswer = [...indexUserAnswer.current]
                                        if (!newIndexUserAnswer.includes(indexOption)) {
                                            newIndexUserAnswer.push(indexOption)
                                        } else {
                                            newIndexUserAnswer.splice(newIndexUserAnswer.indexOf(indexOption), 1);
                                        }
                                        indexUserAnswer.current = newIndexUserAnswer
                                    }}>
                                    <View style={styles.areaChooseOption}>
                                        {
                                            userAnswer.includes(option) &&
                                            <Icon
                                                name={"check"}
                                                size={12}
                                                color={COLORS.black} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </View>
            )
        } else {
            return (
                <View style={styles.containerOptionOnlyText}>
                    {
                        question.answerList.map((option, indexOption) => (
                            <View
                                key={indexOption}
                                style={[styles.btnOptionOnlyText, {
                                    backgroundColor: getOptionBgColor(option, indexOption),
                                }]}
                            >
                                <ScrollView>
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Text style={styles.txtOption}>{option.answer}</Text>
                                    </View>
                                </ScrollView>

                                <TouchableOpacity
                                    style={styles.btnChoose}
                                    activeOpacity={1}
                                    disabled={activeSubmit}
                                    onPress={() => {
                                        var newUserAnswer = [...userAnswer]
                                        if (!newUserAnswer.includes(option)) {
                                            newUserAnswer.push(option);
                                        } else {
                                            newUserAnswer.splice(newUserAnswer.indexOf(option), 1);
                                        }
                                        setUserAnswer(newUserAnswer)
                                        refUserAnswer.current = newUserAnswer

                                        var newIndexUserAnswer = [...indexUserAnswer.current]
                                        if (!newIndexUserAnswer.includes(indexOption)) {
                                            newIndexUserAnswer.push(indexOption)
                                        } else {
                                            newIndexUserAnswer.splice(newIndexUserAnswer.indexOf(indexOption), 1);
                                        }
                                        indexUserAnswer.current = newIndexUserAnswer
                                    }}>
                                    <View style={styles.areaChooseOption}>
                                        {
                                            userAnswer.includes(option) &&
                                            <Icon
                                                name={"check"}
                                                size={12}
                                                color={COLORS.black} />
                                        }
                                    </View>
                                </TouchableOpacity>

                            </View>
                        ))
                    }
                </View>
            )
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TopBar
                    activeSubmit={activeSubmit}
                    time={time}
                    handleComplete={handleComplete}
                    handleUpdate={(currentTime) => handleUpdate(currentTime)}
                />
                {/* Container Question */}
                <View style={styles.containerQuestion}>
                    <ScrollView>
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
                                    initialPlayerParams={{ start: question.startTime, end: question.endTime, iv_load_policy: 3, controls: false }}
                                    play={true}
                                    allowWebViewZoom={true}
                                    videoId={question.youtube}
                                />
                            </View>
                        }
                    </ScrollView>
                </View>
                {/* Render answer/option */}
                {
                    renderOption()
                }
                <TouchableOpacity
                    disabled={activeSubmit}
                    onPress={() => {
                        calculateScore()
                        setActiveSubmit(true)
                    }}
                    style={styles.btnSubmit} >
                    <Text style={styles.txtSubmit}>Submit</Text>
                </TouchableOpacity>
            </View>
            {
                activeSubmit ? <CustomViewScore score={score.current} isCorrect={isUserAnswerCorrect(refUserAnswer.current, arrCorrectAnswer)} /> : <></>
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
        paddingVertical: 3
    },
    containerOptionOnlyText: {
        flex: 1.5,
    },
    containerOptionImage: {
        flex: 1.5,
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "space-between",
    },
    areaChooseOption: {
        backgroundColor: COLORS.white,
        height: 13,
        width: 13,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    btnChoose: {
        position: "absolute",
        bottom: -13,
        right: -13,
        padding: 15,
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
        width: SIZES.windowWidth * 0.8,
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 5,
    },
    imgAnswer: {
        height: "100%",
        width: "100%",
        borderRadius: 5
    },
    btnOptionOnlyText: {
        flex: 1,
        padding: 15,
        borderRadius: 5,
        marginBottom: 5,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnOptionImage: {
        padding: 15,
        borderRadius: 5,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSubmit: {
        alignSelf: "flex-end",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        marginBottom: 5,
        borderRadius: 10
    },
    txtQuestion: {
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.black,
    },
    txtOption: {
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.white,
    },
    txtSubmit: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold"
    },
})

export default AnswerCheckBox