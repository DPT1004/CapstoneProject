import React from 'react'
import { Text, ScrollView, ToastAndroid, TouchableOpacity, View, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native'
import { screenName } from '../../navigator/screens-name'
import { useNavigation, useRoute } from "@react-navigation/native"
import { COLORS, SIZES } from '../../common/theme'
import { BASE_URL, webClientId, checkEmailIsInvalid } from '../../common/shareVarible'
import { img } from '../../assets/index'
import { useDispatch, useSelector } from 'react-redux'
import { handleUserLogin } from '../../redux/Slice/userSlice'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/AntDesign"
import Icon1 from "react-native-vector-icons/Entypo"
import FormButton from '../../components/FormButton'
import FormInput from '../../components/FormInput'


const listIcon = ["google"]
GoogleSignin.configure({
    scopes: ['email'],
    webClientId: webClientId,
    offlineAccess: true
})

const SignIn = () => {

    const route = useRoute()
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSecure, setIsSecure] = React.useState(true)
    const [rememberLogin, setRememberLogin] = React.useState(false)

    const storeLocalAccount = async (data) => {
        try {
            const account = JSON.stringify(data)
            await AsyncStorage.setItem("@account", account)
        } catch (e) { }
    }

    const getLocalAccount = async () => {
        try {
            var account = await AsyncStorage.getItem("@account")
            account = JSON.parse(account)
            if (account !== null) {
                if (account.rememberLogin) {
                    setEmail(account.email)
                    setPassword(account.password)
                    setRememberLogin(account.rememberLogin)
                }
            }
        } catch (e) {

        }
    }

    const getUserInfoFromLocalStore = async () => {
        var userInfo = await AsyncStorage.getItem("@userInfo")
        userInfo = JSON.parse(userInfo)
        if (userInfo !== null) {
            dispatch(handleUserLogin(userInfo))
        }
    }

    const handleLogin = () => {
        if (email == '' || password == '') {
            ToastAndroid.show("Empty Email or Password", ToastAndroid.SHORT)
        } else if (checkEmailIsInvalid(email)) {
            ToastAndroid.show("Email invalid", ToastAndroid.SHORT)
        }
        else {
            Post_Login()
        }
    }

    const handleDispatchAsync = async (data) => {
        await AsyncStorage.setItem('@userInfo', JSON.stringify(data))
        dispatch(handleUserLogin(data))
    }

    const Post_Login = async () => {
        try {
            setIsLoading(true)
            var url = BASE_URL + "/user/login"
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
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    handleDispatchAsync({
                                        ...data,
                                        isLoginBySocial: false
                                    })
                                })

                            if (rememberLogin) {
                                storeLocalAccount({
                                    email: email,
                                    password: password,
                                    rememberLogin: rememberLogin
                                })
                            } else {
                                setEmail("")
                                setPassword("")
                                storeLocalAccount(null)
                            }
                            navigation.navigate(screenName.BottomTab)
                        }
                    } else {
                        Promise.resolve(response.json())
                            .then((data) => {
                                ToastAndroid.show(data.message, ToastAndroid.SHORT)
                            })
                    }

                }).finally(() => setIsLoading(false))
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    const FaceBook_Login = async () => {
        var userInfo = {}
        var url = BASE_URL + "/user/loginWithSocial"
        var Error = ""
        try {
            await GoogleSignin.hasPlayServices()
            userInfo = await GoogleSignin.signIn()
        } catch (error) {
            Error = error.code
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }

        if (Error == "") {
            try {
                setIsLoading(true)
                await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userInfo.user.email,
                        photo: userInfo.user.photo,
                        name: userInfo.user.name,
                    }),
                })
                    .then(response => {
                        if (response.ok) {
                            if (response.status == 200) {
                                Promise.resolve(response.json())
                                    .then((data) => {
                                        handleDispatchAsync({
                                            ...data,
                                            isLoginBySocial: true
                                        })
                                    }).then(() => navigation.navigate(screenName.BottomTab))

                            }
                        } else {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    ToastAndroid.show(data.message, ToastAndroid.SHORT)
                                })
                        }

                    }).finally(() => setIsLoading(false))

            } catch (error) {
                setIsLoading(false)
                ToastAndroid.show(String(error), ToastAndroid.SHORT)
            }
        }
    }

    React.useEffect(() => {
        if (route.params?.newEmail !== undefined && route.params?.newPassword !== undefined) {
            setEmail(route.params?.newEmail)
            setPassword(route.params?.newPassword)
        }
    }, [route.params?.newEmail, route.params?.newPassword])

    React.useEffect(() => {
        getUserInfoFromLocalStore()
        getLocalAccount()
        if (user.token !== "") {
            navigation.navigate(screenName.BottomTab)
        }
    }, [user])

    React.useEffect(() => {

    }, [])

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
                        resizeMode='contain'
                    />
                    <FormInput
                        labelText="Email"
                        editable={!isLoading}
                        maxLength={40}
                        onChangeText={txt => setEmail(txt)}
                        value={email}
                        keyboardType={'email-address'}
                    />
                    <FormInput
                        labelText="Password"
                        editable={!isLoading}
                        children={
                            <TouchableOpacity
                                onPress={() => setIsSecure(!isSecure)}
                                activeOpacity={0.6}
                                style={styles.viewIcon}>
                                <Icon1
                                    name={isSecure ? "eye" : "eye-with-line"}
                                    size={28}
                                    color={COLORS.gray}
                                />
                            </TouchableOpacity>
                        }
                        maxLength={40}
                        onChangeText={txt => setPassword(txt)}
                        value={password}
                        secureTextEntry={isSecure}
                    />
                    <FormButton
                        labelText="Login"
                        disable={isLoading}
                        handleOnPress={handleLogin}
                        isLoading={isLoading}
                        style={{ width: '100%', marginTop: 27 }}
                    />

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.btnCheckRemember}
                        onPress={() => setRememberLogin(!rememberLogin)}
                    >
                        <Text style={{ fontSize: 10 }}>Remember account  </Text>
                        <View style={styles.viewCheckRemember}>
                            {
                                rememberLogin &&
                                <Icon
                                    name={"check"}
                                    size={20}
                                    color={COLORS.primary} />
                            }
                        </View>
                    </TouchableOpacity>

                    <View style={styles.containerBottom}>
                        <Text style={styles.txt}>---You can login with---</Text>
                        <View style={styles.viewSocial}>
                            {
                                listIcon.map((item, index) =>
                                    <TouchableOpacity
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            if (item == "google") {
                                                FaceBook_Login()
                                            }
                                        }}
                                        key={index}
                                        style={styles.btnIcon}>
                                        <Icon
                                            name={item}
                                            size={28}
                                            color={COLORS.primary}
                                        />
                                        <Text style={{ marginLeft: 10, color: COLORS.primary, fontSize: 18 }}>Sign in with Google</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        <Text style={styles.txt}>
                            Don't you have an account?
                            <Text style={styles.txtRegister} onPress={() => navigation.navigate(screenName.SignUp)}>
                                {"  Register"}
                            </Text>
                        </Text>
                    </View>
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
    viewCheckRemember: {
        height: 20,
        width: 20,
        borderRadius: 2,
        backgroundColor: COLORS.gray,
        alignItems: "center",
        justifyContent: "center",
    },
    quizLogo: {
        height: SIZES.windowWidth * 0.3,
        width: SIZES.windowWidth * 0.6,
        aspectRatio: 2,
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
        flexDirection: "row",
        backgroundColor: COLORS.gray,
        marginHorizontal: 30,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    btnCheckRemember: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        marginVertical: 10
    },

})

export default SignIn;