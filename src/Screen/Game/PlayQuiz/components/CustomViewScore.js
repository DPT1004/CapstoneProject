import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Animated
} from 'react-native'
import { COLORS } from '../../../../common/theme'
import Icon from 'react-native-vector-icons/AntDesign'

const heightViewScore = 68
const timeAnimation = 1500

const CustomViewScore = ({ score, isCorrect }) => {

    const animScore = React.useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        Animated.timing(animScore, {
            toValue: 1,
            duration: timeAnimation,
            useNativeDriver: true,
        }).start()
    }, [])

    const renderViewScore = () => {
        if (isCorrect) {
            return (
                <View style={styles.viewScore}>
                    <Text style={[styles.txtScoreCorrect, { fontSize: 15 }]}>Điểm trả lời </Text>
                    <Text style={styles.txtScoreCorrect}>{"+" + score}</Text>
                    <View style={styles.icon}>
                        <Icon
                            name="checkcircle"
                            size={30}
                            color={COLORS.success}
                        />
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={styles.viewScore}>
                    <Text style={styles.txtScoreIncorrect}>Câu trả lời sai</Text>
                    <View style={styles.icon}>
                        <Icon
                            name="closecircle"
                            size={30}
                            color={COLORS.error}
                        />
                    </View>
                </View>
            )
        }
    }

    return (

        <Animated.View style={[styles.containerScore, {
            transform: [
                {
                    translateY: animScore.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-heightViewScore, 0]
                    })
                }
            ],
            backgroundColor: isCorrect ? COLORS.success : COLORS.error
        }]}>
            {
                renderViewScore()
            }
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    containerScore: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 5,
        height: heightViewScore,
        backgroundColor: "red",
        position: "absolute",
        top: 0
    },
    viewScore: {
        backgroundColor: COLORS.white,
        width: "40%",
        borderRadius: 5,
        paddingHorizontal: 5,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    txtScoreCorrect: {
        fontSize: 25,
        fontWeight: "400",
        color: COLORS.success
    },
    txtScoreIncorrect: {
        fontSize: 18,
        fontWeight: "400",
        color: COLORS.error
    },
    icon: {
        position: "absolute",
        bottom: -5,
        right: -5
    }
})

export default CustomViewScore;
