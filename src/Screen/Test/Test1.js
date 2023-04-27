import React from 'react'
import { Button, Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/Slice/counterSlice'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const Test1 = () => {

    const navigation = useNavigation()
    const [imgPath, setImgPath] = React.useState(null)
    const [uploading, setUploading] = React.useState(false)
    const count = useSelector((state) => state.counter.value)
    const text = useSelector((state) => state.text.value)
    const dispatch = useDispatch()

    const openLibraryIMG = async () => {
        await ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            setImgPath(image)
        });
    }

    const uploadIMG = async () => {

        setUploading(true)
        try {
            await storage().ref("IMG1").putFile(imgPath.path)
            setUploading(false)
            Alert.alert("Upload done")
        } catch (e) {
            console.log(e);
        }
        setImgPath(null)
    }

    return (
        <View>
            <Text>This is Test 1</Text>
            <Button
                title='Go to SignIn'
                color={"green"}
                onPress={() => navigation.navigate(screenName.SignIn)}
            />
            <Text>Text from Redux a: {text}</Text>
            <Button
                title='Go to Test'
                color={"pink"}
                onPress={() => navigation.navigate(screenName.Test)}
            />
            <View style={styles.containerBtn}>
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
            <TouchableOpacity
                style={styles.btnChooseIMG}
                disabled={uploading}
                onPress={() => openLibraryIMG()}
            >
                {
                    imgPath !== undefined ?

                        <Image
                            style={styles.img}
                            source={{
                                uri: imgPath !== null ? imgPath.path : 'https://upload.wikimedia.org/wikipedia/vi/thumb/2/26/Paul_Rudish_Mickey_Mouse.png/220px-Paul_Rudish_Mickey_Mouse.png',
                            }}
                        />
                        :
                        <Text>Choose Image</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => uploadIMG()}
            >
                <Text>Post IMG</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBtn: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 25
    },
    btnChooseIMG: {
        backgroundColor: "orange",
        height: 120,
        width: 120,
        justifyContent: "center",
        alignItems: "center"
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
    },
    img: {

        height: 120,
        width: 120
    }

})

export default Test1;