import React from 'react'
import { Button, View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, Alert, TextInput, ToastAndroid, ActivityIndicator } from 'react-native'
import { COLORS } from '../../common/theme'
import { onlyNumber, BASE_URL } from '../../common/shareVarible'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from 'react-redux'
import { updateGame } from '../../redux/Slice/gameSlice'
import { GET_getAllQuiz } from '../../redux/Slice/listQuizSlice'
import { handleUserLogOut } from '../../redux/Slice/userSlice'
import socketServcies, { socketId } from '../../until/socketServices'
import Icon from 'react-native-vector-icons/AntDesign'
import ItemQuiz from './components/ItemQuiz'
import ModalLoading from '../../components/ModalLoading'

const HomeScreen = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const listQuiz = useSelector((state) => state.listQuiz)
    const [pin, setPin] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [page, setPage] = React.useState(1)

    const Post_Logout = async () => {
        setIsLoading(true)
        var url = BASE_URL + "/user/logout"
        try {
            const result = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.userId
                }),
            })
            setTimeout(() => {
                setIsLoading(false)
                navigation.navigate(screenName.SignIn)
            }, 2000)
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        socketServcies.on("player-joined", (message, game) => {
            if (message == "Game not found") {
                ToastAndroid.show(message, ToastAndroid.SHORT)
            }
            else {
                dispatch(updateGame(game._doc))
                ToastAndroid.show(message, ToastAndroid.SHORT)
                navigation.navigate(screenName.WaitingRoom)
            }
        })
    }, [])

    React.useEffect(() => {
        dispatch(GET_getAllQuiz({ token: user.token, currentPage: page }))
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.viewTopBar}>
                <Text style={{ fontSize: 20, color: COLORS.black }}>{user.email}</Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ alignItems: "center", justifyContent: "center" }}
                    onPress={() => Alert.alert(
                        "OOPS !!!",
                        "You really want to log out ?",
                        [
                            {
                                text: "Yes",
                                onPress: () => {
                                    Post_Logout()
                                    dispatch(handleUserLogOut())
                                }
                            },
                            {
                                text: "No"
                            }
                        ],
                    )}>
                    <Icon
                        name="logout"
                        size={20}
                        color={COLORS.error}
                    />
                    <Text style={{ marginTop: 5, fontSize: 12, color: COLORS.error }}>Logout</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={listQuiz.quizzes}
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor: COLORS.background,
                    paddingTop: 35,
                    paddingHorizontal: 10,
                }}
                numColumns={2}
                renderItem={({ item, index }) => <ItemQuiz item={item} index={index} />}
                ListHeaderComponent={
                    <View style={{ width: "100%", backgroundColor: COLORS.bgrForPrimary, alignItems: "center", borderRadius: 10, padding: 10, marginBottom: 35 }}>
                        <TextInput
                            placeholder='Type pin room'
                            maxLength={6}
                            keyboardType="numeric"
                            value={pin}
                            onChangeText={(txt) => setPin(onlyNumber(txt))}
                            style={{ height: 60, width: "100%", backgroundColor: COLORS.white, fontSize: 22, borderRadius: 20, paddingHorizontal: 15, marginBottom: 10 }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{ height: 60, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: COLORS.primary }}
                            onPress={() => {
                                socketServcies.emit("player-join", { user, socketId, pin })
                            }}>
                            <Text style={{ color: COLORS.white, fontSize: "600", fontSize: 20 }}>Join a game</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={
                    <View style={{ height: 60, width: "100%", alignItems: "center", justifyContent: "center", marginBottom: 120 }}>
                        {
                            listQuiz.isLoadingMore ?
                                <ActivityIndicator size={40} color={COLORS.primary} />
                                :
                                page == listQuiz.totalPage ?
                                    <Text style={{ fontSize: 16, color: COLORS.black, fontWeight: "bold" }}>LOAD ENOUGH DATA</Text>
                                    :
                                    <FormButton
                                        labelText="Load More"
                                        style={{ width: 120, borderRadius: 30 }}

                                        isPrimary={true}
                                        handleOnPress={() => { }}
                                    />
                        }
                    </View>
                }
            />
            {/*Modal loading appear when user log out */}
            <ModalLoading modalVisible={isLoading} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    viewTopBar: {
        backgroundColor: COLORS.white,
        elevation: 4,
        paddingHorizontal: 20,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    }
})

export default HomeScreen;
