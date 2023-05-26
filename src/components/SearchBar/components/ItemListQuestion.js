import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native'
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

    return (
        <View style={styles.rowItem}>
            <View style={styles.viewTop}>
                <Text style={[styles.txt, { color: COLORS.error, marginLeft: 5 }]}>{itemQuestion.questionType} - {itemQuestion.time}s</Text>
                {/*Add Question to your quiz*/}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        if (quiz.questionList.some(item => item._id == itemQuestion._id || item.tempQuestionId == itemQuestion._id)) {
                            ToastAndroid.show("This question have existed in your quiz", ToastAndroid.SHORT)
                        } else {
                            dispatch(addNewQuestion({
                                ...itemQuestion,
                                tempQuestionId: itemQuestion._id
                            }))
                            ToastAndroid.show("Add question success", ToastAndroid.SHORT)
                        }
                    }}
                    style={[styles.btnIcon, { right: 5 }]}>
                    <Icon
                        name={"plus-circle"}
                        size={18}
                        color={COLORS.black} />
                    <Text style={{ color: COLORS.black }}>Add question</Text>
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
                                            style={styles.quizBGR}
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
        height: sizeViewItemAnswerChoice * 2 / 3
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
        flexWrap: "wrap"
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
    quizBGR: {
        height: 90,
        width: 90,
        alignSelf: "center",
        borderRadius: 5
    },
    txt: {
        color: COLORS.black,
        fontSize: 16,
        flex: 1
    }

})

export default React.memo(ItemListQuestion)
