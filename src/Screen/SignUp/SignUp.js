import React from 'react'
import { ScrollView, ToastAndroid, TouchableOpacity, View, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { COLORS, SIZES } from '../../common/theme'
import { BASE_URL, checkEmailIsInvalid } from '../../common/shareVarible'
import { img } from '../../assets/index'
import Icon from "react-native-vector-icons/Entypo"
import FormButton from '../../components/FormButton'
import FormInput from '../../components/FormInput'

const SignUp = () => {

    const navigation = useNavigation()

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSecure, setIsSecure] = React.useState(false)
    const [isSecure1, setIsSecure1] = React.useState(false)

    const handleRegister = () => {
        if (email == '' || password == '' || confirmPassword == '') {
            ToastAndroid.show("Empty Email or Password or ConfirmPassword", ToastAndroid.SHORT)
        } else if (checkEmailIsInvalid(email)) {
            ToastAndroid.show("Email invalid", ToastAndroid.SHORT)
        }
        else if (password !== confirmPassword) {
            ToastAndroid.show("Password and ConfirmPassword is not the same", ToastAndroid.SHORT)
        }
        else if (password.length < 8) {
            ToastAndroid.show("Password need at least 8 char", ToastAndroid.SHORT)
        }
        else {
            Post_Register()
        }
    };

    const Post_Register = async () => {
        setIsLoading(true)
        var url = BASE_URL + "/user/register"
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => {
                if (response.status == 200) {
                    Promise.resolve(response.json())
                        .then((obj) => {
                            console.log(obj)
                        })
                } else {
                    ToastAndroid.show("Wrong Email or Password")
                }
            }).finally(() => setIsLoading(false))

    }

    return (
        <TouchableWithoutFeedback
            onPress={() => { Keyboard.dismiss() }}
            accessible={false}>
            <View style={styles.container}>
                <StatusBar backgroundColor={COLORS.primary} barStyle={"light-content"} />
                <ScrollView
                    style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        style={styles.quizLogo}
                        source={img.quizLogo}
                    />
                    <FormInput
                        labelText="Email"
                        maxLength={40}
                        onChangeText={txt => setEmail(txt)}
                        value={email}
                        keyboardType={'email-address'}
                    />
                    <FormInput
                        labelText="Password"
                        maxLength={40}
                        onChangeText={txt => setPassword(txt)}
                        children={
                            <TouchableOpacity
                                onPress={() => setIsSecure(!isSecure)}
                                activeOpacity={0.6}
                                style={styles.viewIcon}>
                                <Icon
                                    name={isSecure ? "eye" : "eye-with-line"}
                                    size={28}
                                    color={COLORS.gray}
                                />
                            </TouchableOpacity>
                        }
                        value={password}
                        secureTextEntry={true}
                    />
                    <FormInput
                        labelText="Confirm Password"
                        onChangeText={txt => setConfirmPassword(txt)}
                        children={
                            <TouchableOpacity
                                onPress={() => setIsSecure1(!isSecure1)}
                                activeOpacity={0.6}
                                style={styles.viewIcon}>
                                <Icon
                                    name={isSecure1 ? "eye" : "eye-with-line"}
                                    size={28}
                                    color={COLORS.gray}
                                />
                            </TouchableOpacity>
                        }
                        value={confirmPassword}
                        secureTextEntry={true}
                    />
                    <FormButton
                        labelText="Register"
                        handleOnPress={handleRegister}
                        isLoading={isLoading}
                        style={{ width: '100%', marginVertical: 27 }}
                    />
                    <FormButton
                        labelText="Go back"
                        handleOnPress={() => {
                            navigation.navigate(screenName.SignIn)
                        }}
                        style={{ width: '100%' }}
                    />
                </ScrollView>
            </View>
        </TouchableWithoutFeedback >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
    },
    containerBottom: {
        alignItems: "center",
        marginVertical: 10
    },
    viewSocial: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
        width: "100%"
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    quizLogo: {
        height: SIZES.windowWidth * 0.3,
        width: SIZES.windowWidth * 0.6,
        alignSelf: "center"
    },
    txtRegister: {
        color: COLORS.primary,
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 15,
        marginLeft: 10
    },
    txt: {
        fontSize: 15,
    },
    img: {
        height: 120,
        width: 120
    },
    btnIcon: {
        backgroundColor: COLORS.primary,
        marginHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    }

})

export default SignUp;