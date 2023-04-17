import React from 'react'
import { Text, View, Button } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"

const SignUp = () => {

    const navigation = useNavigation()
    return (
        <View>
            <Text>This is Sign Up <Icon name="comments" size={30} color="red" /></Text>
            <Button
                title='Go to Home'
                color={"blue"}
                onPress={() => navigation.navigate(screenName.Home)}
            />
        </View>
    );
};


export default SignUp;