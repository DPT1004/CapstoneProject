import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../common/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const FormInputCheckBox = ({
    labelText = '',
    placeholderText = '',
    onChangeText = null,
    value = {
        isCorrect: false,
        answer: "",
        img: ""
    },
    onPress = () => { },
    maxLength = 65,
    showCharCount = false,
    ...props
}) => {
    const [widthTxtInput, setWidthTxtInput] = React.useState(0)

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", width: widthTxtInput }}>
                <Text>{labelText}</Text>
                <View style={styles.viewFlex1} />
                {
                    showCharCount ?
                        <Text>{value.answer.length + "/" + maxLength}</Text>
                        :
                        <></>
                }
            </View>
            <View style={styles.viewRow}>
                <TextInput
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout
                        setWidthTxtInput(width)
                    }}
                    style={styles.txtInput}
                    multiline={true}
                    placeholder={placeholderText}
                    onChangeText={onChangeText}
                    value={value.answer}
                    maxLength={maxLength}
                    {...props}
                />
                <TouchableOpacity
                    style={styles.btnCheck}
                    onPress={onPress}
                >
                    <Icon
                        name="checkbox-marked"
                        size={30}
                        color={value.isCorrect ? "lightgreen" : COLORS.gray}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20
    },
    viewRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    viewFlex1: {
        flex: 1
    },
    txtInput: {
        padding: 10,
        borderColor: COLORS.black + '20',
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        marginTop: 10,
    },
    btnCheck: {
        padding: 10,
        paddingRight: 0
    }
})

export default FormInputCheckBox;
