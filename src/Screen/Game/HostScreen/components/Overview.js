import React from 'react'
import { Text, View, StyleSheet, FlatList, TouchableHighlight, ActivityIndicator, Image, LayoutAnimation } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../../../common/theme'
import { clearInfoCompetitive } from '../../../../redux/Slice/userCompetitiveSlice'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../../../navigator/screens-name'
import socketServcies from '../../../../until/socketServices'
import ThreeDButton from '../../../../components/ThreeDButton'
import ModalSummary from '../../PreviewAndLeaderBoard/components/ModalSummary'

const Overview = () => {

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const refFlatList = React.useRef(null)
    const game = useSelector((state) => state.game)
    const quiz = useSelector((state) => state.newQuiz)
    const [leaderBoard, setLeaderBoard] = React.useState(game.playerList)
    const [isLoading, setIsLoading] = React.useState(true)
    const [modalVisible, setModalVisible] = React.useState(false)

    React.useEffect(() => {

        socketServcies.on("players-get-finalLeaderBoard", ({ leaderBoard }) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setLeaderBoard(leaderBoard)

            if (leaderBoard.every(player => player.currentIndexQuestion + 1 == quiz.numberOfQuestions)) {
                setIsLoading(false)
            }
        })

        socketServcies.on("player-quited-when-game-isPlaying", ({ leaderBoard }) => {
            setLeaderBoard(leaderBoard)
            if (leaderBoard.every(player => player.currentIndexQuestion + 1 == quiz.numberOfQuestions)) {
                setIsLoading(false)
            }
        })

    }, [])

    const closeModal = () => {
        setModalVisible(false)
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                <TouchableHighlight
                    underlayColor={COLORS.primary}
                    // disabled={isLoading}
                    onPress={() => setModalVisible(true)}>
                    <View style={styles.containerContentColumn}>
                        <View style={[styles.viewTitleColumn, { flex: 0.5 }]}>
                            <Text
                                numberOfLines={1}
                                style={styles.txtContentColumn}>{index + 1}</Text>
                        </View>
                        <View style={[styles.viewTitleColumn, { flex: 2 }]}>
                            {
                                item.photo !== "" &&
                                <Image
                                    style={styles.imgAvatarPlayer}
                                    resizeMode="stretch"
                                    source={{ uri: item.photo }}
                                />
                            }
                            <Text
                                numberOfLines={1}
                                style={styles.txtContentColumn}>{item.userName}</Text>
                        </View>
                        <View style={styles.viewTitleColumn}>
                            <Text
                                numberOfLines={1}
                                style={styles.txtContentColumn}>{item.totalScore}</Text>
                        </View>
                        <View style={styles.viewTitleColumn}>
                            <Text
                                numberOfLines={1}
                                style={styles.txtContentColumn}>{item.currentIndexQuestion + 1}</Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <ModalSummary modalVisible={modalVisible} onPressVisible={closeModal} player={item} isViewForHostScreen={true} />

            </>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerLeaderBoard}>

                <View style={styles.containerTitleColumn}>

                    <View style={[styles.viewTitleColumn, { flex: 0.5 }]}>
                        <Text numberOfLines={1} style={styles.txtTitleColumn}>Rank</Text>
                    </View>
                    <View style={[styles.viewTitleColumn, { flex: 2 }]}>
                        <Text numberOfLines={1} style={styles.txtTitleColumn}>Username</Text>
                    </View>

                    <View style={styles.viewTitleColumn}>
                        <Text numberOfLines={1} style={styles.txtTitleColumn}>Score</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text numberOfLines={1} style={styles.txtTitleColumn}>OrderQuest</Text>
                    </View>

                </View>

                <FlatList
                    data={leaderBoard}
                    showsVerticalScrollIndicator={false}
                    ref={refFlatList}
                    renderItem={renderItem}
                    ItemSeparatorComponent={
                        <View style={styles.lineHorizon} />
                    }
                />
            </View>
            <View style={styles.viewTimeCounter}>
                <View>
                    {
                        isLoading ?

                            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "bold", backgroundColor: COLORS.gray, borderRadius: 5, paddingVertical: 8, width: 200, textAlign: "center" }}>
                                <ActivityIndicator color={COLORS.white} />
                                {" On processing \n"}
                                <Text style={{ color: COLORS.black }}>{`Number of question: ${quiz.numberOfQuestions}`}</Text>
                            </Text>
                            :
                            <Text style={styles.txt}>Game finish</Text>
                    }
                </View>
            </View>

            <View style={styles.containerBtnGoHomeAndSummary}>
                <ThreeDButton
                    label={"GO HOME"}
                    widthBtn={SIZES.windowWidth * 0.8}
                    onPress={() => {
                        if (socketServcies.socket.connected) {
                            var pin = game.pin
                            socketServcies.emit("player-quit-room-when-game-finish", { pin })
                        }
                        navigation.navigate(screenName.Home)
                        dispatch(clearInfoCompetitive())
                    }} />
            </View>

        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: 5
    },
    containerLeaderBoard: {
        flex: 1
    },
    containerTitleColumn: {
        flexDirection: "row",
        marginBottom: 10,
    },
    containerContentColumn: {
        flexDirection: "row",
        paddingVertical: 10,
    },
    containerBtnGoHomeAndSummary: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 5
    },
    viewTitleColumn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    viewTimeCounter: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    lineHorizon: {
        borderWidth: 0.8,
        borderColor: COLORS.gray,
    },
    imgAvatarPlayer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    txtTitleColumn: {
        color: COLORS.black,
        fontSize: 14,
        fontWeight: "bold",
    },
    txtContentColumn: {
        color: COLORS.black,
        fontSize: 18,
        fontWeight: "600",
    },
    txt: {
        fontWeight: "bold",
        color: COLORS.gray,
        fontSize: 18,
    }

})


export default Overview