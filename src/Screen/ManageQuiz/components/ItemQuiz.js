import React from 'react'
import { View, Text, StyleSheet, Image, Alert, ToastAndroid } from 'react-native'
import { COLORS } from '../../../common/theme'
import { BASE_URL } from '../../../common/shareVarible'
import { screenName } from '../../../navigator/screens-name'
import { img } from '../../../assets/index'
import { useNavigation } from "@react-navigation/native"
import { useSelector } from 'react-redux'
import {
    BottomSheetModal,
} from '@gorhom/bottom-sheet'
import FormButton from '../../../components/FormButton'
import Icon from 'react-native-vector-icons/Feather'
import Icon1 from 'react-native-vector-icons/Octicons'

const ItemQuiz = ({ item, index, setRefreshing }) => {

    const navigation = useNavigation()
    const user = useSelector((state) => state.user)

    const bottomSheetModalRef = React.useRef(null);
    const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);

    const deleteQuiz = async () => {
        var url = BASE_URL + "/quiz/" + item._id
        setRefreshing(true)
        try {
            await fetch(url, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    ToastAndroid.show(data.message, ToastAndroid.SHORT)
                                })
                        }
                    } else {
                        Promise.resolve(response.json())
                            .then((data) => {
                                ToastAndroid.show(data.message, ToastAndroid.SHORT)
                            })
                    }

                }).finally(() => setRefreshing(false))
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Image
                    style={styles.quizBGR}
                    source={img.quizBGR}
                />
                <View style={{ alignItems: "center", flex: 1 }}>
                    <Text style={[styles.txt, { fontSize: 20 }]}>{item.name}</Text>
                    {item.description != '' ? (
                        <Text style={{ opacity: 0.5 }}>{item.description}</Text>
                    ) : null}
                </View>

                <Icon
                    name={"more-horizontal"}
                    style={{ position: "absolute", top: 2, right: 5 }}
                    size={25}
                    color={COLORS.gray}
                    onPress={() => bottomSheetModalRef.current?.present()}
                />
                <View style={styles.viewNumQuestion}>
                    <Text style={styles.txt}>{item.numberOfQuestions + " Qs"}</Text>
                </View>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
            >
                <View style={styles.contentContainer}>
                    <FormButton
                        labelText="Play Quiz"
                        isPrimary={true}
                        style={{ marginBottom: 20 }}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon1
                                    name={"play"}
                                    size={20}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        handleOnPress={() => {
                            bottomSheetModalRef.current?.close()
                            navigation.navigate(screenName.PlayQuiz, {
                                questionList: item.questionList
                            })
                        }
                        }
                    />
                    <FormButton
                        labelText="Edit Quiz"
                        isPrimary={true}
                        style={{ marginBottom: 20 }}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon1
                                    name={"pencil"}
                                    size={20}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        handleOnPress={() => { bottomSheetModalRef.current?.close() }}
                    />
                    <FormButton
                        labelText="Delete Quiz"
                        isPrimary={true}
                        style={{ marginBottom: 20 }}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon1
                                    name={"trash"}
                                    size={20}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        handleOnPress={() => Alert.alert(
                            "OOPS !!!",
                            "You really want to delete this Quiz ?",
                            [
                                {
                                    text: "Yes",
                                    onPress: () => {
                                        bottomSheetModalRef.current?.close()
                                        deleteQuiz()
                                    }
                                },
                                {
                                    text: "No"
                                }
                            ],
                        )}
                    />
                    <FormButton
                        labelText="Cancel"
                        isPrimary={false}
                        style={{ marginBottom: 20 }}
                        handleOnPress={() => bottomSheetModalRef.current?.close()}
                    />
                </View>
            </BottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 5,
        marginBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    quizBGR: {
        height: 80,
        width: 80,
        alignSelf: "center"
    },
    viewNumQuestion: {
        backgroundColor: COLORS.gray,
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        position: "absolute",
        bottom: 5,
        right: 5
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    txt: {
        fontSize: 15,
        color: COLORS.black
    }
})
export default ItemQuiz;
