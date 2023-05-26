import React from 'react'
import { Text, View, StyleSheet, StatusBar, FlatList, Button, LayoutAnimation } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { COLORS } from '../../common/theme'
import { shuffleArray } from '../../common/shareVarible'

const Test3 = () => {

    const [arr, setArr] = React.useState([
        { name: "acmvbnhdfhdfhdfhdfhdfdf", score: 234343 },
        { name: "cccccccccccccccccccccccccccc", score: 12345 },
        { name: "bbbbbbbbbbbbbbb", score: 67891 },
        { name: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", score: 111111 },
        { name: "xxxxxxxxxxxxxxxxxxxxxxxx", score: 222222 },
        { name: "nnnnnnnnnnn", score: 55555 },
        { name: "acmvbnhdfhdfhdfhdfhdfdf", score: 1111 },
        { name: "cccccccccccccccccccccccccccc", score: 2222 },
        { name: "bbbbbbbbbbbbbbb", score: 67891 },
        { name: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", score: 33 },
        { name: "xxxxxxxxxxxxxxxxxxxxxxxx", score: 4444 },
        { name: "nnnnnnnnnnn", score: 888 },
        { name: "acmvbnhdfhdfhdfhdfhdfdf", score: 898989 },
        { name: "cccccccccccccccccccccccccccc", score: 232323 },
        { name: "bbbbbbbbbbbbbbb", score: 67891 },
        { name: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", score: 77777 },
        { name: "xxxxxxxxxxxxxxxxxxxxxxxx", score: 25223434 },
        { name: "nnnnnnnnnnn", score: 232323 },
        { name: "xxxxxxxxxxxxxxxxxxxxxxxx", score: 4444 },
        { name: "nnnnnnnnnnn", score: 888 },
        { name: "acmvbnhdfhdfhdfhdfhdfdf", score: 898989 },
        { name: "cccccccccccccccccccccccccccc", score: 232323 },
        { name: "bbbbbbbbbbbbbbb", score: 67891 },
        { name: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", score: 77777 },
        { name: "xxxxxxxxxxxxxxxxxxxxxxxx", score: 25223434 },
        { name: "nnnnnnnnnnn", score: 232323 }
    ])
    const [choose, setChoose] = React.useState(1)
    const [ref, setRef] = React.useState(null)
    const time = 10

    const renderItem = ({ item, index }) => {
        if (index == choose) {
            return (
                <View style={styles.containerChooseTitleColumn}>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{index}</Text>
                    </View>
                    <View style={[styles.viewTitleColumn, { flex: 3 }]}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{item.name}</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtChooseContentColumn}>{item.score}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.containerContentColumn}>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{index}</Text>
                    </View>
                    <View style={[styles.viewTitleColumn, { flex: 3 }]}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{item.name}</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text
                            numberOfLines={1}
                            style={styles.txtContentColumn}>{item.score}</Text>
                    </View>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <Button
                title="Shuffle"
                onPress={() => {
                    var newArr = [...shuffleArray(arr)]
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                    setArr(newArr)
                }}
            />
            <Button
                title="Choose"
                onPress={() => {
                    var maxLimit = 25
                    let rand = Math.random() * maxLimit;
                    rand = Math.floor(rand)
                    setChoose(rand)

                    ref.scrollToIndex({
                        animated: true,
                        index: rand,
                        // viewOffset: 10,
                        viewPosition: 0.5
                    })
                }}
            />
            <View style={styles.containerLeaderBoard}>

                <View style={styles.containerTitleColumn}>

                    <View style={styles.viewTitleColumn}>
                        <Text style={styles.txtTitleColumn}>Rank</Text>
                    </View>
                    <View style={[styles.viewTitleColumn, { flex: 3 }]}>
                        <Text style={styles.txtTitleColumn}>Username</Text>
                    </View>
                    <View style={styles.viewTitleColumn}>
                        <Text style={styles.txtTitleColumn}>Score</Text>
                    </View>

                </View>

                <FlatList
                    data={arr}
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => setRef(ref)}
                    style={{}}
                    renderItem={renderItem}
                />
            </View>
            <View style={styles.viewTimeCounter}>
                <Text style={styles.txtNextQuestion}>Next question start in</Text>
                <CountdownCircleTimer
                    key={time}
                    isPlaying={true}
                    duration={time}
                    trailColor={COLORS.gray}
                    isSmoothColorTransition={true}
                    size={100}
                    strokeLinecap={"butt"}
                    strokeWidth={20}
                    colors={[COLORS.success, COLORS.gray]}
                    colorsTime={[time, 0]}
                >
                    {({ remainingTime, color }) => <Text style={{ fontSize: 50, fontWeight: "bold", color: color }}>{remainingTime}</Text>}
                </CountdownCircleTimer>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    containerLeaderBoard: {
        flex: 1
    },
    containerTitleColumn: {
        flexDirection: "row",
        marginBottom: 10,
    },
    containerContentColumn: {
        flexDirection: "row",
        marginBottom: 10,
    },
    containerChooseTitleColumn: {
        flexDirection: "row",
        marginBottom: 10,
        backgroundColor: COLORS.primary
    },
    viewTitleColumn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    viewTimeCounter: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
    },
    txtTitleColumn: {
        color: COLORS.black,
        fontSize: 25,
        fontWeight: "bold",
    },
    txtContentColumn: {
        color: COLORS.black,
        fontSize: 18,
        fontWeight: "600",
    },
    txtChooseContentColumn: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "600",
    },
    txtNextQuestion: {
        fontWeight: "bold",
        color: COLORS.gray,
        fontSize: 20
    }

})

export default Test3;