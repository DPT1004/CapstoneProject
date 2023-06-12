import React from 'react'
import { Text, View, StyleSheet, Image, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../../../common/theme'
import { img } from '../../../../assets/index'
import YoutubePlayer from "react-native-youtube-iframe"
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Octicons'
import Icon1 from 'react-native-vector-icons/FontAwesome'

const paddingHorizonContainerFlatlist = 10
const paddingHorizonViewBottom = 0
const sizeViewItemAnswerChoice = 0.5 * (SIZES.windowWidth - paddingHorizonContainerFlatlist * 2 - paddingHorizonViewBottom * 2)
const spaceVeticalBetweenItem = 30
const widthMedia = 300
const heightMedia = widthMedia * 9 / 16

const Questions = () => {

    const quiz = useSelector((state) => state.newQuiz)

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.rowItem}>
                <View style={styles.viewTop}>
                    <Text style={[styles.txt, { color: COLORS.error, marginLeft: 10 }]}>{`Question ${index + 1}`}</Text>
                </View>
                {/*Question detail*/}
                <View style={styles.viewMiddle}>

                    {/* Container Question */}
                    <View style={styles.containerQuestion}>
                        <Text style={styles.txtQuestion}>{item.question}</Text>
                        {
                            item.backgroundImage != '' &&
                            <Image
                                source={{ uri: item.backgroundImage }}
                                resizeMode={"stretch"}
                                style={styles.imgQuestion}
                            />
                        }
                        {
                            item.video != "" && <></>
                            // <Video
                            //     source={{ uri: item.video }}
                            //     controls={true}
                            //     paused={true}
                            //     style={{ height: heightMedia, width: widthMedia, marginBottom: 5 }}
                            //     resizeMode={"stretch"}
                            //     poster={img.isLoadingVideo}
                            // />
                        }
                        {
                            item.youtube != "" &&
                            <YoutubePlayer
                                height={heightMedia}
                                width={widthMedia}
                                webViewStyle={{ marginVertical: 5 }}
                                play={false}
                                allowWebViewZoom={false}
                                videoId={item.youtube}
                            />
                        }
                    </View>

                    {/**Break line between question and answer */}
                    <View style={styles.containerLineHorizon}>
                        <View style={[styles.lineHorizon, { marginRight: 5, flex: 1 }]} />
                        <Text>answer choice</Text>
                        <View style={[styles.lineHorizon, { marginLeft: 5, flex: 5 }]} />
                    </View>

                    <View style={styles.containerAnswerChoice}>
                        {
                            item.answerList.map((item, index) => (
                                <View key={item._id} style={styles.viewItemAnswerChoice}>
                                    {
                                        item.isCorrect ?
                                            <Icon
                                                name={"check-circle-fill"}
                                                size={20}
                                                style={{ marginRight: 5 }}
                                                color={COLORS.success}
                                            />
                                            :
                                            <Icon
                                                name={"x-circle-fill"}
                                                size={20}
                                                style={{ marginRight: 5 }}
                                                color={COLORS.error}
                                            />
                                    }
                                    {
                                        item.img !== "" ?
                                            <Image
                                                style={styles.imgAnswer}
                                                source={{ uri: item.img }}
                                                resizeMode='stretch'
                                            />
                                            :
                                            <Text style={styles.txt}>{item.answer}</Text>
                                    }
                                </View>
                            ))
                        }
                    </View>

                </View>

                {/*Question time, typeQuestion and Level of hard, have image/video/youtube */}
                <View style={styles.viewBottom}>
                    <Text style={[styles.txt, { color: COLORS.error, flex: 0 }]}>
                        {`${item.questionType} - ${item.time} - ${item.difficulty} - `}
                        {
                            item.video == "" && item.backgroundImage == "" && item.youtube == "" ?
                                <Icon1
                                    size={20}
                                    color={COLORS.error}
                                    name={"file-text-o"}
                                />
                                :
                                <Icon1
                                    size={20}
                                    color={COLORS.error}
                                    name={
                                        item.backgroundImage !== "" ?
                                            "file-picture-o"
                                            :
                                            item.video !== "" ?
                                                "file-video-o"
                                                :
                                                "youtube"
                                    }
                                />
                        }
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={quiz.questionList}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ItemSeparatorComponent={
                    <View style={{ height: spaceVeticalBetweenItem }} />
                }
                ListHeaderComponent={
                    <View style={{ height: spaceVeticalBetweenItem }} />
                }
                ListFooterComponent={
                    <View style={{ height: spaceVeticalBetweenItem }} />
                }
            />
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: paddingHorizonContainerFlatlist,
        backgroundColor: COLORS.white
    },
    containerQuestion: {
        flex: 1,
        // flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    rowItem: {
        borderRadius: 10,
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    viewTop: {
        height: 40,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundTopBar,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },
    viewMiddle: {
        backgroundColor: COLORS.white,
        paddingHorizontal: paddingHorizonViewBottom,
        paddingVertical: 5
    },
    viewBottom: {
        height: 40,
        paddingHorizontal: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.backgroundTopBar,
    },
    viewItemAnswerChoice: {
        flexDirection: "row",
        alignItems: "center",
        width: sizeViewItemAnswerChoice,
        height: sizeViewItemAnswerChoice * 2 / 3
    },
    containerLineHorizon: {
        flexDirection: "row",
        alignItems: "center"
    },
    containerAnswerChoice: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    lineHorizon: {
        borderWidth: 0.8,
        borderColor: COLORS.gray,
    },
    imgAnswer: {
        height: "100%",
        width: "80%",
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 5,
    },
    imgQuestion: {
        height: heightMedia,
        width: widthMedia,
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 5,
    },
    txt: {
        color: COLORS.black,
        fontSize: 16,
        flex: 1
    },
    txtQuestion: {
        fontSize: 16,
        color: COLORS.black,
    },

})


export default Questions