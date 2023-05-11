import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { COLORS } from '../../../common/theme'
import { timeWaitToNextQuestion } from '../../../common/shareVarible'
import Icon from "react-native-vector-icons/FontAwesome"
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import CustomViewScore from '../../PlayQuiz/components/CustomViewScore'
import TopBar from '../../PlayQuiz/components/TopBar'
import { useDispatch } from 'react-redux'
import { moreCorrect, moreIncorrect } from '../../../redux/Slice/userCompetitiveSlice'

const AnswerCheckBox = ({ quest, indexQuestion, handleNextQuestion }) => {

    question = {
        ...quest,
        arrOption: [...quest.incorrect_answers, ...quest.correct_answer]
    }
    const [userAnswer, setUserAnswer] = React.useState([])
    const [activeSubmit, setActiveSubmit] = React.useState(false)
    const [rerender, setReRender] = React.useState(0)
    const score = React.useRef()
    const dispatch = useDispatch()

    function isUserAnswerCorrect(array1, array2) {
        if (array1.length === array2.length) {
            return array1.every((element, index) => {
                if (element === array2[index]) {
                    return true;
                }
                return false;
            });
        }
        return false;
    }

    const handleAfterDone = () => {
        setTimeout(() => {
            handleNextQuestion(indexQuestion + 1)
            setUserAnswer([])
            if (isUserAnswerCorrect(userAnswer, question.correct_answer)) {
                dispatch(moreCorrect(score.current))
            } else {
                dispatch(moreIncorrect())
            }
        }, timeWaitToNextQuestion)
    }

    const getOptionBgColor = (option, indexOption) => {
        if (activeSubmit) {
            if (question.correct_answer.includes(option)) {
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

    React.useEffect(() => {
        if (activeSubmit === true) {
            handleAfterDone()
        }
    }, [activeSubmit])

    return (
        <View style={styles.viewFlex1}>
            <View style={styles.container}>
                <TopBar children={
                    <CountdownCircleTimer
                        isPlaying={activeSubmit ? false : true}
                        duration={question.time}
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
                            setActiveSubmit(true)
                        }}
                    >
                        {({ remainingTime, color }) => <Text style={{ fontSize: 20, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                    </CountdownCircleTimer>
                } />
                <View style={styles.containerQuestion}>
                    <Text style={styles.txtQuestion}> {indexQuestion + 1}. {question.question} </Text>
                    {question.imageUrl != '' ? (
                        <Image
                            source={{
                                uri: question.imageUrl,
                            }}
                            resizeMode={'contain'}
                            style={styles.img}
                        />
                    ) : <></>}
                </View>
                <View style={styles.containerOption}>
                    {question.arrOption.map((option, indexOption) => {
                        return (
                            <TouchableOpacity
                                key={indexOption}
                                disabled={activeSubmit}
                                style={[styles.btnOption, { backgroundColor: getOptionBgColor(option, indexOption) }]}
                                onPress={() => {
                                    var newUserAnswer = userAnswer
                                    if (!newUserAnswer.includes(option)) {
                                        newUserAnswer.push(option);
                                    } else {
                                        newUserAnswer.splice(newUserAnswer.indexOf(option), 1);
                                    }
                                    setReRender(Math.random())
                                    setUserAnswer(newUserAnswer)
                                }}>
                                <Icon
                                    name={getOptionIcon(indexOption)}
                                    size={25}
                                    color={COLORS.white}
                                />
                                <Text style={styles.txtOption}>{option}</Text>
                                {
                                    userAnswer.includes(option) ?
                                        <View style={styles.iconChoose}>
                                            <Icon
                                                name={"check-circle"}
                                                size={20}
                                                color={COLORS.white} />
                                        </View>
                                        :
                                        <View style={styles.circleUnchoose} />
                                }
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity style={styles.btnSubmit}
                        disabled={activeSubmit}
                        onPress={() => setActiveSubmit(true)}>
                        <Icon
                            name="arrow-right"
                            color={COLORS.white}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                activeSubmit ? <CustomViewScore score={score.current} isCorrect={isUserAnswerCorrect(userAnswer, question.correct_answer)} /> : <></>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: COLORS.white
    },
    containerQuestion: {
        flex: 0.45
    },
    containerOption: {
        flex: 0.55,
    },
    viewFlex1: {
        flex: 1
    },
    circleUnchoose: {
        height: 15,
        width: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: COLORS.white,
        position: "absolute",
        bottom: 5,
        right: 5
    },
    iconChoose: {
        position: "absolute",
        bottom: 5,
        right: 5
    },
    img: {
        width: '80%',
        height: 150,
        marginTop: 20,
        marginLeft: '10%',
        borderRadius: 5,
    },
    btnSubmit: {
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: COLORS.primary,
        alignSelf: "flex-end",
        padding: 10,
        paddingHorizontal: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    btnOption: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
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
    txtOption: {
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.white,
        marginLeft: 10
    }


})

export default AnswerCheckBox