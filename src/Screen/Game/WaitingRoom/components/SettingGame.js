import React from 'react'
import { View, Text, StyleSheet, Animated, Image, Switch, LayoutAnimation, TouchableOpacity } from 'react-native'
import { COLORS, SIZES } from '../../../../common/theme'
import { img } from '../../../../assets/index'
import { useDispatch, useSelector } from 'react-redux'
import { setIsActiveShuffleQuestion, setIsActiveTimeCounter, setTypeActiveShuffle, setIsHostJoinGame } from '../../../../redux/Slice/userCompetitiveSlice'
import Icon from 'react-native-vector-icons/Ionicons'

const widthViewSetting = SIZES.windowWidth * 0.75
const timeAnimation = 100

const SettingGame = ({ isShow }) => {

    const dispatch = useDispatch()
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const animScore = React.useRef(new Animated.Value(-widthViewSetting)).current

    React.useEffect(() => {
        if (isShow) {
            Animated.timing(animScore, {
                toValue: 0,
                duration: timeAnimation,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(animScore, {
                toValue: -widthViewSetting,
                duration: timeAnimation,
                useNativeDriver: true,
            }).start()
        }

    }, [isShow])


    return (

        <Animated.View style={[styles.container, {
            transform: [
                {
                    translateX: animScore
                }
            ],
        }]}>
            <Image
                source={img.quizLogo}
                style={styles.imgLogo}
                resizeMode='contain'
            />

            {/**Is Host join Game */}
            <View style={styles.rowItem}>
                <Icon
                    name={"game-controller"}
                    size={25}
                    color={COLORS.gray}
                />
                <Text style={styles.txt}>Host Join Game</Text>
                <Switch
                    trackColor={{ false: COLORS.gray, true: COLORS.bgrForPrimary }}
                    thumbColor={userCompetitive.isHostJoinGame ? COLORS.primary : COLORS.gray}
                    value={userCompetitive.isHostJoinGame}
                    onValueChange={() => dispatch(setIsHostJoinGame(!userCompetitive.isHostJoinGame))}
                />
            </View>

            {/**Time counter*/}
            <View style={styles.rowItem}>
                <Icon
                    name={"timer"}
                    size={25}
                    color={COLORS.gray}
                />
                <Text style={styles.txt}>Time Counter</Text>
                <Switch
                    trackColor={{ false: COLORS.gray, true: COLORS.bgrForPrimary }}
                    thumbColor={userCompetitive.isActiveTimeCounter ? COLORS.primary : COLORS.gray}
                    value={userCompetitive.isActiveTimeCounter}
                    onValueChange={() => dispatch(setIsActiveTimeCounter(!userCompetitive.isActiveTimeCounter))}
                />
            </View>

            {/**Shuffle question */}
            <View style={styles.rowItem}>
                <Icon
                    name={"shuffle"}
                    size={25}
                    color={COLORS.gray}
                />
                <Text style={styles.txt}>Shuffle Question</Text>
                <Switch
                    trackColor={{ false: COLORS.gray, true: COLORS.bgrForPrimary }}
                    thumbColor={userCompetitive.isActiveShuffleQuestion ? COLORS.primary : COLORS.gray}
                    value={userCompetitive.isActiveShuffleQuestion}
                    onValueChange={() => {
                        LayoutAnimation.configureNext({
                            duration: 300,
                            create: { type: "easeIn", property: "scaleXY" },
                            update: { type: 'easeIn', property: 'scaleXY' },
                            delete: { type: 'easeIn', property: 'scaleXY' },
                        })
                        dispatch(setIsActiveShuffleQuestion(!userCompetitive.isActiveShuffleQuestion))
                    }}
                />
            </View>

            {/**Shuffle child option */}
            {
                userCompetitive.isActiveShuffleQuestion &&
                <View>

                    <View style={styles.rowItemShuffleChild}>
                        <Text style={styles.txtShuffleChild}>Shuffle For Each Player</Text>
                        <View style={[styles.viewChooseShuffle, { backgroundColor: userCompetitive.typeActiveShuffle == 1 ? COLORS.primary : COLORS.gray }]}>
                            <TouchableOpacity
                                disabled={userCompetitive.typeActiveShuffle == 1 ? true : false}
                                onPress={() => {
                                    dispatch(setTypeActiveShuffle(1))
                                }}
                                style={styles.btnChooseShuffle}>
                                {
                                    userCompetitive.typeActiveShuffle == 1 &&
                                    <Icon
                                        name={"ios-checkmark"}
                                        size={16}
                                        color={COLORS.white} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.rowItemShuffleChild}>
                        <Text style={styles.txtShuffleChild}>Shuffle For All Player</Text>
                        <View style={[styles.viewChooseShuffle, { backgroundColor: userCompetitive.typeActiveShuffle == 2 ? COLORS.primary : COLORS.gray }]}>
                            <TouchableOpacity
                                disabled={userCompetitive.typeActiveShuffle == 2 ? true : false}
                                onPress={() => {
                                    dispatch(setTypeActiveShuffle(2))
                                }}
                                style={styles.btnChooseShuffle}>
                                {
                                    userCompetitive.typeActiveShuffle == 2 &&
                                    <Icon
                                        name={"ios-checkmark"}
                                        size={16}
                                        color={COLORS.white} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            }

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: SIZES.windowHeight,
        width: widthViewSetting,
        elevation: 5,
        paddingVertical: 5,
        backgroundColor: COLORS.white,
        position: "absolute",
        left: 0
    },
    imgLogo: {
        width: widthViewSetting * 0.8,
        height: widthViewSetting * 0.4,
        alignSelf: "center",
    },
    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
        paddingLeft: 5,
        borderColor: COLORS.gray
    },
    rowItemShuffleChild: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        justifyContent: "space-between",
        paddingVertical: 15,
    },
    viewChooseShuffle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    btnChooseShuffle: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    txt: {
        fontSize: 18,
        color: COLORS.gray,
        fontWeight: "bold"
    },
    txtShuffleChild: {
        fontSize: 14,
        color: COLORS.gray,
        fontWeight: "bold"
    }
})

export default SettingGame;
