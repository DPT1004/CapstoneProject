import React from 'react'
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import { COLORS, SIZES } from '../../../common/theme'
import { uriImgQuiz } from '../../../common/shareVarible'
import { screenName } from '../../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { POST_createGame } from '../../../redux/Slice/gameSlice'
import { useSelector, useDispatch } from 'react-redux'
import {
    BottomSheetModal,
} from '@gorhom/bottom-sheet'
import FormButton from '../../../components/FormButton'
import Icon1 from 'react-native-vector-icons/Octicons'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'

const spaceBetweenItem = 10
const widthItem = (SIZES.windowWidth - 10 * 2 - spaceBetweenItem) / 2
const heightItem = widthItem * 1.5
const spaceBetweenItemQuestsion = 10

const ItemQuiz = ({ item, index }) => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const imgQuiz = item.backgroundImage !== "" ? item.backgroundImage : uriImgQuiz

    const bottomSheetModalRef = React.useRef(null)
    const snapPoints = React.useMemo(() => ["100%", "100%"], [])

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => bottomSheetModalRef.current?.present()}
                style={[styles.container, { marginRight: index % 2 == 0 ? spaceBetweenItem : 0 }]}>
                <ImageBackground
                    style={styles.quizBGR}
                    borderTopRightRadius={5}
                    borderTopLeftRadius={5}
                    resizeMode="stretch"
                    source={{ uri: imgQuiz }}
                >
                    <View style={styles.viewNumQuestion}>
                        <Text style={styles.txt}>{item.numberOfQuestions + " Qs"}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.containerQuizNameAndDesc}>
                    <Text numberOfLines={2} style={[styles.txt, { fontWeight: "600", fontSize: 18 }]}>{item.name}</Text>
                    {
                        item.description != '' &&
                        <Text numberOfLines={1}>{item.description}</Text>
                    }
                </View>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
            >
                <View style={styles.bottomSheet}>
                    <Image
                        style={styles.quizBgrBottomSheet}
                        borderTopRightRadius={5}
                        borderTopLeftRadius={5}
                        resizeMode='stretch'
                        source={{ uri: imgQuiz }}
                    />
                    <View style={{ alignItems: "center" }}>
                        <Text style={[styles.txt, { fontSize: 18 }]}>{item.name}</Text>
                        {
                            item.description != '' &&
                            <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: "700" }}>{item.description}</Text>
                        }
                        <View style={{ alignItems: "flex-start" }}>
                            <Text>- Number of questions: <Text style={styles.txt}>{item.numberOfQuestions}</Text></Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ marginVertical: 10 }}>- Categories: </Text>
                                <FlatList
                                    data={item.categories}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    renderItem={({ item, index }) =>
                                        <View key={index} style={styles.category}>
                                            <Text style={styles.txt}>{item}</Text>
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text>- Sample Question: </Text>
                        <FlatList
                            data={item.questionList}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <>
                                    {
                                        index < 10 &&
                                        <View key={index} style={styles.itemQuestionSample}>
                                            <Text style={styles.txt}>{item.question}</Text>
                                        </View>
                                    }
                                </>
                            }
                            ItemSeparatorComponent={
                                <View style={{ height: spaceBetweenItemQuestsion }} />
                            }
                            ListFooterComponent={
                                <View style={{ height: spaceBetweenItemQuestsion }} />
                            }
                        />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <FormButton
                            labelText="Play Quiz"
                            isPrimary={true}
                            style={{ marginRight: spaceBetweenItem, width: widthItem }}
                            children={
                                <View style={styles.viewIcon}>
                                    <Icon1
                                        name={"play"}
                                        size={20}
                                        color={COLORS.white}
                                    />
                                </View>
                            }
                            handleOnPress={() => {
                                const newGame = {
                                    hostId: user.userId,
                                    quizId: item._id,
                                    pin: Math.floor(100000 + Math.random() * 900000),
                                    isLive: false,
                                    playerList: []
                                }
                                const onPress = () => {
                                    bottomSheetModalRef.current?.close()
                                    navigation.navigate(screenName.WaitingRoom)
                                }
                                dispatch(POST_createGame({ newGame: newGame, onPress: onPress }))
                            }}
                        />
                        <FormButton
                            labelText="Cancel"
                            isPrimary={false}
                            style={{ width: widthItem }}
                            handleOnPress={() => bottomSheetModalRef.current?.close()}
                        />
                    </View>
                </View>
            </BottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: heightItem,
        width: widthItem,
        marginBottom: spaceBetweenItem,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    containerQuizNameAndDesc: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    quizBGR: {
        height: heightItem * 0.6,
        width: "100%",
        alignSelf: "center",
    },
    quizBgrBottomSheet: {
        height: "35%",
        width: "100%",
        alignSelf: "center",
        borderRadius: 3
    },
    viewNumQuestion: {
        backgroundColor: COLORS.gray,
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 5,
        position: "absolute",
        bottom: 5,
        right: 5
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    category: {
        backgroundColor: COLORS.gray,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
        paddingVertical: 5,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    itemQuestionSample: {
        backgroundColor: COLORS.gray,
        borderRadius: 3,
        padding: 5,
        alignItems: "center"
    },
    bottomSheet: {
        flex: 1,
        padding: 10,
    },
    txt: {
        fontSize: 14,
        color: COLORS.black,
        fontWeight: "700",
    },
})
export default ItemQuiz
