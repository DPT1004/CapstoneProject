import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { COLORS } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { moreCorrect, moreIncorrect, nextQuestion } from '../../../redux/Slice/userCompetitiveSlice'
import { timeWaitToNextQuestion } from '../../../common/shareVarible'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import TopBar from '../../PlayQuiz/components/TopBar'
import CustomViewScore from '../../PlayQuiz/components/CustomViewScore'

const AnswerMultiChoice = ({ question }) => {

    const dispatch = useDispatch()
    const currentIndexQuestion = useSelector((state) => state.userCompetitive.currentIndexQuestion)
    const [userAnswer, setUserAnswer] = React.useState(null)
    const [time, setTime] = React.useState(question.time)
    const score = React.useRef()
    const [showViewScore, setShowViewScore] = React.useState(false)
    const [sizeContainerOption, setSizeContainerOption] = React.useState({
        width: 0,
        height: 0
    })


    const isCorrectAnswer = () => {
        if (userAnswer == null || userAnswer.isCorrect == false) {
            return false
        }
        return true
    }

    const handleAfterDone = () => {
        setShowViewScore(true)
        const timeout = setTimeout(() => {
            setUserAnswer(null)
            setShowViewScore(false)
            dispatch(nextQuestion())
            if (isCorrectAnswer()) {
                dispatch(moreCorrect(score.current))
            } else {
                dispatch(moreIncorrect())
            }
            setUserAnswer(null)
            clearTimeout(timeout)
        }, timeWaitToNextQuestion)
    }

    const getOptionBgColor = (option, indexOption) => {
        if (userAnswer !== null) {
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

    // React.useEffect(() => {
    //     if (userAnswer !== null && userAnswer !== { isCorrect: false }) {
    //         handleAfterDone()
    //     }
    // }, [userAnswer])

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
                                disabled={userAnswer !== null ? true : false}
                                style={[styles.btnOptionImage, {
                                    backgroundColor: getOptionBgColor(option, indexOption),
                                    borderWidth: option == userAnswer ? 3 : 0,
                                    borderColor: COLORS.black,
                                    width: (sizeContainerOption.width - 16) / 2,
                                    height: (sizeContainerOption.height - 16) / 2,
                                }]}
                                onPress={() => {
                                    setUserAnswer(option)
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
                                disabled={userAnswer !== null ? true : false}
                                style={[styles.btnOptionOnlyText, {
                                    backgroundColor: getOptionBgColor(option, indexOption),
                                    borderWidth: option == userAnswer ? 3 : 0,
                                    borderColor: COLORS.black
                                }]}
                                onPress={() => {
                                    setUserAnswer(option)
                                }}>

                                <Text style={styles.txtOption}>{option.answer}</Text>
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
                <TopBar children={
                    <CountdownCircleTimer
                        isPlaying={userAnswer !== null ? false : true}
                        duration={time}
                        trailColor={COLORS.gray}
                        size={40}
                        strokeWidth={5}
                        colors={[COLORS.success, COLORS.answerC, COLORS.error]}
                        colorsTime={[time, time / 3, 0]}
                        onUpdate={(currentTime) => {
                            var timeUserResponed = time - currentTime
                            var takenScore = 1 - (timeUserResponed / time) / 2
                            score.current = Number(takenScore).toFixed(3) * 1000
                        }}
                        onComplete={() => {
                            // setUserAnswer({
                            //     isCorrect: false
                            // })
                            // handleAfterDone()

                        }}>
                        {({ remainingTime, color }) => <Text style={{ fontSize: 20, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                    </CountdownCircleTimer>
                } />
                {/* Container Question */}
                <View style={styles.containerQuestion}>
                    <Text style={styles.txtQuestion}> {currentIndexQuestion + 1}. {question.question} </Text>
                    {
                        question.backgroundImage != '' ? (
                            <Image
                                source={{ uri: question.backgroundImage }}
                                resizeMode={"stretch"}
                                style={styles.imgQuestion}
                            />
                        )
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
        paddingBottom: 60,
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
        justifyContent: "space-between"
    },
    imgQuestion: {
        width: 250,
        height: 180,
        marginTop: 15,
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
        borderRadius: 10,
        marginBottom: 5,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnOptionImage: {
        padding: 15,
        borderRadius: 10,
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
        fontSize: 18,
        color: COLORS.white,
    }
})

export default React.memo(AnswerMultiChoice)