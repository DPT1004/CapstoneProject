import React from 'react'
import { Animated, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

const CustomTabBTN = (props) => {

    const selectedAnim = React.useRef(new Animated.Value(0)).current
    const focused = props.accessibilityState.selected
    React.useEffect(() => {
        if (focused) {
            Animated.timing(selectedAnim, {
                toValue: 1.5,
                duration: 300,
                useNativeDriver: true,
            }).start()

        } else {
            Animated.timing(selectedAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }

    }, [focused])
    return (
        <Animated.View style={[styles.container, {
            transform: [
                {
                    scale: selectedAnim
                },
                {
                    translateY: selectedAnim.interpolate({
                        inputRange: [1, 1.25, 1.5],
                        outputRange: [0, -10, -14]
                    })
                }
            ]
        }]}>
            <TouchableOpacity
                style={[styles.touch, { backgroundColor: focused ? props.tabItem.activeColorBG : props.tabItem.inActiveColorBG }]}
                onPress={props.onPress}>
                <Icon name={props.tabItem.icon} size={22} color={focused ? props.tabItem.activeColorIcon : props.tabItem.inActiveColorIcon} />
            </TouchableOpacity>
        </Animated.View>

    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    touch: {
        padding: 5,
        borderWidth: 2.2,
        borderColor: "white",
        borderRadius: 20,
    }
})

export default CustomTabBTN;