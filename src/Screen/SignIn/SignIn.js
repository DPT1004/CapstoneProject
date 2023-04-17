import React from 'react'
import { Button, Text, View } from 'react-native'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { LoginButton, AccessToken } from 'react-native-fbsdk-next';


const SignIn = () => {

    const navigation = useNavigation()

    return (
        <View>
            <Text>This is Sign In</Text>
            <Button
                title='Go to SignUp'
                color={"red"}
                onPress={() => navigation.navigate(screenName.SignUp)}
            />
            <LoginButton
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            console.log("login has error: " + result.error);
                        } else if (result.isCancelled) {
                            console.log("login is cancelled.");
                        } else {
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    console.log(data.accessToken.toString())
                                }
                            )
                        }
                    }
                }
                onLogoutFinished={() => console.log("logout.")} />

        </View>
    );
};


export default SignIn;