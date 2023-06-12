import React from 'react'
import { Button, Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, Modal, Image, Alert, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../../common/theme'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    scopes: ['email'],
    webClientId: "17379159055-d7h444d8l7tdpeqkttu6rc3ltse5eb7n.apps.googleusercontent.com",
    offlineAccess: true
})

const Test1 = () => {

    const [userInfo, setuserInfo] = React.useState({})


    const signIn = async () => {

        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            console.log("userInfo ", userInfo)
            setuserInfo({ userInfo })
        } catch (error) {
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

    }

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setuserInfo({});
        } catch (error) {
            console.error(error);
        }
    }

    const getNewToken = async () => {
        try {
            var newToken = await GoogleSignin.getTokens()
            console.log("newToken ", newToken.accessToken)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <Button
                title={"Login"}
                onPress={() => signIn()}
            />
            <Button
                title={"LogOut"}
                onPress={() => signOut()}
            />
            <Button
                title={"New token"}
                onPress={() => getNewToken()}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    containerModal: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    childModal: {
        height: 150,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        borderRadius: 20,
    },
    btnCloseModal: {
        height: 30,
        width: 30,
        padding: 5,
        borderRadius: 3,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 4,
        bottom: 4,
        right: 5
    },

})

export default Test1