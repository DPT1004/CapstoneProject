import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { COLORS } from '../../../common/theme'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Questions from './components/Questions'
import Overview from './components/Overview'
import { screenName } from '../../../navigator/screens-name'

const Tab = createMaterialTopTabNavigator()

const HostScreen = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
            }}
            initialLayout={screenName.Overview}
        >

            <Tab.Screen
                options={{
                    title: ({ color, focused }) => (
                        <Text style={{ fontSize: 20, fontWeight: "600", color: focused ? COLORS.primary : COLORS.gray }}>Overview</Text>
                    ),
                }}
                component={Overview}
                name={screenName.Overview}
            />
            <Tab.Screen
                options={{
                    title: ({ color, focused }) => (
                        <Text style={{ fontSize: 20, fontWeight: "600", color: focused ? COLORS.primary : COLORS.gray }}>Questions</Text>
                    ),
                }}
                component={Questions}
                name={screenName.Questions}
            />
        </Tab.Navigator>

    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    containerLeaderBoard: {
        flex: 1
    },
    containerTitleColumn: {
        flexDirection: "row",
        marginBottom: 10,
    },
    containerContentColumn: {
        flexDirection: "row",
        marginBottom: 10,
        paddingVertical: 5
    },
    containerBtnGoHomeAndSummary: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 5
    },
    viewTopButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderBottomWidth: 2,
        borderColor: COLORS.gray
    },
    viewTitleColumn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    viewTimeCounter: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    btnOverView: {
        backgroundColor: COLORS.gray,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 2,
        borderTopLeftRadius: 16
    },
    btnQuestions: {
        backgroundColor: COLORS.gray,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 16
    },
    imgAvatarPlayer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    txtTitleColumn: {
        color: COLORS.black,
        fontSize: 14,
        fontWeight: "bold",
    },
    txtContentColumn: {
        color: COLORS.black,
        fontSize: 18,
        fontWeight: "600",
    },
    txt: {
        fontWeight: "bold",
        color: COLORS.gray,
        fontSize: 18,
    }

})

export default HostScreen