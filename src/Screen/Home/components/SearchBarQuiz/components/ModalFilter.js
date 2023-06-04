import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Text, ToastAndroid, LayoutAnimation } from 'react-native'
import { COLORS } from '../../../../../common/theme'
import { BASE_URL } from '../../../../../common/shareVarible'
import { useDispatch, useSelector } from 'react-redux'
import { setChooseCategories } from '../../../../../redux/Slice/listQuizSlice'
import Icon from 'react-native-vector-icons/FontAwesome'

const ModalFilter = ({ modalVisible, onPressVisible }) => {

    const dispatch = useDispatch()
    const listQuiz = useSelector((state) => state.listQuiz)

    const [categories, setCategories] = React.useState([])
    const [isLoadingCateogries, setIsLoadingCateogries] = React.useState(false)

    const GET_AllCategory = async () => {
        setIsLoadingCateogries(true)
        var url = BASE_URL + "/category"
        try {
            await fetch(url, {
                method: "GET"
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    setCategories(data)
                                })
                        }
                    }
                }).finally(() => setIsLoadingCateogries(false))
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        GET_AllCategory()
    }, [])

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.containerModal}>
                <View style={styles.childModal}>
                    <View style={styles.viewTop}>
                        {/*Button close modal */}
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            activeOpacity={0.4}
                            onPress={onPressVisible} >
                            <Icon
                                name={"close"}
                                size={20}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.viewBottom}>

                        <Text style={styles.txt}>Choose category</Text>
                        <View style={styles.containerCategory}>
                            {
                                isLoadingCateogries ? <ActivityIndicator size={40} color={COLORS.gray} style={{ alignSelf: "center" }} />
                                    :
                                    categories.map((item) => (
                                        <TouchableOpacity
                                            key={item._id}
                                            style={[styles.btnCategory, { backgroundColor: listQuiz.chooseCategories.includes(item.name) ? COLORS.primary : COLORS.gray }]}
                                            onPress={() => {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

                                                var newChooseCategory = [...listQuiz.chooseCategories]
                                                if (!newChooseCategory.includes(item.name)) {
                                                    newChooseCategory.push(item.name)
                                                }
                                                else {
                                                    newChooseCategory.splice(newChooseCategory.indexOf(item.name), 1);
                                                }
                                                dispatch(setChooseCategories(newChooseCategory))
                                            }}>
                                            <Text style={[styles.txtCategory, { color: listQuiz.chooseCategories.includes(item.name) ? COLORS.white : COLORS.black }]}>{item.name}</Text>
                                        </TouchableOpacity>))
                            }
                        </View>

                    </ScrollView>

                </View>
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    containerModal: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    childModal: {
        height: "60%",
        width: "80%",
        backgroundColor: COLORS.white,
        borderRadius: 5,
    },
    viewTop: {
        height: 40,
        width: "100%",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: COLORS.white,
        elevation: 4,
        flexDirection: "row",
        alignItems: 'center'
    },
    viewBottom: {
        flex: 1,
        paddingHorizontal: 5,
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerCategory: {
        flexWrap: "wrap",
        flexDirection: "row",
    },
    txtCategory: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.black
    },
    btnCloseModal: {
        height: 30,
        width: 30,
        padding: 5,
        borderRadius: 5,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
        position: "absolute",
        right: 5
    },
    btnCategory: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.gray,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        margin: 5,
    },
    txt: {
        alignSelf: "center",
        color: COLORS.error,
        fontWeight: "bold",
        marginTop: 25,
        fontSize: 20,
        marginBottom: 10
    },

})

export default ModalFilter