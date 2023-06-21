import React from 'react'
import {
    View,
    Text,
    ScrollView,
    ToastAndroid,
    StyleSheet,
    LayoutAnimation,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'
import storage from '@react-native-firebase/storage'
import { useDispatch, useSelector } from 'react-redux'
import { addNewQuestion, updateQuestionList } from '../../../redux/Slice/newQuizSlice'
import { useNavigation, useRoute } from "@react-navigation/native"
import { screenName } from '../../../navigator/screens-name'
import { COLORS } from '../../../common/theme'
import { img } from '../../../assets/index'
import { arrTime, arrDifficulty, firebaseHeaderUrl } from '../../../common/shareVarible'
import ChooseFileBTN from '../../../components/ChooseFileBTN'
import FormInput from '../../../components/FormInput'
import FormButton from '../../../components/FormButton'
import Icon from "react-native-vector-icons/Entypo"
import Icon1 from "react-native-vector-icons/Octicons"
import Lottie from "lottie-react-native"


const FillInTheBlank = () => {

    const route = useRoute()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const newQuiz = useSelector((state) => state.newQuiz)
    const internet = useSelector((state) => state.internet)

    const [question, setQuestion] = React.useState('')
    const [fileUri, setFileUri] = React.useState({
        type: "image",
        path: "",
        start: 0,
        end: 0
    })
    const [timeAnswer, setTimeAnswer] = React.useState(10)
    const [difficulty, setDifficulty] = React.useState("easy")
    const [arrAnswer, setArrAnswer] = React.useState([{
        isCorrect: true,
        answer: "",
        img: ""
    }])
    const [isLoading, setIsLoading] = React.useState(false)


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

            setQuestion(route.params.question.question)
            setTimeAnswer(route.params.question.time)
            setArrAnswer(route.params.question.answerList)
            setDifficulty(route.params.question.difficulty)
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

    const handleContinue = async () => {

        //Check empty
        if (question == "") {
            ToastAndroid.show("Empty Question", ToastAndroid.SHORT)
        }
        else if (arrAnswer.length <= 1) {
            ToastAndroid.show("You need to add at least 2 answer", ToastAndroid.SHORT)
        }
        else if (arrAnswer.some(element => element.answer == "" && element.img == "")) {
            ToastAndroid.show("Empty answer", ToastAndroid.SHORT)
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
                        dispatch(addNewQuestion({
                            questionType: "Fill-In-The-Blank",
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
                        }))
                        ToastAndroid.show('Add success', ToastAndroid.SHORT)
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                        handleNavigation()
                    }

                    // Reset
                    setQuestion('')
                    setArrAnswer([{
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
                        <Text style={styles.title}>Fill In The Blank</Text>
                        <Text style={styles.txtNameQuiz}>{newQuiz.name}</Text>
                        <FormInput
                            labelText="Question"
                            onChangeText={val => setQuestion(val)}
                            showCharCount={true}
                            value={question}
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
                        <View>
                            {
                                arrAnswer.map((item, index) => (
                                    <View key={index} style={styles.rowItemAnswer}>
                                        <View style={styles.containerBtnIcons}>

                                            {/* Delete answer */}
                                            <TouchableHighlight
                                                style={styles.btnDeleteAnswer}
                                                underlayColor={"rgba(0, 0, 0, 0.5)"}
                                                onPress={() => {
                                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

                                                    let newArrAnswer = [...arrAnswer]
                                                    newArrAnswer.splice(index, 1)
                                                    setArrAnswer(newArrAnswer)
                                                }}
                                            >
                                                <Icon
                                                    name="trash"
                                                    size={20}
                                                    color={COLORS.black}
                                                />
                                            </TouchableHighlight>

                                            {/* Choose correct answer */}
                                            <Icon1
                                                name="check-circle-fill"
                                                size={20}
                                                style={{ position: "absolute", right: 0 }}
                                                color={COLORS.success}
                                            />
                                        </View>
                                        {/** TextInput to type text for answer */}
                                        <FormInput
                                            key={index}
                                            labelText={"Option " + Number(index + 1)}
                                            onChangeText={val => {
                                                let newArrAnswer = [...arrAnswer]
                                                newArrAnswer[index] = {
                                                    ...newArrAnswer[index],
                                                    answer: val
                                                }
                                                setArrAnswer(newArrAnswer)
                                            }}
                                            maxLength={1000}
                                            value={item.answer}
                                        />
                                    </View>
                                ))

                            }
                        </View>

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

                        {/*Button add more answer */}
                        <FormButton
                            labelText="More Answer"
                            handleOnPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

                                let newArrAnswer = [...arrAnswer, {
                                    isCorrect: true,
                                    answer: "",
                                    img: ""
                                }]
                                setArrAnswer(newArrAnswer)
                            }}
                            style={{
                                marginBottom: 20,
                            }}
                            children={
                                <View style={styles.viewIcon}>
                                    <Icon
                                        name={"circle-with-plus"}
                                        size={20}
                                        color={COLORS.white}
                                    />
                                </View>
                            }
                        />
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
                            style={{
                                marginVertical: 20,
                            }}
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
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnDeleteAnswer: {
        padding: 5,
        borderRadius: 30
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

export default FillInTheBlank
