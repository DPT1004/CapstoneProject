import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { COLORS } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { moreCorrect, moreIncorrect, nextQuestion, showLeaderBoard } from '../../../redux/Slice/userCompetitiveSlice'
import { timeWaitToPreviewAndLeaderBoard } from '../../../common/shareVarible'
import TopBar from '../../Game/PlayQuiz/components/TopBar'
import CustomViewScore from '../../Game/PlayQuiz/components/CustomViewScore'
import socketServcies from '../../../until/socketServices'
import Icon from "react-native-vector-icons/FontAwesome"

const AnswerMultiChoice = ({ question }) => {

    const dispatch = useDispatch()
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const game = useSelector((state) => state.game)
    const user = useSelector((state) => state.user)
    const score = React.useRef()
    const [userAnswer, setUserAnswer] = React.useState([])
    const [time, setTime] = React.useState(question.time)
    const [showViewScore, setShowViewScore] = React.useState(false)

    const [sizeContainerOption, setSizeContainerOption] = React.useState({
        width: 0,
        height: 0
    })


    const isCorrectAnswer = () => {
        if (userAnswer.length == 0 || userAnswer[0].isCorrect == false) {
            return false
        }
        return true
    }

    const handleAfterDone = () => {

        setShowViewScore(true)
        if (isCorrectAnswer()) {
            dispatch(moreCorrect(score.current))
        } else {
            dispatch(moreIncorrect())
        }

        setTimeout(() => {
            dispatch(showLeaderBoard(true))

            var userId = user.userId
            var pin = game.pin
            var scoreRecieve = isCorrectAnswer() ? score.current : 0
            socketServcies.emit("player-send-score-and-currentIndexQuestion", { userId, pin, scoreRecieve, currentIndexQuestion })

            dispatch(nextQuestion())
        }, timeWaitToPreviewAndLeaderBoard)

    }

    const handleComplete = () => {
        setUserAnswer([{
            isCorrect: false
        }])
        handleAfterDone()
    }

    const handleUpdate = (currentTime) => {
        var timeUserResponed = time - currentTime
        var takenScore = 1 - (timeUserResponed / time) / 2
        score.current = Number(takenScore).toFixed(3) * 1000
    }

    const getOptionBgColor = (option, indexOption) => {
        if (userAnswer.length !== 0) {
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
        if (userAnswer.length !== 0 && userAnswer !== { isCorrect: false }) {
            handleAfterDone()
        }
    }, [userAnswer])

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
                            <TouchableOpacity
                                key={indexOption}
                                activeOpacity={0.8}
                                disabled={userAnswer.length !== 0 ? true : false}
                                style={[styles.btnOptionImage, {
                                    backgroundColor: getOptionBgColor(option, indexOption),
                                    width: (sizeContainerOption.width - 16) / 2,
                                    height: (sizeContainerOption.height - 16) / 2,
                                }]}
                                onPress={() => {
                                    setUserAnswer([option])
                                }}>
                                {
                                    option.img !== "" ?
                                        <Image
                                            style={styles.imgAnswer}
                                            resizeMode="stretch"
                                            source={{ uri: option.img }}
                                        />
                                        :
                                        <Text style={styles.txtOption}>{option.answer}</Text>
                                }
                                {
                                    userAnswer.includes(option) ?
                                        <View style={styles.iconChoose}>
                                            <Icon
                                                name={"check-circle-o"}
                                                size={20}
                                                color={COLORS.white} />
                                        </View>
                                        :
                                        <></>
                                }
                            </TouchableOpacity>
                        ))
                    }
                </View>
            )
        } else {
            return (
                < View style={styles.containerOptionOnlyText}>
                    {
                        question.answerList.map((option, indexOption) => (
                            <TouchableOpacity
                                key={indexOption}
                                activeOpacity={0.8}
                                disabled={userAnswer.length !== 0 ? true : false}
                                style={[styles.btnOptionOnlyText, {
                                    backgroundColor: getOptionBgColor(option, indexOption),
                                }]}
                                onPress={() => {
                                    setUserAnswer([option])
                                }}>
                                <Text style={styles.txtOption}>{option.answer}</Text>
                                {
                                    userAnswer.includes(option) ?
                                        <View style={styles.iconChoose}>
                                            <Icon
                                                name={"check-circle-o"}
                                                size={20}
                                                color={COLORS.white} />
                                        </View>
                                        :
                                        <></>
                                }
                            </TouchableOpacity>
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
                    userAnswer={userAnswer}
                    time={time}
                    handleComplete={handleComplete}
                    handleUpdate={(currentTime) => handleUpdate(currentTime)}
                />
                {/* Container Question */}
                <View style={styles.containerQuestion}>
                    <Text style={styles.txtQuestion}>{currentIndexQuestion + 1 + "." + question.question}</Text>
                    {
                        question.backgroundImage != '' ?
                            <Image
                                source={{ uri: question.backgroundImage }}
                                resizeMode={"stretch"}
                                style={styles.imgQuestion}
                            />
                            :
                            <></>
                    }
                </View>
                {/* Render answer/option */}
                {
                    renderOption()
                }
            </View>
            {
                showViewScore ? <CustomViewScore score={score.current} isCorrect={isCorrectAnswer()} /> : <></>
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
        flex: 1
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
    iconChoose: {
        position: "absolute",
        bottom: 3,
        right: 3
    },
    imgQuestion: {
        flex: 1,
        height: "100%",
        width: "75%",
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 5,
    },
    imgAnswer: {
        height: "100%",
        width: "100%",
        borderRadius: 10
    },
    btnOptionOnlyText: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
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
    txtQuestion: {
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.black,
    },
    txtOption: {
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.white,
    }
})

export default AnswerMultiChoice