import React from 'react'
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native'
import FormButton from '../../components/FormButton';
import { LoginButton, AccessToken, Profile, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next'
import { COLORS } from '../../common/theme'

const Test = () => {

    const [userInfo, setUserInfo] = React.useState({ name: "" })

    logoutWithFacebook = () => {
        LoginManager.logOut();
        setUserInfo({})
    };

    getInfoFromToken = token => {
        const PROFILE_REQUEST_PARAMS = {
            fields: {
                string: 'id,name,first_name,last_name',
            },
        };
        const profileRequest = new GraphRequest(
            '/me',
            { token, parameters: PROFILE_REQUEST_PARAMS },
            (error, user) => {
                if (error) {
                    console.log('login info has error: ' + error);
                } else {
                    setUserInfo(user)
                    console.log('result:', user);
                }
            },
        );
        new GraphRequestManager().addRequest(profileRequest).start();
    };

    loginWithFacebook = () => {
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithPermissions(['public_profile']).then(
            login => {
                if (login.isCancelled) {
                    console.log('Login cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        const accessToken = data.accessToken.toString();
                        console.log(accessToken)
                    });
                }
            },
            error => {
                console.log('Login fail with error: ' + error);
            },
        );
    }

    const isLogin = userInfo.name !== "" ? true : false
    const buttonText = isLogin ? 'Logout With Facebook' : 'Login From Facebook'
    const onPressButton = isLogin
        ? logoutWithFacebook()
        : loginWithFacebook()

    return (
        <View style={styles.container}>
            {/* login facebook */}
            <LoginButton
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            console.log("login has error: " + result.error);
                        } else if (result.isCancelled) {
                            console.log("login is cancelled.");
                            setUserInfo(null)
                        } else {
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    console.log(data.accessToken.toString())
                                }
                            )
                        }
                        const currentProfile = Profile.getCurrentProfile().then(
                            function (currentProfile) {
                                if (currentProfile) {
                                    console.log(currentProfile);
                                }
                            }
                        );
                    }
                }
                onLogoutFinished={() => console.log("logout.")} />
            {/* <TouchableOpacity
                onPress={onPressButton}
                style={{
                    backgroundColor: 'blue',
                    padding: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 16, marginVertical: 16, color: "white" }}>{buttonText}</Text>
            </TouchableOpacity>
            {userInfo.name && (
                <Text style={{ fontSize: 16, marginVertical: 16, color: "white" }}>
                    Logged in As {userInfo.name}
                </Text>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    txtChooseIMG: {
        opacity: 0.5,
        color: COLORS.primary
    },
    btnChooseIMG: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        backgroundColor: COLORS.primary + '20',
    },
    img: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    }
});

export default Test;