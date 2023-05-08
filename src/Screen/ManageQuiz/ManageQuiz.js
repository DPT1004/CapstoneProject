import React from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, ToastAndroid, RefreshControl, TouchableOpacity } from 'react-native'
import { COLORS } from '../../common/theme'
import { BASE_URL } from '../../common/shareVarible'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useSelector } from 'react-redux'
import ItemQuiz from './components/ItemQuiz'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import FormButton from '../../components/FormButton'

const ManageQuiz = () => {

    const navigation = useNavigation()
    const user = useSelector((state) => state.user)

    const [allQuizzes, setAllQuizzes] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const handleSetRefreshing = (status) => {
        setRefreshing(status)
    }

    const getUserQuizzes = async () => {
        setRefreshing(true)
        var url = BASE_URL + "/quiz/creator/" + user.userId
        try {
            await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    setAllQuizzes(data)
                                })

                        }
                    } else {
                        Promise.resolve(response.json())
                            .then((data) => {
                                ToastAndroid.show(data.message, ToastAndroid.SHORT)
                            })
                    }

                }).finally(() => setRefreshing(false))
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        if (user.token !== "") {
            getUserQuizzes()
        }
    }, [user])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
                    <View style={styles.topBar}>
                        <Text style={styles.title}>MANAGE QUIZ</Text>
                        <FormButton
                            labelText="Create quiz"
                            isPrimary={true}
                            style={{ paddingHorizontal: 20 }}
                            handleOnPress={() => {
                                navigation.navigate(screenName.CreateQuiz)
                            }}
                        />
                    </View>
                    {/* Quiz list */}
                    <FlatList
                        data={allQuizzes}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => getUserQuizzes()}
                                progressBackgroundColor={COLORS.white}
                                colors={[COLORS.primary]} />
                        }
                        showsVerticalScrollIndicator={false}
                        style={{
                            backgroundColor: COLORS.background,
                            paddingVertical: 20,
                            paddingHorizontal: 10
                        }}
                        renderItem={({ item, index }) => (
                            <ItemQuiz
                                item={item}
                                index={index}
                                setRefreshing={(status) => handleSetRefreshing(status)} />
                        )}
                    />
                </View>
            </BottomSheetModalProvider>
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

export default ManageQuiz;
