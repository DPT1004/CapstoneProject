import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert, LayoutAnimation, TouchableHighlight } from 'react-native'
import DraggableFlatList, {
    OpacityDecorator
} from "react-native-draggable-flatlist"
import { useSelector, useDispatch } from 'react-redux'
import { updateQuestionList, deleteQuestionByIndex } from '../../../../../redux/Slice/newQuizSlice'
import { setPushOrUnshiftNewQuestion } from '../../../../../redux/Slice/whenToFetchApiSlice'
import { useNavigation } from "@react-navigation/native"
import { COLORS, SIZES } from '../../../../../common/theme'
import { screenName } from '../../../../../navigator/screens-name'
import FormButton from '../../../../../components/FormButton'
import Icon from 'react-native-vector-icons/Octicons'
import Icon1 from 'react-native-vector-icons/FontAwesome'

const paddingHorizonContainerDraggle = 20
const paddingHorizonViewBottom = 10
const sizeViewItemAnswerChoice = 0.5 * (SIZES.windowWidth - paddingHorizonContainerDraggle * 2 - paddingHorizonViewBottom * 2)

const DraggleListQuestion = ({ bottomSheetModalRef }) => {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const newQuiz = useSelector((state) => state.newQuiz)
    const [isShowDetail, setIsShowDetail] = React.useState(Array(newQuiz.numberOfQuestions).fill(false))

    const renderItem = ({ item, getIndex, drag, isActive }) => {

        if (item.questionType == "DragAndSort") {
            var newTrueArrAnswer = []
            var newWrongArrAnswer = []

            item.answerList.forEach(answer => {
                answer.isCorrect ?
                    newTrueArrAnswer.push(answer)
                    :
                    newWrongArrAnswer.push(answer)
            })
            newTrueArrAnswer.sort((a, b) => a.order - b.order)
        }

        return (
            <OpacityDecorator>
                <View style={styles.rowItem}>
                    <View style={styles.viewTop}>
                        {/*Reorder Question*/}
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onLongPress={drag}
                            disabled={isActive}
                            style={[styles.btnIcon, { left: 5 }]}>
                            <Icon
                                name={"list-ordered"}
                                size={20}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>

                        <Text style={[styles.txt, { color: COLORS.error, marginLeft: 40 }]}>{"Question " + String(getIndex() + 1) + " / " + newQuiz.numberOfQuestions}</Text>

                        {/*Set show or not show Detail Question*/}
                        <TouchableHighlight
                            underlayColor={"rgba(0, 0, 0, 0.5)"}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                                var newIsShowDetail = [...isShowDetail]
                                newIsShowDetail[getIndex()] = !newIsShowDetail[getIndex()]
                                setIsShowDetail(newIsShowDetail)
                            }}
                            style={[styles.btnIcon, { right: 75 }]}>
                            <Icon1
                                name={"info-circle"}
                                size={22}
                                color={COLORS.black} />
                        </TouchableHighlight>

                        {/*Delete Question*/}
                        <TouchableHighlight
                            underlayColor={"rgba(0, 0, 0, 0.5)"}
                            onPress={() => Alert.alert(
                                "OOPS !!!",
                                "You really want to delete this question?",
                                [
                                    {
                                        text: "Yes",
                                        onPress: () => {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                                            dispatch(deleteQuestionByIndex(getIndex()))
                                        }
                                    },
                                    {
                                        text: "No"
                                    }
                                ],
                            )}
                            style={[styles.btnIcon, { right: 40 }]}>
                            <Icon
                                name={"trash"}
                                size={20}
                                color={COLORS.black} />
                        </TouchableHighlight>

                        {/*Edit Question*/}
                        <TouchableHighlight
                            underlayColor={"rgba(0, 0, 0, 0.5)"}
                            onPress={() => {

                                switch (item.questionType) {
                                    case "MultipleChoice":
                                        navigation.navigate(screenName.MultipleChoice, {
                                            question: item,
                                            indexQuestion: getIndex()
                                        })
                                        break
                                    case "CheckBox":
                                        navigation.navigate(screenName.CheckBox, {
                                            question: item,
                                            indexQuestion: getIndex()
                                        })
                                        break
                                    case "Fill-In-The-Blank":
                                        navigation.navigate(screenName.FillInTheBlank, {
                                            question: item,
                                            indexQuestion: getIndex()
                                        })
                                        break
                                    case "DragAndSort":
                                        navigation.navigate(screenName.DragAndSort, {
                                            question: item,
                                            indexQuestion: getIndex()
                                        })
                                        break
                                }
                            }}
                            style={[styles.btnIcon, { right: 5 }]}>
                            <Icon
                                name={"pencil"}
                                size={20}
                                color={COLORS.black} />
                        </TouchableHighlight>
                    </View>

                    {/*Question detail*/}
                    {
                        isShowDetail[getIndex()] &&
                        <View style={styles.viewMiddle}>
                            <Text style={styles.txt} numberOfLines={8}>{item.question}</Text>
                            {
                                item.backgroundImage !== "" &&
                                <Image
                                    style={styles.quizBGR}
                                    source={{ uri: item.backgroundImage }}
                                />
                            }
                            <View style={styles.containerLineHorizon}>
                                <View style={[styles.lineHorizon, { marginRight: 5, flex: 1 }]} />
                                <Text>answer choice</Text>
                                <View style={[styles.lineHorizon, { marginLeft: 5, flex: 5 }]} />
                            </View>
                            <View style={styles.containerAnswerChoice}>
                                {
                                    item.questionType == "DragAndSort" ?
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
                                        item.answerList.map((item, index) => (
                                            <View key={index} style={styles.viewItemAnswerChoice}>
                                                {
                                                    item.isCorrect ?
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
                                                    item.img !== "" ?
                                                        <Image
                                                            style={styles.quizBGR}
                                                            source={{ uri: item.img }}
                                                        />
                                                        :
                                                        <Text style={styles.txt} numberOfLines={5}>{item.answer}</Text>
                                                }
                                            </View>
                                        ))
                                }
                            </View>
                        </View>
                    }

                    {/*Question order and Level of hard */}
                    <View style={styles.viewBottom}>
                        <Text style={[styles.txt, { color: COLORS.error, flex: 0 }]}>
                            {`${item.questionType} - ${item.time} - ${item.difficulty} - `}
                            {
                                item.video == "" && item.backgroundImage == "" && item.youtube == "" ?
                                    <Icon1
                                        size={20}
                                        color={COLORS.error}
                                        name={"file-text-o"}
                                    />
                                    :
                                    <Icon1
                                        size={20}
                                        color={COLORS.error}
                                        name={
                                            item.backgroundImage !== "" ?
                                                "file-picture-o"
                                                :
                                                item.video !== "" ?
                                                    "file-video-o"
                                                    :
                                                    "youtube"
                                        }
                                    />
                            }
                        </Text>
                    </View>
                </View>
            </OpacityDecorator >
        );
    }

    return (
        <DraggableFlatList
            containerStyle={{ paddingHorizontal: paddingHorizonContainerDraggle, flex: 1 }}
            showsVerticalScrollIndicator={false}
            data={newQuiz.questionList}
            onDragEnd={({ data }) => dispatch(updateQuestionList(data))}
            keyExtractor={(item) => item.tempQuestionId}
            renderItem={renderItem}
            ListHeaderComponent={() => (
                <View style={styles.containerHeaderOrFooter}>
                    <FormButton
                        labelText="Cancel"
                        isPrimary={false}
                        style={{
                            paddingHorizontal: 20,
                            marginRight: 20
                        }}
                        handleOnPress={() => {
                            navigation.navigate(screenName.ManageQuiz);
                        }}
                    />
                    <FormButton
                        labelText="New Question"
                        isPrimary={false}
                        style={{
                            paddingHorizontal: 20,
                        }}
                        handleOnPress={() => {
                            dispatch(setPushOrUnshiftNewQuestion("unshift"))
                            bottomSheetModalRef.current?.present()
                        }}
                    />
                </View>
            )}
            ListFooterComponent={() => {
                if (newQuiz.numberOfQuestions > 0) {
                    return (
                        <View style={[styles.containerHeaderOrFooter, { marginTop: 0 }]}>
                            <FormButton
                                labelText="Cancel"
                                isPrimary={false}
                                style={{
                                    paddingHorizontal: 20,
                                    marginRight: 20
                                }}
                                handleOnPress={() => {
                                    navigation.navigate(screenName.ManageQuiz);
                                }}
                            />
                            <FormButton
                                labelText="New Question"
                                isPrimary={false}
                                style={{
                                    paddingHorizontal: 20,
                                }}
                                handleOnPress={() => {
                                    dispatch(setPushOrUnshiftNewQuestion("push"))
                                    bottomSheetModalRef.current?.present()
                                }}
                            />
                        </View>
                    )
                }
            }}
        />
    );
};

const styles = StyleSheet.create({
    rowItem: {
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    viewTop: {
        height: 40,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundTopBar,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },
    viewMiddle: {
        backgroundColor: COLORS.white,
        paddingHorizontal: paddingHorizonViewBottom,
        paddingVertical: 5
    },
    viewBottom: {
        height: 40,
        paddingHorizontal: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.backgroundTopBar,
    },
    viewItemAnswerChoice: {
        flexDirection: "row",
        alignItems: "center",
        width: sizeViewItemAnswerChoice,
        height: sizeViewItemAnswerChoice * 2 / 3
    },
    viewAnswerDragAndDrop: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 10
    },
    containerHeaderOrFooter: {
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
        borderRadius: 30,
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    quizBGR: {
        height: 90,
        width: 90,
        alignSelf: "center",
        borderRadius: 5
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
    txt: {
        color: COLORS.black,
        fontSize: 16,
        flex: 1,
    }

})

export default DraggleListQuestion