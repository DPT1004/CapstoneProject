import React from 'react'
import { View, Text, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { COLORS } from '../../common/theme'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from 'react-redux'
import { handleUserLogOut } from '../../redux/Slice/userSlice'

const HomeScreen = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)

    return (
        <TouchableWithoutFeedback
            onPress={() => { Keyboard.dismiss() }}
            accessible={false}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: COLORS.background,
                }}>
                <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />

                <View
                    style={{
                        backgroundColor: COLORS.white,
                        elevation: 4,
                        paddingHorizontal: 20, paddingBottom: 10
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, color: COLORS.black }}>{user.email}</Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => Alert.alert(
                                "OOPS !!!",
                                "You really want to log out ?",
                                [
                                    {
                                        text: "Yes",
                                        onPress: () => {
                                            dispatch(handleUserLogOut())
                                            navigation.navigate(screenName.SignIn)
                                        }
                                    },
                                    {
                                        text: "No"
                                    }
                                ],
                            )}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    padding: 10,
                                    color: COLORS.error,
                                }}
                            >
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView >
        </TouchableWithoutFeedback>
    );
};

export default HomeScreen;
