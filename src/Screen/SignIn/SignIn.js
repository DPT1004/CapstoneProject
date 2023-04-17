import React from 'react'
import { Button, Text, Touchable, TouchableOpacity, View } from 'react-native'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"


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
        </View>
    );
};


export default SignIn;