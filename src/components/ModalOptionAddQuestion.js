import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Text, TextInput, ToastAndroid, LayoutAnimation } from 'react-native'
import { COLORS } from '../common/theme'
import { BASE_URL, arrDifficulty, arrQuantityQuestion } from '../common/shareVarible'
import { useDispatch, useSelector } from 'react-redux'
import { addManyNewQuestion, addManyNewQuestionInLastArray } from '../redux/Slice/newQuizSlice'
import { Picker } from '@react-native-picker/picker'
import Icon1 from "react-native-vector-icons/MaterialIcons"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FormButton from '../components/FormButton'

const bgrPicker = COLORS.gray
const colorTxtPicker = COLORS.black
const sizeIcon = 20
const sizeTxtPicker = 16

const ModalOptionAddQuestion = ({ modalVisible, onPressVisible }) => {

    const dispatch = useDispatch()
    const quiz = useSelector((state) => state.newQuiz)
    const pushOrUnshiftNewQuestion = useSelector((state) => state.whenToFetchApi.pushOrUnshiftNewQuestion)

    const [categories, setCategories] = React.useState([])
    const [isLoadingCateogries, setIsLoadingCateogries] = React.useState(false)
    const [chooseCategory, setChooseCategory] = React.useState("Math")
    const [difficulty, setDifficulty] = React.useState("easy")
    const [quantityQuestion, setQuantityQuestion] = React.useState("1")
    const [isLoading, setIsLoading] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const GET_AllCategory = async () => {

        try {
            setIsLoadingCateogries(true)
            var url = BASE_URL + "/category"
            await fetch(url, {
                method: "GET"
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    setCategories(data)
                                })
                        }
                    }
                }).finally(() => setIsLoadingCateogries(false))
        } catch (error) {
            setIsLoadingCateogries(false)
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    const handleAsyncDispatch = (data) => {
        try {
            data.map((question, index) => {
                question.tempQuestionId = "question" + Number(quiz.numberOfQuestionsOrigin + index)
                delete question._id
            })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            if (pushOrUnshiftNewQuestion == "unshift") {
                dispatch(addManyNewQuestion(data))
            } else if (pushOrUnshiftNewQuestion == "push") {
                dispatch(addManyNewQuestionInLastArray(data))
            }

        } catch (error) {
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    const Post_GetRandomQuestionWithCondition = async () => {
        try {
            setIsLoading(true)
            var url = BASE_URL + "/questionBank/getRandomQuestion"
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantity: quantityQuestion,
                    category: chooseCategory,
                    difficulty: difficulty,
                    searchQuery: searchQuery
                })
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    handleAsyncDispatch(data)
                                    if (data.length == 0) {
                                        ToastAndroid.show(`Not found any question`, ToastAndroid.SHORT)
                                    }
                                    else if (data.length < quantityQuestion) {
                                        ToastAndroid.show(`Only found ${data.length} question`, ToastAndroid.SHORT)
                                    }
                                    else {
                                        ToastAndroid.show("Add question success", ToastAndroid.SHORT)
                                    }
                                })
                        }
                    }
                }).finally(() => {
                    setIsLoading(false)
                    onPressVisible()
                })
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        GET_AllCategory()
    }, [])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.containerModal}>
                <View style={styles.childModal}>
                    <View style={styles.viewTop}>
                        <TextInput
                            style={{ flex: 1, marginLeft: 5 }}
                            maxLength={90}
                            selectionColor={COLORS.primary}
                            placeholder='What you want to looking for...'
                            onChangeText={(txt) => setSearchQuery(txt)}
                        />

                        {/*Button close modal */}
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            activeOpacity={0.4}
                            onPress={onPressVisible} >
                            <Icon
                                name={"close"}
                                size={20}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.viewBottom}>

                        <Text style={styles.txt}>Quantity question</Text>
                        <View style={styles.dropDown}>
                            <View style={styles.iconDropDown}>
                                <Icon
                                    name="arrow-down-drop-circle-outline"
                                    color={colorTxtPicker}
                                    size={sizeIcon}
                                />
                            </View>
                            <Picker
                                mode="dropdown"
                                enabled={!isLoading}
                                style={{ backgroundColor: "transparent", color: "transparent" }}
                                dropdownIconColor={bgrPicker}
                                selectionColor={"transp"}
                                selectedValue={quantityQuestion}
                                onValueChange={(item) =>
                                    setQuantityQuestion(item)
                                }>
                                {
                                    arrQuantityQuestion.map((item, index) => (
                                        <Picker.Item
                                            color={colorTxtPicker}
                                            key={index}
                                            label={item}
                                            value={item} />
                                    ))
                                }
                            </Picker>
                            <View style={styles.viewItemPicker}>
                                <Text style={styles.txtItemPicker}>{quantityQuestion}</Text>
                            </View>
                        </View>

                        <Text style={styles.txt}>Choose difficulty</Text>
                        <View style={styles.dropDown}>
                            <View style={styles.iconDropDown}>
                                <Icon
                                    name="arrow-down-drop-circle-outline"
                                    color={colorTxtPicker}
                                    size={sizeIcon}
                                />
                            </View>
                            <Picker
                                mode="dropdown"
                                enabled={!isLoading}
                                style={{ backgroundColor: "transparent", color: "transparent" }}
                                dropdownIconColor={bgrPicker}
                                selectedValue={difficulty}
                                onValueChange={(item) =>
                                    setDifficulty(item)
                                }>
                                {
                                    arrDifficulty.map((item, index) => (
                                        <Picker.Item
                                            color={colorTxtPicker}
                                            key={index}
                                            label={item}
                                            value={item} />
                                    ))
                                }
                            </Picker>
                            <View style={styles.viewItemPicker}>
                                <Text style={styles.txtItemPicker}>{difficulty}</Text>
                            </View>
                        </View>

                        <Text style={styles.txt}>Choose category</Text>
                        {
                            isLoadingCateogries ? <ActivityIndicator size={40} color={COLORS.gray} style={{ alignSelf: "center" }} />
                                :
                                <View style={styles.dropDown}>
                                    <View style={styles.iconDropDown}>
                                        <Icon
                                            name="arrow-down-drop-circle-outline"
                                            color={colorTxtPicker}
                                            size={sizeIcon}
                                        />
                                    </View>
                                    <Picker
                                        mode="dropdown"
                                        enabled={!isLoading}
                                        style={{ backgroundColor: "transparent", color: "transparent" }}
                                        dropdownIconColor={bgrPicker}
                                        selectedValue={chooseCategory}
                                        onValueChange={(item) =>
                                            setChooseCategory(item)
                                        }>
                                        {
                                            categories.map((item, index) => (
                                                <Picker.Item
                                                    color={colorTxtPicker}
                                                    key={index}
                                                    label={item.name}
                                                    value={item.name} />
                                            ))
                                        }
                                    </Picker>
                                    <View style={styles.viewItemPicker}>
                                        <Text style={styles.txtItemPicker}>{chooseCategory}</Text>
                                    </View>
                                </View>
                        }
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    <FormButton
                        labelText="Add Question"
                        isPrimary={true}
                        isLoading={isLoading}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon1
                                    name={"add-circle-outline"}
                                    size={20}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        style={{
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0
                        }}
                        handleOnPress={() => {
                            if (chooseCategory == "") {
                                ToastAndroid.show("Please choose category", ToastAndroid.SHORT)
                            } else {
                                Post_GetRandomQuestionWithCondition()
                            }
                        }}
                    />
                </View>
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    containerModal: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    childModal: {
        height: "60%",
        width: "80%",
        backgroundColor: COLORS.white,
        borderRadius: 5,
    },
    viewTop: {
        height: 40,
        width: "100%",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: COLORS.white,
        elevation: 4,
        flexDirection: "row",
        alignItems: 'center'
    },
    viewBottom: {
        flex: 1,
        paddingHorizontal: 5,
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewItemPicker: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    dropDown: {
        backgroundColor: bgrPicker,
        borderRadius: 5,
        height: 45
    },
    btnCloseModal: {
        height: 30,
        width: 30,
        padding: 5,
        borderRadius: 5,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5
    },
    txt: {
        alignSelf: "center",
        color: COLORS.error,
        fontWeight: "bold",
        marginTop: 25,
        fontSize: 16,
        marginBottom: 10
    },
    txtItemPicker: {
        color: colorTxtPicker,
        fontSize: sizeTxtPicker
    },
    iconDropDown: {
        position: "absolute",
        bottom: 0,
        top: 0,
        right: 10,
        alignItems: "center",
        justifyContent: "center",
    }

})

export default ModalOptionAddQuestion