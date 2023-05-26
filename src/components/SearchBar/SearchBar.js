import React from 'react'
import { View, Text, TouchableOpacity, ImageBackground, TextInput, Modal, StyleSheet, LayoutAnimation, FlatList, ToastAndroid, Animated, Easing, ActivityIndicator } from 'react-native'
import { COLORS } from '../../common/theme'
import { BASE_URL } from '../../common/shareVarible'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ItemResultQuiz from './components/ItemResultQuiz'
import ItemListQuestion from './components/ItemListQuestion'

const maxChooseCategory = 3

const SearchBar = ({ more, style }) => {

    const user = useSelector((state) => state.user)
    const rotateValue = React.useRef(new Animated.Value(0)).current

    const [txtSearch, setTxtSearch] = React.useState("")
    const [showCategories, setShowCategories] = React.useState(false)
    const [categories, setCategories] = React.useState([])
    const [chooseCategory, setChooseCategory] = React.useState([])
    const [result, SetResult] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [questionList, setQuestionList] = React.useState([])

    const getOptionTxtCategory = (item) => {
        if (chooseCategory.includes(item)) {
            return COLORS.white
        } else {
            return COLORS.black
        }
    }

    const getOptionBgColor = (item) => {
        if (chooseCategory.includes(item)) {
            return COLORS.primary
        } else {
            return COLORS.gray
        }
    }

    const handleSetQuestionList = (item) => {
        LayoutAnimation.configureNext({
            duration: 500,
            create: { type: "linear", property: "scaleXY" },
            update: { type: 'linear', property: 'scaleXY' },
            delete: { type: 'linear', property: 'scaleXY' },
        })
        setQuestionList(item)
    }

    const handleSearch = () => {
        if (txtSearch == "" && chooseCategory.length == 0) {
            ToastAndroid.show("Type something or choose category to search", ToastAndroid.SHORT)
        } else {
            setIsLoading(true)
            setTimeout(() => {
                Get_SearchQuiz()
                setIsLoading(false)
            }, 3000)
        }
    }

    const GET_AllCategory = async () => {
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
                })
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }

    const Get_SearchQuiz = async () => {
        var url = BASE_URL + "/quiz/search?" + "nameQuiz=" + txtSearch + "&tags=" + chooseCategory
        try {
            await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json"
                },
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
                }).finally(() => setModalVisible(true))
        } catch (error) {
            ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        GET_AllCategory()
    }, [])

    React.useEffect(() => {
        if (showCategories) {
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
    }, [showCategories])

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
                        setShowCategories(!showCategories)
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
                    <ActivityIndicator size={22} style={{ alignSelf: "center", flex: 1 }} color={COLORS.gray} />
                    :
                    showCategories ?
                        <FlatList
                            data={categories}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                backgroundColor: COLORS.white,
                            }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={[styles.btnCategory, { backgroundColor: getOptionBgColor(item.name) }]}
                                    onPress={() => {
                                        var newChooseCategory = [...chooseCategory]
                                        if (chooseCategory.length < maxChooseCategory) {
                                            if (!newChooseCategory.includes(item.name)) {
                                                newChooseCategory.push(item.name);
                                            }
                                            else {
                                                newChooseCategory.splice(newChooseCategory.indexOf(item.name), 1);
                                            }
                                        } else {
                                            newChooseCategory.splice(newChooseCategory.indexOf(item.name), 1);
                                        }
                                        setChooseCategory(newChooseCategory)
                                    }}>
                                    <Text style={[styles.txtCategory, { color: getOptionTxtCategory(item.name) }]}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        :
                        <TextInput style={{ flex: 1, fontSize: 16 }}
                            value={txtSearch}
                            onChangeText={(txt) => setTxtSearch(txt)}
                        />
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
                            {/*Button go back to Quiz List Flatlist just show when modal is viewing Question list */}
                            {
                                questionList.length !== 0 ?
                                    <TouchableOpacity
                                        style={styles.btnGoBack}
                                        activeOpacity={0.4}
                                        onPress={() => {
                                            handleSetQuestionList([])
                                        }} >
                                        <Icon
                                            name={"arrow-left"}
                                            size={20}
                                            color={COLORS.gray}
                                        />
                                    </TouchableOpacity>
                                    :
                                    null
                            }

                            {/*Button close modal */}
                            <TouchableOpacity
                                style={styles.btnCloseModal}
                                activeOpacity={0.4}
                                onPress={() => setModalVisible(false)} >
                                <Icon
                                    name={"close"}
                                    size={20}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>

                        {
                            questionList.length !== 0 ?
                                // Questions list 
                                <FlatList
                                    data={questionList}
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
                                />
                                :
                                //Quiz list 
                                <FlatList
                                    data={result}
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        backgroundColor: COLORS.background,
                                        paddingTop: 30,
                                        paddingHorizontal: 10,
                                    }}
                                    renderItem={({ item }) => (
                                        <ItemResultQuiz
                                            item={item}
                                            onChooseItem={handleSetQuestionList}
                                        />
                                    )}
                                    ListFooterComponent={
                                        <View style={{ width: "100%", height: 30 }} />
                                    }
                                    ListEmptyComponent={
                                        <ImageBackground
                                            style={{ height: 340, width: "100%" }}
                                            resizeMode={"stretch"}
                                            source={require("../../assets/image/no-result.png")}
                                        />
                                    }
                                />
                        }
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
        // backgroundColor: "red",
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
