import React from 'react'
import {
    View,
    Text,
    ScrollView,
    ToastAndroid,
    StyleSheet,
    LayoutAnimation,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native'
import storage from '@react-native-firebase/storage'
import { useDispatch, useSelector } from 'react-redux'
import { addNewQuestion, updateQuestionList, addNewQuestionInLastArray } from '../../../redux/Slice/newQuizSlice'
import { useNavigation, useRoute } from "@react-navigation/native"
import { screenName } from '../../../navigator/screens-name'
import { COLORS } from '../../../common/theme'
import { img } from '../../../assets/index'
import { arrTime, arrDifficulty, firebaseHeaderUrl, shuffleArray } from '../../../common/shareVarible'
import { TextInput } from 'react-native-gesture-handler'
import { DraxProvider, DraxView } from 'react-native-drax'
import ChooseFileBTN from '../../../components/ChooseFileBTN'
import FormInput from '../../../components/FormInput'
import FormButton from '../../../components/FormButton'
import Icon from "react-native-vector-icons/Entypo"
import Icon1 from "react-native-vector-icons/Octicons"
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Lottie from "lottie-react-native"


const DragAndSort = () => {

    const route = useRoute()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const newQuiz = useSelector((state) => state.newQuiz)
    const internet = useSelector((state) => state.internet)
    const pushOrUnshiftNewQuestion = useSelector((state) => state.whenToFetchApi.pushOrUnshiftNewQuestion)

    const [question, setQuestion] = React.useState('')
    const [fileUri, setFileUri] = React.useState({
        type: "image",
        path: "",
        start: 0,
        end: 0
    })
    const [timeAnswer, setTimeAnswer] = React.useState(10)
    const [difficulty, setDifficulty] = React.useState("easy")
    const [arrTrueAnswer, setArrTrueAnswer] = React.useState([{
        isCorrect: true,
        answer: "",
        img: "",
        order: 0
    }])
    const [arrWrongAnswer, setArrWrongAnswer] = React.useState([{
        isCorrect: false,
        answer: "",
        img: "",
        order: -1
    }])
    const [isDraggle, setIsDraggle] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const animBtnMoreCorrect = React.useRef(new Animated.Value(0)).current
    const animBtnMoreWrong = React.useRef(new Animated.Value(0)).current
    const isAnimating = React.useRef(false)

    const handleNavigation = () => {
        if (route.params?.fromScreen == "EditQuiz") {
            navigation.navigate(screenName.ListQuestion)
        } else {
            navigation.navigate(screenName.ManageQuestion)
        }
    }

    React.useEffect(() => {
        if (internet.isOnlineStatus == false) {
            if (isLoading) {
                setIsLoading(false)
                ToastAndroid.show('Network connection suddenly lost', ToastAndroid.SHORT)
            }
        }
    }, [internet])

    React.useEffect(() => {
        if (route.params?.question !== undefined) {
            var newTrueArrAnswer = []
            var newWrongArrAnswer = []

            setQuestion(route.params.question.question)
            setTimeAnswer(route.params.question.time)
            setDifficulty(route.params.question.difficulty)
            route.params.question.answerList.forEach(answer => {
                answer.isCorrect ?
                    newTrueArrAnswer.push(answer)
                    :
                    newWrongArrAnswer.push(answer)
            })
            newTrueArrAnswer.sort((a, b) => a.order - b.order)
            setArrTrueAnswer(newTrueArrAnswer)
            setArrWrongAnswer(newWrongArrAnswer)

            if (route.params.question.backgroundImage != "") {
                setFileUri({
                    type: "image",
                    path: route.params.question.backgroundImage,
                    start: 0,
                    end: 0
                })
            }
            else if (route.params.question.video != "") {
                setFileUri({
                    type: "video",
                    path: route.params.question.video,
                    start: 0,
                    end: 0
                })
            }
            else if (route.params.question.youtube != "") {
                setFileUri({
                    type: "youtube",
                    path: route.params.question.youtube,
                    start: route.params.question.startTime,
                    end: route.params.question.endTime
                })
            }
            else {
                setFileUri({
                    type: "image",
                    path: "",
                    startTime: 0,
                    endTime: 0
                })
            }

        }
    }, [])

    const checkQuantityAnswer = () => {
        if (arrWrongAnswer.length + arrTrueAnswer.length >= 20) {
            return true
        }
        return false
    }

    const handleContinue = async () => {

        //Check empty
        if (question.trim().length == 0) {
            ToastAndroid.show("Empty Question", ToastAndroid.SHORT)
        }
        else if (arrTrueAnswer.length <= 1) {
            ToastAndroid.show("You need to add at least 2 answer", ToastAndroid.SHORT)
        }
        else if (arrTrueAnswer.some(trueAnswer => trueAnswer.answer.trim().length == 0)) {
            ToastAndroid.show("Empty correct answer", ToastAndroid.SHORT)
        }
        else if (arrWrongAnswer.some(wrongAnswerent => wrongAnswerent.answer.trim().length == 0)) {
            ToastAndroid.show("Empty wrong answer", ToastAndroid.SHORT)
        }
        else if (fileUri.type == "youtube" && fileUri.start == 0 && fileUri.end == 0) {
            ToastAndroid.show("You haven't set start and end time for video youtube. Play video and then set time", ToastAndroid.SHORT)
        }
        else {

            if (internet.isOnlineStatus) {
                setIsLoading(true)

                // Upload Image/Video/Youtube and get UrlImage/UrlVideo for Question 
                var path = fileUri.path
                var imageUrl = ''
                var videoUrl = ''
                var youtubeUrl = ''

                if (path != '' && path.includes(firebaseHeaderUrl) == false && fileUri.type != "youtube") {

                    const reference = storage().ref(path.slice(path.lastIndexOf("/") + 1, path.length))
                    await reference.putFile(path).catch(error => {
                        setIsLoading(false)
                        ToastAndroid.show(String(error), ToastAndroid.SHORT)
                    })

                    if (fileUri.type == "image") {
                        //Get url of image was upload on Firebase
                        imageUrl = await reference.getDownloadURL().catch(error => {
                            setIsLoading(false)
                            ToastAndroid.show(String(error), ToastAndroid.SHORT)
                        })
                    } else if (fileUri.type == "video") {
                        //Get url of Video was upload on Firebase
                        videoUrl = await reference.getDownloadURL().catch(error => {
                            setIsLoading(false)
                            ToastAndroid.show(String(error), ToastAndroid.SHORT)
                        })
                    }

                } else {
                    if (fileUri.type == "image") {
                        imageUrl = path
                    } else if (fileUri.type == "video") {
                        videoUrl = path
                    } else if (fileUri.type == "youtube") {
                        youtubeUrl = path
                    }
                }

                var arrAnswer = shuffleArray([...arrTrueAnswer, ...arrWrongAnswer])

                try {
                    //if route.params?.question !== undefine then just update questionList else add new question    
                    if (route.params?.question !== undefined) {

                        // update question
                        let newQuestionList = [...newQuiz.questionList]
                        newQuestionList[route.params.indexQuestion] = {
                            ...newQuestionList[route.params.indexQuestion],
                            question: question,
                            time: timeAnswer,
                            backgroundImage: imageUrl,
                            video: videoUrl,
                            youtube: youtubeUrl,
                            startTime: fileUri.start,
                            endTime: fileUri.end,
                            answerList: arrAnswer,
                            difficulty: difficulty,
                        }
                        ToastAndroid.show('Update success', ToastAndroid.SHORT)
                        dispatch(updateQuestionList(newQuestionList))
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                        handleNavigation()

                    } else {

                        //Add new Question
                        var newQuestion = {
                            questionType: "DragAndSort",
                            question: question,
                            time: timeAnswer,
                            backgroundImage: imageUrl,
                            video: videoUrl,
                            youtube: youtubeUrl,
                            startTime: fileUri.start,
                            endTime: fileUri.end,
                            answerList: arrAnswer,
                            difficulty: difficulty,
                            category: newQuiz.categories[0],
                            tempQuestionId: "question" + newQuiz.numberOfQuestionsOrigin
                        }

                        if (pushOrUnshiftNewQuestion == "unshift") {
                            dispatch(addNewQuestion(newQuestion))
                        } else if (pushOrUnshiftNewQuestion == "push") {
                            dispatch(addNewQuestionInLastArray(newQuestion))
                        }

                        ToastAndroid.show('Add success', ToastAndroid.SHORT)
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                        handleNavigation()
                    }

                    // Reset
                    setQuestion('')
                    setArrTrueAnswer([{
                        isCorrect: false,
                        answer: "",
                        img: ""
                    }])
                    setFileUri({
                        type: "image",
                        path: "",
                        start: 0,
                        end: 0
                    })

                    setIsLoading(false)
                } catch (error) {
                    ToastAndroid.show(String(error), ToastAndroid.SHORT)
                }
            } else {
                ToastAndroid.show('No network connection', ToastAndroid.SHORT)
            }
        }
    }

    return (
        <View style={styles.container}>
            {
                isLoading ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white }}>
                        <Lottie
                            source={img.loadingPrimary}
                            autoPlay
                            style={{ flex: 1 }} />
                    </View>
                    :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.scrollView}>
                        <Text style={styles.title}>Drag And Sort</Text>
                        <Text style={styles.txtNameQuiz}>{newQuiz.name}</Text>
                        <FormInput
                            labelText="Question"
                            onChangeText={val => setQuestion(val)}
                            value={question}
                            maxLength={1000000}
                            style={{ maxHeight: 200 }}
                            multiline={true}
                        />

                        {/* Image/Video/Youtube for Question upload */}
                        <ChooseFileBTN setFileUri={setFileUri} fileUri={fileUri} />

                        {/*Break line between Question and Option */}
                        <View style={styles.containerLineHorizon}>
                            <View style={[styles.lineHorizon, { marginRight: 5, flex: 1 }]} />
                            <Text>answer choice</Text>
                            <View style={[styles.lineHorizon, { marginLeft: 5, flex: 5 }]} />
                        </View>

                        {/* Options */}
                        <DraxProvider>
                            <View style={styles.containerBtnOption}>

                                <Animated.View style={{
                                    transform: [{
                                        translateX: animBtnMoreCorrect.interpolate({
                                            inputRange: [0, 0.5, 1, 1.5, 2],
                                            outputRange: [0, -15, 0, 15, 0]
                                        })
                                    }]
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnMoreCorrect}
                                        disabled={checkQuantityAnswer()}
                                        onPress={() => {
                                            if (isAnimating.current == false) {
                                                isAnimating.current = true
                                                Animated.timing(animBtnMoreCorrect, {
                                                    toValue: 2,
                                                    duration: 150,
                                                    easing: Easing.bounce,
                                                    useNativeDriver: true,
                                                }).start(() => Animated.timing(animBtnMoreCorrect, {
                                                    toValue: 0,
                                                    duration: 150,
                                                    easing: Easing.bounce,
                                                    useNativeDriver: true,
                                                }).start(() => {
                                                    LayoutAnimation.configureNext({
                                                        duration: 300,
                                                        create: { type: 'linear', property: "scaleXY" },
                                                        update: { type: 'linear', property: "scaleXY" },
                                                        delete: { type: 'linear', property: "scaleXY" }
                                                    });
                                                    var newData = [...arrTrueAnswer]
                                                    newData.push({
                                                        isCorrect: true,
                                                        answer: "",
                                                        img: "",
                                                        order: newData.length
                                                    })
                                                    setArrTrueAnswer(newData)

                                                    isAnimating.current = false
                                                }))

                                            }
                                        }}
                                    >
                                        <Icon1
                                            name={"diff-added"}
                                            color={checkQuantityAnswer() ? COLORS.gray : COLORS.primary}
                                            size={28}
                                        />
                                        <Text style={{ color: checkQuantityAnswer() ? COLORS.gray : COLORS.primary, fontWeight: "700" }}>Correct</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                                <DraxView
                                    style={styles.draxViewDeleteCorrect}
                                    receivingStyle={styles.receiving}
                                    onReceiveDragDrop={(event) => {
                                        LayoutAnimation.configureNext({
                                            duration: 300,
                                            create: { type: 'linear', property: "scaleXY" },
                                            update: { type: 'linear', property: "scaleXY" },
                                            delete: { type: 'linear', property: "scaleXY" },
                                        });
                                        var newData = [...arrTrueAnswer]
                                        newData.splice(event.dragged.payload.order, 1)
                                        for (let i = event.dragged.payload.order; i < newData.length; i++) {
                                            newData[i].order = newData[i].order - 1
                                        }
                                        setArrTrueAnswer(newData)
                                    }}
                                >
                                    <Icon2
                                        name={"trash-can-outline"}
                                        size={28}
                                    />
                                    <Text>Drag here to delete</Text>
                                </DraxView>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.btnReorderOrTypeText}
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                                        setIsDraggle(!isDraggle)
                                    }}
                                >
                                    {
                                        isDraggle ?
                                            <Icon1
                                                name={"list-ordered"}
                                                size={28}
                                                color={COLORS.primary}
                                            />
                                            :
                                            <Icon2
                                                name={"file-document-edit-outline"}
                                                size={28}
                                                color={COLORS.primary}
                                            />
                                    }
                                    <Text style={styles.txtReorderOrTypeText}>{isDraggle ? "Reorder" : "Type text"}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.containerOption} >
                                {
                                    arrTrueAnswer.map((item, index) => (
                                        <DraxView
                                            key={index}
                                            draggable={isDraggle}
                                            style={styles.draxViewCorrectOption}
                                            draggingStyle={styles.dragging}
                                            dragReleasedStyle={styles.dragging}
                                            receivingStyle={styles.receiving}
                                            hoverDraggingStyle={styles.hoverDragging}
                                            dragPayload={item}
                                            longPressDelay={100}
                                            onReceiveDragDrop={(event) => {
                                                var newData = [...arrTrueAnswer]
                                                let temp = newData[index]
                                                newData[index] = {
                                                    ...newData[event.dragged.payload.order],
                                                    order: index
                                                }
                                                newData[event.dragged.payload.order] = {
                                                    ...temp,
                                                    order: event.dragged.payload.order
                                                }
                                                setArrTrueAnswer(newData)
                                            }}
                                        >
                                            <TextInput
                                                style={styles.txtInputCorrectOption}
                                                placeholder='type me'
                                                selectionColor={COLORS.black}
                                                maxLength={15}
                                                editable={!isDraggle}
                                                value={item.answer}
                                                onChangeText={(txt) => {
                                                    var newData = [...arrTrueAnswer]
                                                    newData[index].text = txt
                                                    newData[index].answer = txt
                                                    setArrTrueAnswer(newData)
                                                }}
                                            />
                                        </DraxView>
                                    ))
                                }
                            </View>

                        </DraxProvider >

                        {/**More Wrong */}
                        <>
                            <Animated.View style={{
                                marginBottom: 10,
                                transform: [{
                                    translateX: animBtnMoreWrong.interpolate({
                                        inputRange: [0, 0.5, 1, 1.5, 2],
                                        outputRange: [0, -15, 0, 15, 0]
                                    })
                                }]
                            }}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.btnMoreWrong}
                                    disabled={checkQuantityAnswer()}
                                    onPress={() => {
                                        if (isAnimating.current == false) {
                                            isAnimating.current = true
                                            Animated.timing(animBtnMoreWrong, {
                                                toValue: 2,
                                                duration: 150,
                                                easing: Easing.bounce,
                                                useNativeDriver: true,
                                            }).start(() => Animated.timing(animBtnMoreWrong, {
                                                toValue: 0,
                                                duration: 150,
                                                easing: Easing.bounce,
                                                useNativeDriver: true,
                                            }).start(() => {
                                                LayoutAnimation.configureNext({
                                                    duration: 300,
                                                    create: { type: 'linear', property: "scaleXY" },
                                                    update: { type: 'linear', property: "scaleXY" },
                                                    delete: { type: 'linear', property: "scaleXY" }
                                                });
                                                var newData = [...arrWrongAnswer]
                                                newData.push({
                                                    isCorrect: false,
                                                    answer: "",
                                                    img: "",
                                                    order: -1
                                                })
                                                setArrWrongAnswer(newData)

                                                isAnimating.current = false
                                            }))

                                        }
                                    }}
                                >
                                    <Icon1
                                        name={"diff-added"}
                                        color={checkQuantityAnswer() ? COLORS.gray : COLORS.primary}
                                        size={28}
                                    />
                                    <Text style={{ color: checkQuantityAnswer() ? COLORS.gray : COLORS.primary, fontWeight: "700" }}>Wrong</Text>
                                </TouchableOpacity>
                            </Animated.View>

                            <View style={styles.containerOption}>
                                {
                                    arrWrongAnswer.map((item, index) => (
                                        <View
                                            key={index}
                                            style={styles.viewWrongOption}
                                        >
                                            <TextInput
                                                style={styles.txtInputWrongOption}
                                                placeholder='type me'
                                                selectionColor={COLORS.black}
                                                maxLength={15}
                                                value={item.answer}
                                                onChangeText={(txt) => {
                                                    var newData = [...arrWrongAnswer]
                                                    newData[index].text = txt
                                                    newData[index].answer = txt
                                                    setArrWrongAnswer(newData)
                                                }}
                                            />
                                            <TouchableOpacity style={styles.btnDeletWrongAnswer}
                                                onPress={() => {
                                                    LayoutAnimation.configureNext({
                                                        duration: 300,
                                                        create: { type: 'linear', property: "scaleXY" },
                                                        update: { type: 'linear', property: "scaleXY" },
                                                        delete: { type: 'linear', property: "scaleXY" },
                                                    });
                                                    var newData = [...arrWrongAnswer]
                                                    newData.splice(index, 1)
                                                    setArrWrongAnswer(newData)
                                                }}
                                            >
                                                <Icon2
                                                    name={"trash-can-outline"}
                                                    size={23}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }
                            </View>
                        </>


                        {/*Break line between  Option and Time*/}
                        <View style={[styles.containerLineHorizon, { marginTop: 0 }]}>
                            <View style={[styles.lineHorizon, { marginRight: 5, flex: 1 }]} />
                            <Text>time answer( second )</Text>
                            <View style={[styles.lineHorizon, { marginLeft: 5, flex: 5 }]} />
                        </View>
                        {/* Time option */}
                        <View style={styles.containerTimeAnswer}>
                            {
                                arrTime.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.rowItemTimeAnswer, { backgroundColor: item == timeAnswer ? COLORS.primary : COLORS.white }]}
                                        activeOpacity={0.6}
                                        onPress={() => setTimeAnswer(item)}
                                    >
                                        <Text style={[styles.txtTimeAnswer, { color: item == timeAnswer ? COLORS.white : COLORS.primary }]}>{item}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>

                        {/*Break line between Time and Difficulty*/}
                        <View style={[styles.containerLineHorizon, { marginTop: 0 }]}>
                            <View style={[styles.lineHorizon, { marginRight: 5, flex: 1 }]} />
                            <Text>difficulty</Text>
                            <View style={[styles.lineHorizon, { marginLeft: 5, flex: 5 }]} />
                        </View>
                        {/* Difficulty */}
                        <View style={styles.containerDifficulty}>
                            {
                                arrDifficulty.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.rowItemDifficulty, { backgroundColor: item == difficulty ? COLORS.primary : COLORS.white }]}
                                        activeOpacity={0.6}
                                        onPress={() => setDifficulty(item)}
                                    >
                                        <Text style={[styles.txtDifficulty, { color: item == difficulty ? COLORS.white : COLORS.primary }]}>{item}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>

                        {/*Button continue to handle continue step */}
                        <FormButton
                            labelText="Continue"
                            handleOnPress={() => {
                                handleContinue()
                            }}
                            children={
                                <View style={styles.viewIcon}>
                                    <Icon
                                        name={"arrow-with-circle-right"}
                                        size={20}
                                        color={COLORS.white}
                                    />
                                </View>
                            }
                        />
                        {/*Button cancel to go back ManageQuestion screen */}
                        <FormButton
                            labelText="Cancel"
                            isPrimary={false}
                            disabled={isLoading}
                            handleOnPress={() => {
                                handleNavigation()
                            }}
                            style={{ marginVertical: 20 }}
                        />
                    </ScrollView>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20
    },
    rowItemAnswer: {
        marginBottom: 20
    },
    viewWrongOption: {
        height: 50,
        flexDirection: "row",
        padding: 3,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 5,
        marginBottom: 5,
        backgroundColor: COLORS.bgrForPrimary,
    },
    rowItemTimeAnswer: {
        flexGrow: 1,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 5
    },
    rowItemDifficulty: {
        flexGrow: 1,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 5
    },
    containerBtnOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 20
    },
    containerOption: {
        flexDirection: 'row',
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 40
    },
    containerTimeAnswer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 40
    },
    containerDifficulty: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 40
    },
    containerBtnIcons: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: 15,
        width: "100%"
    },
    containerLineHorizon: {
        marginVertical: 40,
        flexDirection: "row",
        alignItems: "center"
    },
    draxViewDeleteCorrect: {
        alignItems: "center",
        justifyContent: "center",
        height: 80, width: 160,
        borderRadius: 30,
        borderWidth: 2,
        borderBottomWidth: 10,
        borderColor: "#CBCDD1",
        backgroundColor: COLORS.gray
    },
    draxViewCorrectOption: {
        height: 60,
        padding: 3,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderBottomWidth: 8,
        borderColor: COLORS.gray
    },
    dragging: {
        opacity: 0.2
    },
    hoverDragging: {
        elevation: 8,
        shadowColor: "blue",
        transform: [{ rotate: '10deg' }],
    },
    receiving: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnReorderOrTypeText: {
        width: 68,
        alignItems: "center",
        justifyContent: 'center'
    },
    btnMoreCorrect: {
        width: 68,
        alignItems: "center",
        justifyContent: 'center'
    },
    btnMoreWrong: {
        width: 68,
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: "flex-end"
    },
    btnDeletWrongAnswer: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    txtInputCorrectOption: {
        flex: 1,
        color: COLORS.black,
        textAlign: "center"
    },
    txtInputWrongOption: {
        height: 35,
        color: COLORS.black,
        textAlign: "center"
    },
    txtReorderOrTypeText: {
        color: COLORS.primary,
        fontWeight: "700"
    },
    txtNameQuiz: {
        textAlign: 'center',
        marginBottom: 20
    },
    txtTimeAnswer: {
        fontSize: 20,
        fontWeight: "bold"
    },
    txtDifficulty: {
        fontSize: 20,
        fontWeight: "bold"
    },
    lineHorizon: {
        borderWidth: 0.8,
        borderColor: COLORS.gray,
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    img: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    }
})

export default DragAndSort
