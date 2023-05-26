import React from 'react'
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { timeWaitToNextQuestion } from '../../../common/shareVarible'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { COLORS } from '../../../common/theme'
import { useDispatch, useSelector } from 'react-redux'
import { clearInfoCompetitive, showLeaderBoard } from '../../../redux/Slice/userCompetitiveSlice'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../../navigator/screens-name'
import socketServcies from '../../../until/socketServices'
import FormButton from '../../../components/FormButton'

const PreviewAndLeaderBoard = () => {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const refFlatList = React.useRef(null)
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const user = useSelector((state) => state.user)
    const quiz = useSelector((state) => state.newQuiz)
    const [leaderBoard, setLeaderBoard] = React.useState([])
    const [indexPlayer, setIndexPlayer] = React.useState(-1)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {

        socketServcies.on("players-get-finalLeaderBoard", ({ leaderBoard }) => {
            var indexPlayerInPlayerList = leaderBoard.findIndex(player => player.userId == user.userId)
            setIndexPlayer(indexPlayerInPlayerList)
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

    // React.useEffect(() => {
    //     if (refFlatList.current && indexPlayer !== -1) {
    //         refFlatList.current.scrollToIndex({
    //             animated: true,
    //             index: indexPlayer,
    //             viewPosition: 0.5
    //         })
    //     }
    // }, [indexPlayer])

    const renderItem = ({ item, index }) => {
        if (index == indexPlayer) {
            return (
                <View style={styles.containerChooseTitleColumn}>
                    <View style={[styles.viewTitleColumn, { flex: 0.5 }]}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{index + 1}</Text>
                    </View>
                    <View style={[styles.viewTitleColumn, { flex: 2 }]}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{item.userName}</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{item.currentIndexQuestion + 1}</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{item.totalScore}</Text>
                    </View>

                </View>
            )
        } else {
            return (
                <View style={styles.containerContentColumn}>
                    <View style={[styles.viewTitleColumn, { flex: 0.5 }]}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{index + 1}</Text>
                    </View>
                    <View style={[styles.viewTitleColumn, { flex: 2 }]}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{item.userName}</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{item.currentIndexQuestion + 1}</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{item.totalScore}</Text>
                    </View>
                </View>
            )
        }
    }

    const renderView = () => {
        if (userCompetitive.isShowLeaderBoard && userCompetitive.currentIndexQuestion == 0) {
            return (
                <View style={styles.containerCountDownToStartGame}>
                    <CountdownCircleTimer
                        isPlaying={true}
                        duration={3}
                        trailColor={COLORS.gray}
                        isSmoothColorTransition={true}
                        size={250}
                        strokeLinecap={"butt"}
                        strokeWidth={20}
                        colors={[COLORS.success, COLORS.gray]}
                        colorsTime={[timeWaitToNextQuestion, 0]}
                        onComplete={() => {
                            dispatch(showLeaderBoard(false))
                        }}
                    >
                        {({ remainingTime, color }) => <Text style={{ fontSize: 50, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                    </CountdownCircleTimer>
                    <Text style={styles.txtNextQuestion}>Game start in...</Text>
                </View>
            )
        }
        else if (userCompetitive.isShowLeaderBoard && userCompetitive.currentIndexQuestion >= quiz.numberOfQuestions && leaderBoard.length == 1) {
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
                                <Text numberOfLines={1} style={styles.txtTitleColumn}>OrderQuest</Text>
                            </View>
                            <View style={styles.viewTitleColumn}>
                                <Text numberOfLines={1} style={styles.txtTitleColumn}>Score</Text>
                            </View>

                        </View>

                        <FlatList
                            data={leaderBoard}
                            showsVerticalScrollIndicator={false}
                            ref={refFlatList}
                            renderItem={renderItem}
                        />
                    </View>
                    <FormButton
                        labelText="Go Home"
                        activeOpacity={0.8}
                        style={{
                            height: 45,
                            borderRadius: 0
                        }}
                        handleOnPress={() => {
                            dispatch(clearInfoCompetitive())
                            navigation.navigate(screenName.Home)
                        }}
                    />
                </View>
            )
        }
        else if (userCompetitive.isShowLeaderBoard && userCompetitive.currentIndexQuestion >= quiz.numberOfQuestions) {
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
                                <Text numberOfLines={1} style={styles.txtTitleColumn}>OrderQuest</Text>
                            </View>
                            <View style={styles.viewTitleColumn}>
                                <Text numberOfLines={1} style={styles.txtTitleColumn}>Score</Text>
                            </View>

                        </View>

                        <FlatList
                            data={leaderBoard}
                            showsVerticalScrollIndicator={false}
                            ref={refFlatList}
                            renderItem={renderItem}
                        />
                    </View>
                    <View style={styles.viewTimeCounter}>
                        {
                            isLoading ?
                                <View>
                                    <ActivityIndicator size={80} color={COLORS.gray} />
                                    <Text style={styles.txtNextQuestion}>Waiting for another player finish the game</Text>
                                </View>
                                :
                                <Text style={styles.txtNextQuestion}>Game finish</Text>
                        }
                    </View>
                    <FormButton
                        labelText="Go Home"
                        activeOpacity={0.8}
                        style={{
                            height: 45,
                            borderRadius: 0
                        }}
                        handleOnPress={() => {
                            dispatch(clearInfoCompetitive())
                            navigation.navigate(screenName.Home)
                        }}
                    />
                </View>
            )
        }
        else {
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
                                <Text numberOfLines={1} style={styles.txtTitleColumn}>OrderQuest</Text>
                            </View>
                            <View style={styles.viewTitleColumn}>
                                <Text numberOfLines={1} style={styles.txtTitleColumn}>Score</Text>
                            </View>

                        </View>

                        <FlatList
                            data={leaderBoard}
                            showsVerticalScrollIndicator={false}
                            ref={refFlatList}
                            renderItem={renderItem}
                        />
                    </View>
                    <View style={styles.viewTimeCounter}>
                        <Text style={styles.txtNextQuestion}>Next question start in...</Text>
                        <CountdownCircleTimer
                            isPlaying={true}
                            duration={timeWaitToNextQuestion}
                            trailColor={COLORS.gray}
                            isSmoothColorTransition={true}
                            size={100}
                            strokeLinecap={"butt"}
                            strokeWidth={20}
                            colors={[COLORS.success, COLORS.gray]}
                            colorsTime={[timeWaitToNextQuestion, 0]}
                            onComplete={() => {
                                dispatch(showLeaderBoard(false))
                            }}
                        >
                            {({ remainingTime, color }) => <Text style={{ fontSize: 50, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                        </CountdownCircleTimer>
                    </View>
                </View>
            )
        }
    }

    return (
        <>
            {
                renderView()
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    containerLeaderBoard: {
        flex: 1
    },
    containerCountDownToStartGame: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white
    },
    containerTitleColumn: {
        flexDirection: "row",
        marginBottom: 10,
    },
    containerContentColumn: {
        flexDirection: "row",
        marginBottom: 10,
    },
    containerChooseTitleColumn: {
        flexDirection: "row",
        marginBottom: 10,
        backgroundColor: COLORS.primary
    },
    viewTitleColumn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    viewTimeCounter: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
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
    txtChooseContentColumn: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "600",
    },
    txtNextQuestion: {
        fontWeight: "bold",
        color: COLORS.gray,
        fontSize: 20
    }

})

export default PreviewAndLeaderBoard