import React from 'react'
import { View, Text, StyleSheet, StatusBar, ToastAndroid, ActivityIndicator } from 'react-native'
import { COLORS } from '../../../../common/theme'
import { BASE_URL } from '../../../../common/shareVarible'
import { useSelector } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../../../navigator/screens-name'
import FormButton from '../../../../components/FormButton'
import BottomSheetAddQuestion from './components/BottomSheetAddQuestion'
import DraggleListQuestion from './components/DraggleListQuestion'

const ManageQuestion = () => {

    const navigation = useNavigation()
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            {
                isLoading ?
                    <ActivityIndicator size={40} style={{ flex: 1 }} color={COLORS.primary} />
                    :
                    <BottomSheetModalProvider>
                        <View style={styles.container}>

                            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />

                            <View style={styles.topBar}>
                                <Text style={styles.title}>MANAGE QUESTION</Text>
                                {/* Save Quiz */}
                                <FormButton
                                    labelText="Save"
                                    isPrimary={true}
                                    style={{ paddingHorizontal: 20 }}
                                    handleOnPress={() => {
                                        Post_CreateQuiz()
                                    }}
                                />
                            </View>
                            {/* Questions list */}
                            <DraggleListQuestion bottomSheetModalRef={bottomSheetModalRef} />

                        </View>
                        {/* BottomSheet add Question */}
                        <BottomSheetAddQuestion bottomSheetModalRef={bottomSheetModalRef} />

                    </BottomSheetModalProvider>
            }
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        height: 60,
        borderBottomWidth: 1,
        borderColor: COLORS.gray,
        paddingHorizontal: 20,
    },
    title: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: "400"
    }
})

export default React.memo(ManageQuestion);
