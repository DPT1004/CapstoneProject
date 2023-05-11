import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { COLORS } from '../../../common/theme'
import { uriImgQuiz } from '../../../common/shareVarible'

const ItemResultQuiz = ({ item, onChooseItem }) => {

    const imgQuiz = item.backgroundImage !== "" ? item.backgroundImage : uriImgQuiz

    return (
        <View>
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={() => onChooseItem(item.questionList)}
            >
                <Image
                    style={styles.quizBGR}
                    source={{ uri: imgQuiz }}
                />
                <View style={{ alignItems: "center", flex: 1 }}>
                    <Text style={[styles.txt, { fontSize: 16 }]}>{item.name}</Text>
                    {item.description != '' ? (
                        <Text style={styles.txtDecription}>{item.description}</Text>
                    ) : null}
                </View>
                <View style={styles.viewNumQuestion}>
                    <Text style={styles.txt}>{item.numberOfQuestions + " Qs"}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    quizBGR: {
        height: 60,
        width: 60,
        alignSelf: "center",
        borderRadius: 5
    },
    viewNumQuestion: {
        backgroundColor: COLORS.gray,
        paddingVertical: 2,
        paddingHorizontal: 10,
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
    contentContainer: {
        flex: 1,
        padding: 10,
    },
    txtDecription: {
        color: COLORS.gray,
        fontSize: 14
    },
    txt: {
        fontSize: 14,
        color: COLORS.black
    }
})
export default React.memo(ItemResultQuiz)
