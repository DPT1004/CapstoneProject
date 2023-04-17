import React from 'react'
import { Text, View, Button, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/Slice/counterSlice'
import { updateText } from '../../redux/Slice/textSlice'

const Test = () => {

    const [txtInput, setTxtInput] = React.useState("")
    const navigation = useNavigation()
    const count = useSelector((state) => state.counter.value)
    const text = useSelector((state) => state.text.value)
    const dispatch = useDispatch()
    return (
        <View>
            <Text>This is Test <Icon name="comments" size={30} color="pink" /></Text>
            <Button
                title='Go to Home'
                color={"pink"}
                onPress={() => navigation.navigate(screenName.BottomTab, { screenName: screenName.Home })}
            />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => dispatch(increment())}
                >
                    <Text>Increase</Text>
                </TouchableOpacity>
                <Text style={styles.txt}>{count}</Text>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => dispatch(decrement())}
                >
                    <Text>Decrease</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TextInput
                    placeholder='fill me'
                    defaultValue={text}
                    style={{ borderWidth: 1, width: "80%" }}
                    onChangeText={(txt) => setTxtInput(txt)} />
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => dispatch(updateText(txtInput))}
                >
                    <Text>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 25
    },
    btn: {
        backgroundColor: "orange",
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    txt: {
        fontWeight: "bold",
        fontSize: 30,
        marginHorizontal: 40
    }

})

export default Test;