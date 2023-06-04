import React from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, LayoutAnimation, ToastAndroid, Button } from 'react-native'
import { COLORS } from '../../../common/theme'
import { screenName } from '../../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux'
import { updateGame } from '../../../redux/Slice/gameSlice'
import { updateQuiz } from '../../../redux/Slice/newQuizSlice'
import Icon from 'react-native-vector-icons/Ionicons'
import FormButton from '../../../components/FormButton'
import socketServcies from '../../../until/socketServices'

const WaitingRoom = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const game = useSelector((state) => state.game)

    React.useEffect(() => {

        socketServcies.on("newPlayer-joined", (message, game) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT)
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            dispatch(updateGame(game._doc))
        })

        socketServcies.on("player-removed", (message, game) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT)
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            dispatch(updateGame(game))
        })

        socketServcies.on("start-game", (quiz) => {
            dispatch(updateQuiz(quiz))
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            navigation.navigate(screenName.PlayQuiz)
        })

        socketServcies.on("start-game-host", (quiz) => {
            dispatch(updateQuiz(quiz))
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            navigation.navigate(screenName.PlayQuiz)
        })

    }, [])

    return (
        <View style={styles.container}>
            {
                game.isLoading ?
                    <View style={{ flex: 1, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={40} color={COLORS.primary} />
                    </View>
                    :
                    <>
                        <View style={styles.viewTop}>
                            <Text style={styles.txtGamePin}>Game Pin</Text>
                            <View style={styles.viewGamePin}>
                                <Text style={styles.txtGamePin}>{game.pin}</Text>
                            </View>

                            {/*button Quit game*/}
                            <TouchableOpacity
                                onPress={() => {
                                    var pin = game.pin
                                    var userId = user.userId
                                    socketServcies.emit("player-remove", { userId, pin })
                                    navigation.navigate(screenName.ManageQuiz)
                                }}
                                style={styles.btnQuit}>
                                <Icon
                                    name={"md-arrow-back-circle-sharp"}
                                    size={30}
                                    color={COLORS.primary}
                                />
                                <Text style={styles.txtBtnQuit}>Quit</Text>
                            </TouchableOpacity>

                            {/*Show how many player*/}
                            <View style={styles.viewIconNumCandidate}>
                                <Icon
                                    name={"people"}
                                    size={30}
                                    color={COLORS.black}
                                />
                                <Text style={styles.txtNumCandidate}>{game.playerList.length}</Text>
                            </View>

                            {
                                user.userId == game.hostId ?
                                    <FormButton
                                        labelText="Start Game"
                                        isPrimary={true}
                                        style={{ position: "absolute", bottom: 10, paddingHorizontal: 30 }}
                                        handleOnPress={() => {
                                            let quizId = game.quizId
                                            let pin = game.pin
                                            socketServcies.emit("host-start-game", { quizId, pin })
                                        }}
                                    />
                                    :
                                    <></>
                            }
                        </View>

                        <View style={styles.viewBottom}>
                            {/*Show all player*/}
                            <FlatList
                                data={game.playerList}
                                showsVerticalScrollIndicator={false}
                                style={{
                                    backgroundColor: COLORS.bgrForPrimary,
                                    paddingHorizontal: 20,
                                    paddingTop: 30,
                                    borderTopRightRadius: 20,
                                    borderTopLeftRadius: 20
                                }}
                                renderItem={({ item }) =>
                                    <View style={styles.rowItem}>
                                        {
                                            item.photo !== "" &&
                                            <Image
                                                style={styles.imgAvatarPlayer}
                                                resizeMode="stretch"
                                                source={{ uri: item.photo }}
                                            />
                                        }
                                        <Text numberOfLines={1} style={styles.txtUserName}>{item.userName}</Text>
                                    </View>
                                }
                                ListFooterComponent={
                                    <View style={{ height: 30 }} />
                                }
                            />
                        </View>
                    </>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    viewTop: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white
    },
    viewBottom: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    viewGamePin: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.bgrForPrimary
    },
    viewIconNumCandidate: {
        position: "absolute",
        bottom: 10,
        left: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    rowItem: {
        flexDirection: "row",
        paddingVertical: 15,
        paddingHorizontal: 5,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    imgAvatarPlayer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        position: "absolute",
        left: 5
    },
    btnQuit: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        left: 5
    },
    txtBtnQuit: {
        marginLeft: 2,
        fontSize: 16,
        color: COLORS.primary
    },
    txtNumCandidate: {
        marginLeft: 5,
        fontSize: 16,
        color: COLORS.black
    },
    txtGamePin: {
        fontSize: 25,
        color: COLORS.primary
    },
    txtUserName: {
        fontSize: 20,
        color: COLORS.primary
    }
})

export default WaitingRoom;
