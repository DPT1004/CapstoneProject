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
import socketServcies, { socketId } from '../../../until/socketServices'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'

const spaceBetweenItem = 10
const widthItem = (SIZES.windowWidth - 10 * 2 - spaceBetweenItem) / 2
const heightItem = widthItem * 1.5

const ItemQuiz = ({ item, index }) => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const game = useSelector((state) => state.game)
    const imgQuiz = item.backgroundImage !== "" ? item.backgroundImage : uriImgQuiz

    const bottomSheetModalRef = React.useRef(null)
    const snapPoints = React.useMemo(() => ["50%", "100%"], [])

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
                        <Text style={[styles.txt, { fontWeight: "bold" }]}>{item.numberOfQuestions + " Qs"}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.containerQuizNameAndDesc}>
                    <Text numberOfLines={2} style={[styles.txt, { fontSize: 18 }]}>{item.name}</Text>
                    {
                        item.description != '' ?
                            <Text numberOfLines={1} style={{ opacity: 0.5 }}>{item.description}</Text>
                            :
                            <></>
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
                        style={{ height: "50%", width: "100%", backgroundColor: "pink" }}
                        borderTopRightRadius={5}
                        borderTopLeftRadius={5}
                        resizeMode='stretch'
                        source={{ uri: imgQuiz }}
                    />
                    <View style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingVertical: 10,
                        flex: 1
                    }}>
                        <Text style={{ fontSize: 20, color: COLORS.black }}>{item.name}</Text>
                        {
                            item.description != '' ?
                                <Text numberOfLines={1} style={{ opacity: 0.5, fontSize: 16 }}>{item.description}</Text>
                                :
                                <></>
                        }
                        <View style={{ alignItems: "flex-start" }}>
                            <Text>Number of questions: <Text style={[styles.txt, { fontWeight: "bold" }]}>{item.numberOfQuestions}</Text></Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text>Categories: </Text>
                                <FlatList
                                    data={item.categories}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    renderItem={({ item, index }) =>
                                        <View key={index} style={styles.category}>
                                            <Text style={styles.txtCategory}>{item}</Text>
                                        </View>
                                    }
                                />
                            </View>
                        </View>
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
                                    playerList: [{
                                        userId: user.userId,
                                        userName: user.name,
                                        socketId: socketId,
                                        photo: user.photo
                                    }]
                                }
                                dispatch(POST_createGame(newGame)).then(() => {
                                    socketServcies.emit("init-game", game)
                                    navigation.navigate(screenName.WaitingRoom)
                                    bottomSheetModalRef.current?.close()
                                })

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
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        paddingVertical: 5,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    bottomSheet: {
        flex: 1,
        padding: 10,
    },
    txt: {
        fontSize: 15,
        color: COLORS.black
    },
    txtCategory: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.white,
    },
})
export default ItemQuiz
