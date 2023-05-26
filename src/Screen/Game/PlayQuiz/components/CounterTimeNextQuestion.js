import React from 'react'
import { Text, View, StyleSheet, StatusBar } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { COLORS } from '../../../../common/theme'

const Test3 = () => {

    const time = 10
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <CountdownCircleTimer
                key={time}
                isPlaying={true}
                duration={time}
                trailColor={COLORS.gray}
                isSmoothColorTransition={true}
                size={250}
                strokeLinecap={"butt"}
                strokeWidth={20}
                colors={[COLORS.success, COLORS.answerC, COLORS.error]}
                colorsTime={[time, time / 3, 0]}
                onUpdate={(currentTime) => {

                }}
                onComplete={() => {

                }}>
                {({ remainingTime, color }) => <Text style={{ fontSize: 90, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
            </CountdownCircleTimer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    }

})

export default Test3;