import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid, LayoutAnimation } from 'react-native'
import { COLORS } from '../../../common/theme'
import { SIZES } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { addNewQuestion } from '../../../redux/Slice/newQuizSlice'
import Icon from 'react-native-vector-icons/Octicons'

const paddingHorizonContainerFlatlist = 10
const paddingHorizonViewBottom = 10
const sizeViewItemAnswerChoice = 0.5 * (SIZES.windowWidth * 0.9 - paddingHorizonContainerFlatlist * 2 - paddingHorizonViewBottom * 2)

const ItemListQuestion = ({ itemQuestion }) => {

    const dispatch = useDispatch()
    const quiz = useSelector((state) => state.newQuiz)

    function isTwoArrayTheSame(array1, array2) {
        if (JSON.stringify(array1) === JSON.stringify(array2)) {
            return true
        }
        return false
    }

    function checkIfQuestionHaveAdded() {
        return quiz.questionList.some(item => item.question == itemQuestion.question && isTwoArrayTheSame(item.answerList, itemQuestion.answerList))
    }

    if (itemQuestion.questionType == "DragAndSort") {
        var newTrueArrAnswer = []
        var newWrongArrAnswer = []
        itemQuestion.answerList.forEach(answer => {
            answer.isCorrect ?
                newTrueArrAnswer.push(answer)
                :
                newWrongArrAnswer.push(answer)
        })
        newTrueArrAnswer.sort((a, b) => a.order - b.order)
    }


    return (
        <View style={styles.rowItem}>
            <View style={styles.viewTop}>
                <Text style={[styles.txt, { color: COLORS.error, marginLeft: 5, fontSize: 12 }]}>{`${itemQuestion.questionType} - ${itemQuestion.time}s - ${itemQuestion.difficulty}`}</Text>
                {/*Add Question to your quiz*/}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        var newQuestion = {
                            ...itemQuestion,
                            tempQuestionId: "question" + quiz.numberOfQuestionsOrigin
                        }
                        delete newQuestion._id

                        if (quiz.questionList.some(item => item.tempQuestionId == newQuestion.tempQuestionId)) {
                            ToastAndroid.show("This question have existed in your quiz", ToastAndroid.SHORT)
                        } else {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                            dispatch(addNewQuestion(newQuestion))
                            ToastAndroid.show("Add question success", ToastAndroid.SHORT)
                        }
                    }}
                    style={[styles.btnIcon, { right: 5 }]}>
                    <Icon
                        name={"plus-circle"}
                        size={18}
                        color={checkIfQuestionHaveAdded() ? COLORS.primary : COLORS.black} />
                    <Text style={{ color: checkIfQuestionHaveAdded() ? COLORS.primary : COLORS.black, fontSize: 12 }}>{checkIfQuestionHaveAdded() ? "Add again" : "Add question"}</Text>
                </TouchableOpacity>
            </View>
            {/*Question detail*/}
            <View style={styles.viewBottom}>
                <Text style={styles.txt}>{itemQuestion.question}</Text>
                {
                    itemQuestion.backgroundImage !== "" ?
                        <Image
                            style={styles.quizBGR}
                            source={{ uri: itemQuestion.backgroundImage }}
                            resizeMode='stretch'
                        />
                        :
                        null
                }
                <View style={styles.containerLineHorizon}>
                    <View style={[styles.lineHorizon, { marginRight: 5, flex: 1 }]} />
                    <Text>answer choice</Text>
                    <View style={[styles.lineHorizon, { marginLeft: 5, flex: 5 }]} />
                </View>
                <View style={styles.containerAnswerChoice}>
                    {
                        itemQuestion.questionType == "DragAndSort" ?
                            <View>
                                <View style={[styles.viewAnswerDragAndDrop, { marginTop: 10 }]}>
                                    <Icon
                                        name={"check-circle-fill"}
                                        size={20}
                                        style={{ marginRight: 5 }}
                                        color={COLORS.success}
                                    />
                                    {
                                        newTrueArrAnswer.map((item, index) => (
                                            <Text key={index} style={styles.txtDragAndDrop} numberOfLines={1}>{item.answer}</Text>
                                        ))
                                    }
                                </View>

                                {
                                    newWrongArrAnswer.length !== 0 &&
                                    <View style={styles.viewAnswerDragAndDrop}>
                                        <Icon
                                            name={"x-circle-fill"}
                                            size={20}
                                            style={{ marginRight: 5 }}
                                            color={COLORS.error}
                                        />
                                        {
                                            newWrongArrAnswer.map((item, index) => (
                                                <Text key={index} style={styles.txtDragAndDrop} numberOfLines={1}>{item.answer}</Text>
                                            ))
                                        }
                                    </View>
                                }
                            </View>
                            :
                            itemQuestion.answerList.map((itemAnswer, index) => (
                                <View key={index} style={styles.viewItemAnswerChoice}>
                                    {
                                        itemAnswer.isCorrect ?
                                            <Icon
                                                name={"check-circle-fill"}
                                                size={20}
                                                style={{ marginRight: 5 }}
                                                color={COLORS.success}
                                            />
                                            :
                                            <Icon
                                                name={"x-circle-fill"}
                                                size={20}
                                                style={{ marginRight: 5 }}
                                                color={COLORS.error}
                                            />
                                    }
                                    {
                                        itemAnswer.img !== "" ?
                                            <Image
                                                style={styles.imgAnswer}
                                                source={{ uri: itemAnswer.img }}
                                            />
                                            :
                                            <Text style={styles.txt}>{itemAnswer.answer}</Text>
                                    }
                                </View>
                            ))
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowItem: {
        borderRadius: 10,
        marginBottom: 30,
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    viewTop: {
        height: 50,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundTopBar,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },
    viewBottom: {
        width: "100%",
        backgroundColor: COLORS.white,
        paddingHorizontal: paddingHorizonViewBottom,
        paddingVertical: 5
    },
    viewItemAnswerChoice: {
        flexDirection: "row",
        alignItems: "center",
        width: sizeViewItemAnswerChoice,
        height: sizeViewItemAnswerChoice * 2 / 3,
    },
    viewAnswerDragAndDrop: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 10
    },
    containerHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        padding: 20,
        alignSelf: "center",
        borderRadius: 10
    },
    containerLineHorizon: {
        flexDirection: "row",
        alignItems: "center"
    },
    containerAnswerChoice: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    lineHorizon: {
        borderWidth: 0.8,
        borderColor: COLORS.gray,
    },
    btnIcon: {
        paddingHorizontal: 5,
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgAnswer: {
        height: 90,
        width: 90,
        alignSelf: "center",
        borderRadius: 5
    },
    quizBGR: {
        height: 100,
        width: 150,
        alignSelf: "center",
        borderRadius: 5
    },
    txt: {
        color: COLORS.black,
        fontSize: 16,
        flex: 1
    },
    txtDragAndDrop: {
        fontSize: 16,
        marginHorizontal: 3,
        marginBottom: 5,
        color: COLORS.black,
        backgroundColor: COLORS.gray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 3
    },

})

export default React.memo(ItemListQuestion)
