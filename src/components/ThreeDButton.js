import React from "react"
import { COLORS } from '../common/theme'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated } from "react-native"


const ThreeDButton = ({ onPress = null, label, heightBtn = 80, widthBtn = "100%", styleButton, styleLabel, styleOuter }) => {
    const animButton = React.useRef(new Animated.Value(0)).current

    handlePress = async () => {
        Animated.sequence([
            Animated.timing(animButton, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(animButton, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            })

        ]).start(() => onPress !== null ? onPress() : () => null)
    }


    return (
        <View style={{ width: widthBtn, height: heightBtn, ...styleButton }}>
            <TouchableWithoutFeedback onPress={handlePress} >
                <View style={[styles.outer, { ...styleOuter }]}>
                    <Animated.View style={[styles.height, {
                        marginTop: animButton.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-15, 0],
                        }),
                        paddingBottom: animButton.interpolate({
                            inputRange: [0, 1],
                            outputRange: [15, 0],
                        }),
                    }]}>
                        <Animated.View style={[styles.inner, {
                            borderRadius: animButton.interpolate({
                                inputRange: [0, 1],
                                outputRange: [12, 16],
                            }),
                        }]}>
                            <Text style={[styles.txtLabel, { ...styleLabel }]}>{label}</Text>
                        </Animated.View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default ThreeDButton

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.black,
        borderRadius: 14,
    },
    height: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
    },
    inner: {
        height: "100%",
        backgroundColor: "#4C46FF",
        alignItems: "center",
        justifyContent: "center",
    },
    txtLabel: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20,
    },
});