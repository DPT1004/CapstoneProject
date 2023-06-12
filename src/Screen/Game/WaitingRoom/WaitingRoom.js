import React from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, LayoutAnimation, ToastAndroid } from 'react-native'
import { COLORS } from '../../../common/theme'
import { screenName } from '../../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux'
import { updateGame } from '../../../redux/Slice/gameSlice'
import { updateQuiz } from '../../../redux/Slice/newQuizSlice'
import { setIsActiveTimeCounter, setIsActiveShuffleQuestion, setTypeActiveShuffle, clearInfoCompetitive } from '../../../redux/Slice/userCompetitiveSlice'
import Icon from 'react-native-vector-icons/Ionicons'
import socketServcies, { socketId } from '../../../until/socketServices'
import ThreeDButton from '../../../components/ThreeDButton'
import SettingGame from './components/SettingGame'

const WaitingRoom = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const game = useSelector((state) => state.game)
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const [isShowSettingView, setIsShowSettingView] = React.useState(false)
    const [isStartGame, setIsStartGame] = React.useState(false)

    React.useEffect(() => {

        socketServcies.on("newPlayer-joined", (message, game) => {
            // ToastAndroid.show(message, ToastAndroid.SHORT)
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            dispatch(updateGame(game._doc))
        })

        socketServcies.on("player-removed", (message, game) => {
            if (message !== "") {
                ToastAndroid.show(message, ToastAndroid.SHORT)
            }
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            dispatch(updateGame(game))
        })

        socketServcies.on("start-game", (quiz, isActiveTimeCounter, isActiveShuffleQuestion, typeActiveShuffle) => {
            let quizApplySetting = JSON.parse(JSON.stringify(quiz))
            if (isActiveShuffleQuestion && typeActiveShuffle == 1) {
                quizApplySetting.questionList.forEach(question => question.answerList.sort(() => Math.random() - 0.5))
                quizApplySetting.questionList.sort(() => Math.random() - 0.5)
            }
            dispatch(updateQuiz(quizApplySetting))
            dispatch(setIsActiveTimeCounter(isActiveTimeCounter))
            dispatch(setIsActiveShuffleQuestion(isActiveShuffleQuestion))
            dispatch(setTypeActiveShuffle(typeActiveShuffle))
            setIsStartGame(true)
        })

    }, [])

    React.useEffect(() => {
        if (isStartGame && game.hostId !== "") {
            if (userCompetitive.isHostJoinGame == false && user.userId == game.hostId) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                navigation.navigate(screenName.HostScreen)
            } else {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                navigation.navigate(screenName.PlayQuiz)
            }
        }
    }, [isStartGame])

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
                                    if (socketServcies.socket.connected) {
                                        var pin = game.pin
                                        var userId = user.userId
                                        socketServcies.emit("player-remove", { userId, pin })
                                        navigation.navigate(screenName.Home)
                                        dispatch(clearInfoCompetitive())
                                    }
                                }}
                                style={styles.btnQuit}>
                                <Icon
                                    name={"md-arrow-back-circle-sharp"}
                                    size={30}
                                    color={COLORS.primary}
                                />
                                <Text style={styles.txtBtnQuit}>Quit</Text>
                            </TouchableOpacity>

                            {
                                user.userId == game.hostId &&
                                //button Setting game
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsShowSettingView(!isShowSettingView)
                                    }}
                                    style={styles.btnSetting}>
                                    <Icon
                                        name={"settings"}
                                        size={32}
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            }


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
                                user.userId == game.hostId &&
                                <ThreeDButton
                                    label={"Start Game"}
                                    widthBtn={200}
                                    heightBtn={60}
                                    styleLabel={{ fontSize: 18 }}
                                    styleButton={{ marginTop: 15 }}
                                    onPress={() => {
                                        try {
                                            if (socketServcies.socket.connected) {
                                                if (game.playerList.length == 0 && userCompetitive.isHostJoinGame == false) {
                                                    ToastAndroid.show("If you play alone, you can't disable 'Host Join Game' ", ToastAndroid.SHORT)
                                                } else {
                                                    let quizId = game.quizId
                                                    let pin = game.pin
                                                    let isActiveTimeCounter = userCompetitive.isActiveTimeCounter
                                                    let isActiveShuffleQuestion = userCompetitive.isActiveShuffleQuestion
                                                    let typeActiveShuffle = userCompetitive.typeActiveShuffle
                                                    let isHostJoinGame = userCompetitive.isHostJoinGame
                                                    let hostInfo = {
                                                        userId: user.userId,
                                                        userName: user.name,
                                                        socketId: socketId,
                                                        photo: user.photo
                                                    }
                                                    socketServcies.emit("host-start-game", { quizId, pin, isActiveTimeCounter, isActiveShuffleQuestion, typeActiveShuffle, isHostJoinGame, hostInfo })
                                                }
                                            }
                                        } catch (error) {
                                            ToastAndroid.show(String(error), ToastAndroid.SHORT)
                                        }
                                    }} />
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

                        {/**Setting game */}
                        <SettingGame isShow={isShowSettingView} />
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
        flexWrap: "wrap",
        paddingVertical: 5,
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
    },
    btnQuit: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        left: 5
    },
    btnSetting: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        right: 5
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
        fontSize: 16,
        color: COLORS.black,
    }
})

export default WaitingRoom;
