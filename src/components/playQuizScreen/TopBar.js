import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../navigator/screens-name'
import Icon from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux'
import { clearInfoCompetitive } from '../../redux/Slice/userCompetitiveSlice'

const TopBar = ({ children }) => {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const userCompetitive = useSelector((state) => state.userCompetitive)

    return (

        <View style={styles.container}>
            <Icon
                name="arrow-long-left"
                size={24}
                color={COLORS.gray}
                onPress={() => Alert.alert(
                    "OOPS !!!",
                    "Are you sure to quit game?",
                    [
                        {
                            text: "Yes",
                            onPress: () => {
                                dispatch(clearInfoCompetitive())
                                navigation.navigate(screenName.Home)
                            }
                        },
                        {
                            text: "No"
                        }
                    ],
                )}
            />
            <View style={styles.containerCorrectAndIncorrect}>
                <View style={styles.viewCorrect}>
                    <Icon
                        name="check"
                        size={14}
                        style={{ color: COLORS.white }}
                    />
                    <Text style={styles.txtCorrectAndIncorrect}>{userCompetitive.correctCount} </Text>
                </View>
                <View style={styles.viewIncorrect}>
                    <Icon
                        name="cross"
                        size={14}
                        style={{ color: COLORS.white }}
                    />
                    <Text style={styles.txtCorrectAndIncorrect}>{userCompetitive.incorrectCount}</Text>
                </View>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        elevation: 4,
        marginVertical: 5
    },
    containerCorrectAndIncorrect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewCorrect: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    viewIncorrect: {
        backgroundColor: COLORS.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    txtCorrectAndIncorrect: {
        color: COLORS.white,
        marginLeft: 6
    }
})

export default TopBar;
