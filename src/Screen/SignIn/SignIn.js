import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { LoginButton, AccessToken, Profile } from 'react-native-fbsdk-next'
import FormButton from '../../components/FormButton'
import FormInput from '../../components/FormInput'
import { COLORS } from '../../constants/theme'
import { signIn } from '../../utils/auth'


const SignIn = () => {

    const navigation = useNavigation()
    const [user, setUser] = React.useState(null)
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')

    const handleOnSubmit = () => {
        if (email != '' && password != '') {
            signIn(email, password);
        }
    };

    return (
        <View
            style={{
                backgroundColor: COLORS.white,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 20,
            }}>
            {/* Header */}
            <Text
                style={{
                    fontSize: 24,
                    color: COLORS.black,
                    fontWeight: 'bold',
                    marginVertical: 32,
                }}>
                Sign In
            </Text>

            {/* Email */}
            <FormInput
                labelText="Email"
                placeholderText="enter your email"
                onChangeText={value => setEmail(value)}
                value={email}
                keyboardType={'email-address'}
            />

            {/* Password */}
            <FormInput
                labelText="Password"
                placeholderText="enter your password"
                onChangeText={value => setPassword(value)}
                value={password}
                secureTextEntry={true}
            />

            {/* Submit button */}
            <FormButton
                labelText="Submit"
                handleOnPress={handleOnSubmit}
                style={{ width: '100%', marginBottom: 20 }}
            />

            {/* Login facebook */}
            <LoginButton

                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            console.log("login has error: " + result.error);
                        } else if (result.isCancelled) {
                            console.log("login is cancelled.");
                            setUser(null)
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
                                    setUser(currentProfile)
                                }
                            }
                        );
                    }
                }
                onLogoutFinished={() => console.log("logout.")} />

            {/* Footer */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                <Text>Don't have an account?</Text>
                <Text
                    style={{ marginLeft: 4, color: COLORS.primary }}
                    onPress={() => navigation.navigate('SignUpScreen')}>
                    Create account
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    img: {

        height: 120,
        width: 120
    }

})

export default SignIn;