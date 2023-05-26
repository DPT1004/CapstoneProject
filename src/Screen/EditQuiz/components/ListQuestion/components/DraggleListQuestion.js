import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert, LayoutAnimation } from 'react-native'
import DraggableFlatList, {
    OpacityDecorator
} from "react-native-draggable-flatlist"
import { useSelector, useDispatch } from 'react-redux'
import { updateQuestionList, deleteQuestionByIndex } from '../../../../../redux/Slice/newQuizSlice'
import { useNavigation } from "@react-navigation/native"
import { COLORS, SIZES } from '../../../../../common/theme'
import { screenName } from '../../../../../navigator/screens-name'
import FormButton from '../../../../../components/FormButton'
import Icon from 'react-native-vector-icons/Octicons'

const paddingHorizonContainerDraggle = 20
const paddingHorizonViewBottom = 10
const sizeViewItemAnswerChoice = 0.5 * (SIZES.windowWidth - paddingHorizonContainerDraggle * 2 - paddingHorizonViewBottom * 2)

const DraggleListQuestion = ({ bottomSheetModalRef }) => {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const quiz = useSelector((state) => state.newQuiz)

    const renderItem = ({ item, getIndex, drag, isActive }) => {
        return (
            <OpacityDecorator>
                <View key={item._id} style={styles.rowItem}>
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

                        <Text style={[styles.txt, { color: COLORS.error, marginLeft: 40 }]}>{item.questionType} - {item.time}s</Text>

                        {/*Delete Question*/}
                        <TouchableOpacity
                            activeOpacity={0.5}
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
                        </TouchableOpacity>

                        {/*Edit Question*/}
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {

                                switch (item.questionType) {
                                    case "MultipleChoice":
                                        navigation.navigate(screenName.MultipleChoice, {
                                            question: item,
                                            indexQuestion: getIndex(),
                                            fromScreen: "EditQuiz"
                                        })
                                        break
                                    case "CheckBox":
                                        navigation.navigate(screenName.CheckBox, {
                                            question: item,
                                            indexQuestion: getIndex(),
                                            fromScreen: "EditQuiz"
                                        })
                                        break
                                }
                            }}
                            style={[styles.btnIcon, { right: 5 }]}>
                            <Icon
                                name={"pencil"}
                                size={20}
                                color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    {/*Question detail*/}
                    <View style={styles.viewBottom}>
                        <Text style={styles.txt}>{item.question}</Text>
                        {
                            item.backgroundImage !== "" ?
                                <Image
                                    style={styles.quizBGR}
                                    source={{ uri: item.backgroundImage }}
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
                                item.answerList.map((item, index) => (
                                    <View key={item._id} style={styles.viewItemAnswerChoice}>
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
                                                <Text style={styles.txt}>{item.answer}</Text>
                                        }
                                    </View>
                                ))
                            }
                        </View>

                    </View>
                </View>
            </OpacityDecorator >
        );
    }

    return (
        <DraggableFlatList
            containerStyle={{ paddingHorizontal: paddingHorizonContainerDraggle, flex: 1 }}
            showsVerticalScrollIndicator={false}
            data={quiz.questionList}
            onDragEnd={({ data }) => dispatch(updateQuestionList(data))}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListHeaderComponent={() => (
                <View style={styles.containerHeader}>
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
                        handleOnPress={() => bottomSheetModalRef.current?.present()}
                    />
                </View>
            )}
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
    viewBottom: {
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
        alignItems: 'center'
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

export default DraggleListQuestion