import React from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, RefreshControl, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator, Button } from 'react-native'
import { COLORS } from '../../common/theme'
import { onlyNumber } from '../../common/shareVarible'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from 'react-redux'
import { updateGame } from '../../redux/Slice/gameSlice'
import { GET_getQuizBySearch, GET_refreshListQuiz, setPage } from '../../redux/Slice/listQuizSlice'
import socketServcies, { socketId } from '../../until/socketServices'
import FormButton from '../../components/FormButton'
import ItemQuiz from './components/ItemQuiz'
import SearchBarQuiz from './components/SearchBarQuiz/SearchBarQuiz'
import Icon from 'react-native-vector-icons/FontAwesome'


const HomeScreen = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const listQuiz = useSelector((state) => state.listQuiz)
    const [pin, setPin] = React.useState("")
    const [isLoadingMore, setIsLoadingMore] = React.useState(false)


    const handleRefreshing = () => {
        dispatch(setPage(1))
        dispatch(GET_refreshListQuiz({ token: user.token }))
    }

    const handleLoadMore = () => {
        if (listQuiz.page + 1 <= listQuiz.totalPage) {
            dispatch(setPage(listQuiz.page + 1))
            setIsLoadingMore(true)
        }
    }

    React.useEffect(() => {
        socketServcies.on("player-joined", (message, game) => {
            if (message == "Game not found") {
                ToastAndroid.show(message, ToastAndroid.SHORT)
            } else if (message == "You have been kicked out of this room so you can't join again") {
                ToastAndroid.show(message, ToastAndroid.SHORT)
            }
            else {
                dispatch(updateGame(game._doc))
                ToastAndroid.show(message, ToastAndroid.SHORT)
                navigation.navigate(screenName.WaitingRoom)
                setPin("")
            }
        })
    }, [])

    React.useEffect(() => {
        dispatch(GET_refreshListQuiz({ token: user.token }))
    }, [])

    React.useEffect(() => {
        if (user.token !== "" && listQuiz.page !== 1) {
            dispatch(GET_getQuizBySearch({ token: user.token, currentPage: listQuiz.page, txtSearch: listQuiz.txtSearch, chooseCategories: listQuiz.chooseCategories }))
                .then(() => {
                    setIsLoadingMore(false)
                })
        }
    }, [user, listQuiz.page])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.viewTopBar}>
                <SearchBarQuiz />
            </View>
            <FlatList
                data={listQuiz.quizzes}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={listQuiz.isRefreshing}
                        onRefresh={handleRefreshing}
                        progressBackgroundColor={COLORS.white}
                        colors={[COLORS.primary]} />
                }
                style={{
                    backgroundColor: COLORS.background,
                    paddingTop: 35,
                    paddingHorizontal: 10,
                }}
                numColumns={2}
                renderItem={({ item, index }) => <ItemQuiz item={item} index={index} />}
                ListHeaderComponent={
                    <View style={{ width: "100%", backgroundColor: COLORS.bgrForPrimary, alignItems: "center", borderRadius: 10, padding: 10, marginBottom: 35 }}>
                        <View style={{ flexDirection: "row", height: 60, width: "100%", backgroundColor: COLORS.white, borderRadius: 5, paddingHorizontal: 15, marginBottom: 10 }}>
                            <TextInput
                                placeholder='Type pin room'
                                keyboardType="numeric"
                                value={pin}
                                onChangeText={(txt) => setPin(onlyNumber(txt))}
                                style={{ flex: 1, fontSize: 22 }}
                            />
                            {/*remove text in search */}
                            {
                                pin !== "" &&
                                <TouchableOpacity
                                    onPress={() => setPin("")}
                                    style={{ alignItems: "center", justifyContent: "center", padding: 10 }}
                                >
                                    <Icon
                                        size={20}
                                        color={COLORS.black}
                                        name={"remove"}
                                    />
                                </TouchableOpacity>
                            }
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{ height: 60, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 5, backgroundColor: COLORS.primary }}
                            onPress={() => {
                                if (socketServcies.socket.connected) {
                                    socketServcies.emit("player-join", { user, socketId, pin })
                                }
                            }}>
                            <Text style={{ color: COLORS.white, fontSize: "600", fontSize: 20 }}>Join a game</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={
                    <View style={{ height: 60, width: "100%", alignItems: "center", justifyContent: "center", marginBottom: 120 }}>
                        {
                            isLoadingMore ?
                                <ActivityIndicator size={40} color={COLORS.primary} />
                                :
                                listQuiz.page == listQuiz.totalPage ?
                                    <Text style={{ fontSize: 16, color: COLORS.black, fontWeight: "bold" }}>LOAD ENOUGH DATA</Text>
                                    :
                                    <FormButton
                                        labelText="Load More"
                                        style={{ width: 120, borderRadius: 30 }}

                                        isPrimary={true}
                                        handleOnPress={() => { handleLoadMore() }}
                                    />
                        }
                    </View>
                }
            />
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
        paddingHorizontal: 20,
    }
})

export default HomeScreen;
