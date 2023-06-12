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
    const quiz = useSelector((state) => state.newQuiz)

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
                size={22}
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
                                navigation.navigate(screenName.Home)
                                dispatch(clearInfoCompetitive())
                            }
                        },
                        {
                            text: "No"
                        }
                    ],
                )}
            />

            <Text style={styles.txtCurrentQuestion}>{`Question ${userCompetitive.currentIndexQuestion + 1} / ${quiz.numberOfQuestions}`}</Text>

            {
                userCompetitive.isActiveTimeCounter &&
                <CountdownCircleTimer
                    isPlaying={isPlayingCounter()}
                    duration={time}
                    trailColor={COLORS.gray}
                    size={30}
                    strokeWidth={3}
                    colors={[COLORS.success, COLORS.answerC, COLORS.error]}
                    colorsTime={[time, time / 3, 0]}
                    onUpdate={(currentTime) => handleUpdate(currentTime)}
                    onComplete={handleComplete}>
                    {({ remainingTime, color }) => <Text style={{ fontSize: 18, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                </CountdownCircleTimer>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
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
    txtCurrentQuestion: {
        color: COLORS.gray,
        fontSize: 16,
        fontWeight: "bold"
    }
})

export default React.memo(TopBar)
