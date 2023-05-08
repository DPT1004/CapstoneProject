import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { COLORS } from '../../../common/theme'
import { timeWaitToNextQuestion } from '../../../common/shareVarible'
import Icon from "react-native-vector-icons/FontAwesome"
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import TopBar from '../../PlayQuiz/components/TopBar'
import CustomViewScore from '../../PlayQuiz/components/CustomViewScore'
import { useDispatch } from 'react-redux'
import { moreCorrect, moreIncorrect } from '../../../redux/Slice/userCompetitiveSlice'

const AnswerMultiChoice = ({ quest, indexQuestion, handleNextQuestion }) => {

    var question = quest

    const [userAnswer, setUserAnswer] = React.useState(null)
    const score = React.useRef()
    const [showViewScore, setShowViewScore] = React.useState(false)
    const [sizeContainerOption, setSizeContainerOption] = React.useState({
        width: 0,
        height: 0
    })
    const dispatch = useDispatch()

    const isUserAnswerTrue = () => {
        const correctAnswerList = []

        if (userAnswer == correctAnswerList) {
            return true
        }
        return false
    }

    const handleAfterDone = () => {
        setShowViewScore(true)
        setTimeout(() => {
            // handleNextQuestion(indexQuestion + 1)
            setUserAnswer("")
            if (isUserAnswerTrue()) {
                dispatch(moreCorrect(score.current))
            } else {
                dispatch(moreIncorrect())
            }
        }, timeWaitToNextQuestion)
    }

    const getOptionBgColor = (option, indexOption) => {
        // if (userAnswer !== null) {
        // if (option == question.correct_answer) {
        //     return COLORS.success
        // } else {
        //     return COLORS.error
        // }
        // }
        // else {
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
        // }
    };

    const getOptionIcon = (indexOption) => {
        switch (indexOption) {
            case 0:
                return "hand-grab-o"
            case 1:
                return "hand-pointer-o"
            case 2:
                return "hand-peace-o"
            case 3:
                return "hand-spock-o"
        }
    }

    // React.useEffect(() => {
    //     if (userAnswer !== null) {
    //         handleAfterDone()
    //     }
    // }, [userAnswer])


    return (
        <View style={styles.viewFlex1}>
            <View style={styles.container}>
                <TopBar children={
                    <CountdownCircleTimer
                        isPlaying={userAnswer !== null ? false : true}
                        duration={question.time}
                        trailColor={COLORS.gray}
                        size={40}
                        strokeWidth={5}
                        colors={[COLORS.success, COLORS.answerC, COLORS.error]}
                        colorsTime={[question.time, question.time / 3, 0]}
                        onUpdate={(currentTime) => {
                            var timeUserResponed = question.time - currentTime
                            var takenScore = 1 - (timeUserResponed / question.time) / 2
                            score.current = Number(takenScore).toFixed(3) * 1000
                        }}
                        onComplete={() => {
                            handleAfterDone()
                        }}>
                        {({ remainingTime, color }) => <Text style={{ fontSize: 20, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                    </CountdownCircleTimer>
                } />
                <View style={styles.containerQuestion}
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout
                        setSizeContainerOption({
                            width: width,
                            height: height
                        })
                    }}>
                    <Text style={styles.txtQuestion}> {indexQuestion + 1}. {question.question} </Text>
                    {question.imageUrl != '' ? (
                        <Image
                            source={{ uri: question.backgroundImage }}
                            resizeMode={"stretch"}
                            style={styles.img}
                        />
                    ) : <></>}
                </View>
                <View style={styles.containerOption}>
                    {question.answerList.map((option, indexOption) => {
                        return (
                            <>
                                {
                                    // question.answerList.some(item => item.img !== "") ?
                                    //     <TouchableOpacity
                                    //         key={indexOption}
                                    //         style={[styles.btnOptionImage]}
                                    //     >
                                    //         <Icon
                                    //             name={getOptionIcon(indexOption)}
                                    //             size={25}
                                    //             color={COLORS.white}
                                    //         />
                                    //     </TouchableOpacity>
                                    //     :
                                    <TouchableOpacity
                                        key={indexOption}
                                        disabled={userAnswer !== null ? true : false}
                                        style={[styles.btnOptionTxt, { backgroundColor: getOptionBgColor(option, indexOption) }]}
                                        onPress={() => {
                                            setUserAnswer(option)
                                        }}>
                                        <Icon
                                            name={getOptionIcon(indexOption)}
                                            size={25}
                                            color={COLORS.white}
                                        />
                                        {
                                            option.answer !== "" ?
                                                <Image
                                                    style={styles.imgAnswer}
                                                    source={{ uri: option.img }}
                                                />
                                                :
                                                <Text style={styles.txtOptionTxt}>{option.answer}</Text>
                                        }
                                    </TouchableOpacity>
                                }
                            </>

                        );
                    })}
                </View>
            </View>
            {
                showViewScore ? <CustomViewScore score={score.current} isCorrect={isUserAnswerTrue()} /> : <></>
            }
        </View>
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
    containerOption: {
        flex: 1,
    },
    viewFlex1: {
        flex: 1
    },
    img: {
        width: '80%',
        height: 150,
        marginTop: 20,
        marginLeft: '10%',
        borderRadius: 5,
    },
    imgAnswer: {

        height: 90,
        width: 90,
        alignSelf: "center",
        borderRadius: 5

    },
    btnOptionTxt: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 5,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    btnOptionTxt: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    txtQuestion: {
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.black,
    },
    txtOptionTxt: {
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.white,
        marginLeft: 10
    }
})

export default AnswerMultiChoice;