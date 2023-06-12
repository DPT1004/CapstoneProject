import React from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Modal, StyleSheet, LayoutAnimation, FlatList, ToastAndroid, Animated, Easing, ActivityIndicator } from 'react-native'
import { COLORS } from '../../common/theme'
import { BASE_URL, arrQuestionType } from '../../common/shareVarible'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ItemListQuestion from './components/ItemListQuestion'
import { img } from '../../assets'


const SearchBar = ({ more, style }) => {

    const user = useSelector((state) => state.user)
    const rotateValue = React.useRef(new Animated.Value(0)).current

    const [txtSearch, setTxtSearch] = React.useState("")
    const [showQuestionType, setShowQuestionType] = React.useState(false)
    const [chooseQuestionType, setChooseQuestionType] = React.useState([])
    const [result, SetResult] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)

    const getOptionTxtCategory = (item) => {
        if (chooseQuestionType.includes(item)) {
            return COLORS.white
        } else {
            return COLORS.black
        }
    }

    const getOptionBgColor = (item) => {
        if (chooseQuestionType.includes(item)) {
            return COLORS.primary
        } else {
            return COLORS.gray
        }
    }

    const handleSearch = () => {
        if (txtSearch == "" && chooseQuestionType.length == 0) {
            ToastAndroid.show("Type something to search", ToastAndroid.SHORT)
        } else {
            Get_SearchQuiz()
        }
    }

    const Get_SearchQuiz = async () => {
        try {
            setIsLoading(true)
            var url = BASE_URL + "/questionBank/search"
            await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    searchQuery: txtSearch,
                    arrQuestionType: chooseQuestionType
                })
            })
                .then(response => {
                    if (response.ok) {
                        if (response.status == 200) {
                            Promise.resolve(response.json())
                                .then((data) => {
                                    SetResult(data)
                                })
                        }
                    } else {
                        Promise.resolve(response.json())
                            .then((data) => {
                                ToastAndroid.show(data.message, ToastAndroid.SHORT)
                            })
                    }
                }).finally(() => {
                    setIsLoading(false)
                    setModalVisible(true)
                })
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        if (showQuestionType) {
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(rotateValue, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start()
        }
    }, [showQuestionType])

    return (
        <View style={[styles.container, { ...style }]}  {...more}>
            <Animated.View style={{
                transform: [{
                    rotate: rotateValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                    })
                },]
            }}>
                <TouchableOpacity
                    style={[styles.btnFilter,]}
                    activeOpacity={0.4}
                    onPress={() => {
                        LayoutAnimation.configureNext({
                            duration: 500,
                            create: { type: "linear", property: "scaleY" },
                            update: { type: 'linear', property: 'scaleY' },
                            delete: { type: 'linear', property: 'scaleY' },
                        })
                        setShowQuestionType(!showQuestionType)
                    }}
                >
                    <Icon
                        name={"arrow-left"}
                        size={22}
                        color={COLORS.gray}
                    />
                </TouchableOpacity>
            </Animated.View>
            {
                isLoading ?
                    <ActivityIndicator size={30} color={COLORS.gray} style={{ flex: 1 }} />
                    :
                    showQuestionType ?
                        <FlatList
                            data={arrQuestionType}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                backgroundColor: COLORS.white,
                            }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={[styles.btnCategory, { backgroundColor: getOptionBgColor(item) }]}
                                    onPress={() => {
                                        var newChooseQuestionType = [...chooseQuestionType]
                                        if (!newChooseQuestionType.includes(item)) {
                                            newChooseQuestionType.push(item);
                                        }
                                        else {
                                            newChooseQuestionType.splice(newChooseQuestionType.indexOf(item), 1)
                                        }
                                        setChooseQuestionType(newChooseQuestionType)
                                    }}>
                                    <Text style={[styles.txtCategory, { color: getOptionTxtCategory(item) }]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        :
                        <TextInput style={{ flex: 1, fontSize: 16 }}
                            value={txtSearch}
                            onChangeText={(txt) => setTxtSearch(txt)}
                            selectionColor={COLORS.primary}
                        />
            }

            {/*remove text in search */}
            {
                txtSearch !== "" && !showQuestionType &&
                <TouchableOpacity
                    onPress={() => setTxtSearch("")}
                    style={styles.btnRemoveTxtInSearch}
                >
                    <Icon
                        size={20}
                        color={COLORS.black}
                        name={"remove"}
                    />
                </TouchableOpacity>
            }

            {/*Button Search*/}
            <TouchableOpacity
                style={styles.btnSearch}
                activeOpacity={0.4}
                disabled={isLoading}
                onPress={() => handleSearch()}
            >
                <Icon
                    name="search"
                    size={22}
                    color={COLORS.gray}
                />
            </TouchableOpacity>

            {/*Modal to view Result */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.containerModal}>
                    <View style={styles.childModal}>
                        <View style={{ height: 40, width: "100%", backgroundColor: COLORS.white, elevation: 4 }}>

                            {/*Button close modal */}
                            <TouchableOpacity
                                style={styles.btnCloseModal}
                                activeOpacity={0.4}
                                onPress={() => {
                                    setModalVisible(false)
                                }} >
                                <Icon
                                    name={"close"}
                                    size={20}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={result}
                            showsVerticalScrollIndicator={false}
                            style={{
                                backgroundColor: COLORS.background,
                                paddingTop: 30,
                                paddingHorizontal: 10,
                            }}
                            renderItem={({ item }) => (
                                <ItemListQuestion
                                    itemQuestion={item}
                                />
                            )}
                            ListFooterComponent={
                                <View style={{ width: "100%", height: 30 }} />
                            }
                            ListEmptyComponent={
                                <Image
                                    source={img.noResult}
                                    resizeMode="stretch"
                                    style={{ width: "100%", height: 300 }}
                                />
                            }
                        />

                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.gray,
        borderRadius: 20,
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    containerModal: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    childModal: {
        height: "90%",
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 5,
    },
    btnCloseModal: {
        padding: 5,
        borderRadius: 3,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 4,
        bottom: 4,
        right: 5
    },
    btnGoBack: {
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 4,
        bottom: 4,
        left: 5
    },
    btnFilter: {
        backgroundColor: "transparent",
        padding: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    btnSearch: {
        backgroundColor: "transparent",
        padding: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    btnRemoveTxtInSearch: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    btnCategory: {
        backgroundColor: COLORS.gray,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        flexWrap: "wrap"
    },
    txtCategory: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.black
    },
})

export default React.memo(SearchBar)
