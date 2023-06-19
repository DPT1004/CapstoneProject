import React from 'react'
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Text, Image, ToastAndroid } from 'react-native'
import { COLORS } from '../../../../common/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview'
import YoutubePlayer from "react-native-youtube-iframe"

const commonBorderRadius = 5
const spaceVerticalBetweenItem = 20

const ModalSummary = ({ modalVisible, onPressVisible, player, isViewForHostScreen = false }) => {

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <View style={[styles.viewTrueOrWrong, { backgroundColor: item.score !== 0 ? COLORS.success : COLORS.error }]} />
                <View style={styles.viewDetailQuestion}>
                    <Text style={styles.txt}>{`${index + 1}. ${item.question.question}`}</Text>
                    {
                        item.question.backgroundImage !== "" &&
                        <Image
                            style={styles.imgQuestion}
                            source={{ uri: item.question.backgroundImage }}
                        />
                    }
                    {
                        item.question.video != "" &&
                        <View style={styles.video}>
                            <WebView
                                allowsFullscreenVideo={true}
                                source={{ uri: item.question.video }} />
                        </View>
                    }
                    {
                        item.question.youtube != "" &&
                        <YoutubePlayer
                            webViewStyle={{ flex: 1, aspectRatio: 16 / 9, marginBottom: 5 }}
                            initialPlayerParams={{ start: item.question.startTime, end: item.question.endTime, iv_load_policy: 3 }}
                            play={false}
                            allowWebViewZoom={true}
                            videoId={item.question.youtube}
                        />
                    }

                    {/*Line break Question and Answer */}
                    <View style={styles.lineHorizon} />

                    {
                        item.question.answerList.map((itemAnswer, index) => (
                            <View key={index} style={styles.viewItemAnswer}>
                                {
                                    item.indexPlayerAnswer.includes(index) &&
                                    <View style={styles.viewYourAnswer}>
                                        <Text style={styles.txtYourAnswer}>{isViewForHostScreen ? "Player Answer" : "Your Answer"}</Text>
                                    </View>
                                }

                                <View style={[styles.circleTrueOrWrong, { backgroundColor: itemAnswer.isCorrect ? COLORS.success : COLORS.error }]} />
                                {
                                    itemAnswer.img !== "" ?
                                        <Image
                                            style={styles.imgAnswer}
                                            source={{ uri: itemAnswer.img }}
                                        />
                                        :
                                        <Text style={[styles.txt, { flex: 1 }]}>{itemAnswer.answer}</Text>
                                }
                            </View>

                        ))

                    }
                    <View style={styles.containerScoreAndTimeAnswer}>
                        {/* Score */}
                        <View style={styles.viewScore}>
                            <Icon
                                name={"star-shooting"}
                                size={20}
                                color={COLORS.white}
                            />
                            <Text style={styles.txtScoreAndTimeAnswer}>{` ${item.score} pts`}</Text>
                        </View>

                        {/* Difficulty */}
                        <View style={styles.viewDifficultyQuestion}>
                            <Text style={styles.txtScoreAndTimeAnswer}>{item.question.difficulty}</Text>
                        </View>

                        {/* Time Answer */}
                        <View style={styles.viewTimeAnswer}>
                            <Icon
                                name={"clock-time-nine"}
                                size={20}
                                color={COLORS.white}
                            />
                            <Text style={styles.txtScoreAndTimeAnswer}>{` ${item.timeAnswer}s`}</Text>
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.containerModal}>
                <View style={styles.childModal}>
                    <View style={styles.viewTop}>
                        <Text style={[styles.txt, { fontSize: 22, fontWeight: "bold", color: COLORS.black }]}>{isViewForHostScreen ? "PLAYER SUMMARY" : "YOUR SUMMARY"}</Text>

                        {/*Button close modal */}
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            activeOpacity={0.4}
                            onPress={onPressVisible} >
                            <Icon
                                name={"close-box"}
                                size={35}
                                color={COLORS.error}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        player !== undefined &&
                        <FlatList
                            data={player.playerResult}
                            style={{
                                paddingTop: spaceVerticalBetweenItem,
                                paddingHorizontal: 10
                            }}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderItem}
                            ListHeaderComponent={
                                <View style={styles.containerCorrectAndIncorrect}>
                                    <View style={styles.viewCorrect}>
                                        <Text style={styles.txtCorrectAndIncorrect}>{`Correct ${player.numberOfCorrect}`} </Text>
                                    </View>
                                    <View style={styles.viewIncorrect}>
                                        <Text style={styles.txtCorrectAndIncorrect}>{`Incorrect ${player.numberOfInCorrect}`}</Text>
                                    </View>
                                </View>
                            }
                            ListFooterComponent={
                                <View style={{ height: spaceVerticalBetweenItem }} />
                            }
                        />
                    }

                </View>
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    containerModal: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    childModal: {
        height: "95%",
        width: "95%",
        backgroundColor: COLORS.background,
        borderRadius: 5,
    },
    containerScoreAndTimeAnswer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10
    },
    containerCorrectAndIncorrect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spaceVerticalBetweenItem
    },
    video: {
        height: 200,
        width: "100%"
    },
    viewTop: {
        height: 40,
        width: "100%",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: COLORS.white,
        elevation: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    viewBottom: {
        flex: 1
    },
    viewCorrect: {
        width: "50%",
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopLeftRadius: commonBorderRadius,
        borderBottomLeftRadius: commonBorderRadius,
    },
    viewIncorrect: {
        width: "50%",
        backgroundColor: COLORS.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopRightRadius: commonBorderRadius,
        borderBottomRightRadius: commonBorderRadius,
    },
    viewItem: {
        flexDirection: "row",
        width: "100%",
        elevation: 4,
        marginBottom: spaceVerticalBetweenItem,
        backgroundColor: COLORS.white,
        borderRadius: commonBorderRadius,
        shadowRadius: commonBorderRadius
    },
    viewItemAnswer: {
        flexDirection: "row",
        marginTop: 30
    },
    viewYourAnswer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: commonBorderRadius,
        position: "absolute",
        top: -24,
        right: 0,
        backgroundColor: COLORS.gray,
    },
    viewTrueOrWrong: {
        height: "100%",
        width: 10,
        borderTopLeftRadius: commonBorderRadius,
        borderBottomLeftRadius: commonBorderRadius
    },
    viewDetailQuestion: {
        flex: 1,
        paddingHorizontal: 5,
        paddingTop: 10,
        paddingBottom: 5
    },
    viewScore: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: COLORS.gray,
        borderTopLeftRadius: commonBorderRadius,
        borderBottomLeftRadius: commonBorderRadius
    },
    viewTimeAnswer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: COLORS.gray,
        borderTopRightRadius: commonBorderRadius,
        borderBottomRightRadius: commonBorderRadius
    },
    viewDifficultyQuestion: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: COLORS.gray,
        marginHorizontal: 1.5
    },
    imgQuestion: {
        height: 90,
        width: 90,
        marginTop: 10,
        borderRadius: commonBorderRadius,
        alignSelf: "center"
    },
    imgAnswer: {
        height: 90,
        width: 90,
        borderRadius: commonBorderRadius,
    },
    circleTrueOrWrong: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 5,
        alignSelf: "center"
    },
    lineHorizon: {
        borderWidth: 0.8,
        borderColor: COLORS.gray,
        marginTop: 10
    },
    txt: {
        color: COLORS.black,
        color: COLORS.black,
        fontSize: 15
    },
    txtScoreAndTimeAnswer: {
        color: COLORS.white,
        fontSize: 16
    },
    txtCorrectAndIncorrect: {
        fontWeight: "bold",
        color: COLORS.white,
        fontSize: 20,
    },
    txtYourAnswer: {
        fontWeight: "bold",
        color: COLORS.black,
        fontSize: 12
    },
    btnCloseModal: {
        position: "absolute",
        right: 3,
        alignItems: "center",
        justifyContent: "center",
    },

})

export default React.memo(ModalSummary) 