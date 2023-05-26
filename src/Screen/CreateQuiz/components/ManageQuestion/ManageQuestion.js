import React from 'react'
import { View, Text, StyleSheet, StatusBar, ToastAndroid } from 'react-native'
import { COLORS } from '../../../../common/theme'
import { img } from '../../../../assets/index'
import { BASE_URL } from '../../../../common/shareVarible'
import { useSelector, useDispatch } from 'react-redux'
import { reloadAfterCreateQuiz } from '../../../../redux/Slice/whenToFetchApiSlice'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../../../navigator/screens-name'
import FormButton from '../../../../components/FormButton'
import BottomSheetAddQuestion from './components/BottomSheetAddQuestion'
import DraggleListQuestion from './components/DraggleListQuestion'
import Lottie from "lottie-react-native"
import Icon from "react-native-vector-icons/Ionicons"
import SearchBar from '../../../../components/SearchBar/SearchBar'

const ManageQuestion = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const newQuiz = useSelector((state) => state.newQuiz)
    const user = useSelector((state) => state.user)
    const [isLoading, setIsLoading] = React.useState(false)
    const bottomSheetModalRef = React.useRef(null)

    const Post_CreateQuiz = async () => {
        setIsLoading(true)
        var url = BASE_URL + "/quiz"
        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newQuiz),
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    dispatch(reloadAfterCreateQuiz())
                                    ToastAndroid.show(data.message, ToastAndroid.SHORT)
                                })
                        }
                    } else {
                        Promise.resolve(response.json())
                            .then((data) => {
                                ToastAndroid.show(data.message, ToastAndroid.SHORT)
                            })
                    }

                }).finally(() => {
                    setIsLoading(false)
                    navigation.navigate(screenName.ManageQuiz)
                })
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            {
                isLoading ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white }}>
                        <Lottie
                            source={img.loadingPrimary}
                            autoPlay
                            style={{ flex: 1 }} />
                    </View>
                    :
                    <>
                        <View style={styles.topBar}>
                            <View style={styles.viewTopInTopBar}>
                                <Text style={styles.title}>MANAGE QUESTION</Text>
                                {/* Save Quiz */}
                                <FormButton
                                    labelText="Save"
                                    isPrimary={true}
                                    style={{ paddingHorizontal: 40, paddingRight: 10 }}
                                    children={
                                        <View style={styles.viewIcon}>
                                            <Icon
                                                name={"md-cloud-upload-sharp"}
                                                size={25}
                                                color={COLORS.white}
                                            />
                                        </View>
                                    }
                                    handleOnPress={() => {
                                        if (newQuiz.questionList.length < 3) {
                                            ToastAndroid.show("You need to add at least 3 question", ToastAndroid.SHORT)
                                        } else {
                                            Post_CreateQuiz()
                                        }
                                    }}
                                />
                            </View>
                            {/*Search*/}
                            <SearchBar />
                        </View>
                        {/* Questions list */}
                        <DraggleListQuestion bottomSheetModalRef={bottomSheetModalRef} />

                        {/* BottomSheet add Question */}
                        <BottomSheetAddQuestion bottomSheetModalRef={bottomSheetModalRef} />
                    </>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    topBar: {
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderColor: COLORS.gray,
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    viewTopInTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    title: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: "400"
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default ManageQuestion
