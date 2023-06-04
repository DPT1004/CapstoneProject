import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native'
import { COLORS } from '../../../../common/theme'
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux'
import { clearGame } from '../../../../redux/Slice/gameSlice'
import { clearInfoCompetitive } from '../../../../redux/Slice/userCompetitiveSlice'
import { screenName } from '../../../../navigator/screens-name'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import socketServices from '../../../../until/socketServices'
import Icon from 'react-native-vector-icons/Entypo'

const TopBar = ({ userAnswer, activeSubmit, time, handleUpdate, handleComplete }) => {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const userCompetitive = useSelector((state) => state.userCompetitive)
    const user = useSelector((state) => state.user)
    const game = useSelector((state) => state.game)

    const isPlayingCounter = () => {
        if (userAnswer !== undefined) {
            if (userAnswer.length !== 0) {
                return false
            }
        } else if (activeSubmit !== undefined) {
            if (activeSubmit == true) {
                return false
            }
        }
        return true
    }

    return (

        <View style={styles.container}>
            <Icon
                name="arrow-long-left"
                size={24}
                color={COLORS.gray}
                onPress={() => Alert.alert(
                    "OOPS !!!",
                    "Are you sure to quit game?",
                    [
                        {
                            text: "Yes",
                            onPress: () => {
                                var pin = game.pin
                                var userId = user.userId
                                socketServices.emit("player-quit-when-game-isPlaying", { userId, pin })
                                dispatch(clearGame())
                                dispatch(clearInfoCompetitive())
                                navigation.navigate(screenName.Home)
                            }
                        },
                        {
                            text: "No"
                        }
                    ],
                )}
            />
            <View style={styles.containerCorrectAndIncorrect}>
                <View style={styles.viewCorrect}>
                    <Icon
                        name="check"
                        size={14}
                        style={{ color: COLORS.white }}
                    />
                    <Text style={styles.txtCorrectAndIncorrect}>{userCompetitive.correctCount} </Text>
                </View>
                <View style={styles.viewIncorrect}>
                    <Icon
                        name="cross"
                        size={14}
                        style={{ color: COLORS.white }}
                    />
                    <Text style={styles.txtCorrectAndIncorrect}>{userCompetitive.incorrectCount}</Text>
                </View>
            </View>

            <CountdownCircleTimer
                isPlaying={isPlayingCounter()}
                duration={time}
                trailColor={COLORS.gray}
                size={40}
                strokeWidth={5}
                colors={[COLORS.success, COLORS.answerC, COLORS.error]}
                colorsTime={[time, time / 3, 0]}
                onUpdate={(currentTime) => handleUpdate(currentTime)}
                onComplete={handleComplete}>
                {({ remainingTime, color }) => <Text style={{ fontSize: 20, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
            </CountdownCircleTimer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        elevation: 4,
        marginVertical: 5
    },
    containerCorrectAndIncorrect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewCorrect: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    viewIncorrect: {
        backgroundColor: COLORS.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    txtCorrectAndIncorrect: {
        color: COLORS.white,
        marginLeft: 6
    }
})

export default React.memo(TopBar)
