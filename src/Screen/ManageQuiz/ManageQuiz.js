import React from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated, FlatList, Alert, ToastAndroid, RefreshControl, ActivityIndicator, Image } from 'react-native'
import { COLORS } from '../../common/theme'
import { BASE_URL, webClientId } from '../../common/shareVarible'
import { screenName } from '../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux'
import { handleUserLogOut } from '.././../redux/Slice/userSlice'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from 'react-native-vector-icons/Octicons'
import Icon1 from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import FormButton from '../../components/FormButton'
import ItemQuiz from './components/ItemQuiz'
import ModalLoading from '../../components/ModalLoading'


GoogleSignin.configure({
    scopes: ['email'],
    webClientId: webClientId,
    offlineAccess: true
})

const ManageQuiz = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const internet = useSelector((state) => state.internet)
    const whenToFetchApi = useSelector((state) => state.whenToFetchApi)

    const [page, setPage] = React.useState(1)
    const [totalPage, setTotalPage] = React.useState(1)
    const [allQuizzes, setAllQuizzes] = React.useState([])
    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isLoadingOut, setIsLoadingOut] = React.useState(false)
    const [isShowBtnScrollUp, setIsShowBtnScrollUp] = React.useState(false)
    const flatlistRef = React.useRef()
    const currentOffset = React.useRef()
    const animBtn = React.useRef(new Animated.Value(1)).current

    const handleRefreshing = () => {
        setPage(1)
        getUserQuizzesForRefresing()
    }

    const handleLoadMore = () => {
        if (page + 1 <= totalPage) {
            setPage(prev => prev + 1)
        }
    }

    const Post_Logout = async () => {
        if (internet.isOnlineStatus) {
            try {
                setIsLoadingOut(true)
                var url = BASE_URL + "/user/logout"
                if (user.isLoginBySocial) {
                    await GoogleSignin.revokeAccess()
                    await GoogleSignin.signOut()
                    await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.userId
                        }),
                    })
                }
                else {
                    await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.userId
                        }),
                    })
                }

                await AsyncStorage.setItem('@userInfo', JSON.stringify(null))
                setIsLoadingOut(false)
                navigation.navigate(screenName.SignIn)

            } catch (error) {
                setIsLoadingOut(false)
                ToastAndroid.show(String(error), ToastAndroid.SHORT)
            }
        } else {
            ToastAndroid.show("No network connection", ToastAndroid.SHORT)
        }

    }

    const getUserQuizzes = async () => {
        setIsLoading(true)
        var url = BASE_URL + "/quiz/creator/" + user.userId + "?page=" + page
        try {
            await fetch(url, {
                method: "GET",
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
                                    setTotalPage(data.numberOfPages)
                                    setAllQuizzes(allQuizzes.concat(data.data))
                                })
                        }
                    } else {
                        Promise.resolve(response.json())
                            .then((data) => {
                                ToastAndroid.show(data.message, ToastAndroid.SHORT)
                            })
                    }
                }).finally(() => setIsLoading(false))
        } catch (error) {
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    const getUserQuizzesForRefresing = async () => {
        setRefreshing(true)
        var url = BASE_URL + "/quiz/creator/" + user.userId + "?page=1"
        try {
            await fetch(url, {
                method: "GET",
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
                                    setTotalPage(data.numberOfPages)
                                    setAllQuizzes(data.data)
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
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        if (user.token !== "" && page !== 1) {
            setIsLoading(true)
            setTimeout(() => getUserQuizzes(), 1500)
        }
    }, [user, page])


    React.useEffect(() => {
        if (user.token !== "") {
            handleRefreshing()
        }
    }, [whenToFetchApi.afterUpdateQuiz, whenToFetchApi.afterCreateQuiz, user])


    React.useEffect(() => {
        if (isShowBtnScrollUp) {
            Animated.timing(animBtn, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(animBtn, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start()
        }
    }, [isShowBtnScrollUp])


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={"light-content"} />
            <View style={styles.topBar}>
                <Text style={styles.title}>MANAGE QUIZ</Text>
                {
                    user.isLoginBySocial &&
                    <FormButton
                        labelText="Create quiz"
                        isPrimary={true}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon
                                    name={"plus-circle"}
                                    size={18}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        style={{ paddingLeft: 35, paddingRight: 20, borderRadius: 30 }}
                        handleOnPress={() => {
                            navigation.navigate(screenName.CreateQuiz)
                        }}
                    />
                }
            </View>

            {/**Button scroll to top and appear when scroll down */}
            <Animated.View style={[styles.btnScrollUp, {
                transform: [{ scale: animBtn }]
            }]}>
                <TouchableOpacity
                    style={{ padding: 10, borderRadius: 20 }}
                    disabled={!isShowBtnScrollUp}
                    onPress={() => flatlistRef.current.scrollToOffset({ animated: true, offset: 0 })} >
                    <Icon2
                        name={"arrow-up"}
                        color={COLORS.white}
                        size={20}
                    />
                </TouchableOpacity>
            </Animated.View>


            {/* Quiz list */}
            <FlatList
                ref={flatlistRef}
                data={allQuizzes}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefreshing}
                        progressBackgroundColor={COLORS.white}
                        colors={[COLORS.primary]} />
                }
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor: COLORS.background,
                    paddingTop: 30,
                    paddingHorizontal: 10,
                }}
                renderItem={({ item }) => (
                    <ItemQuiz
                        item={item}
                        onRefreshing={handleRefreshing}
                    />
                )}
                onScroll={(event) => {
                    let direction = Math.abs(event.nativeEvent.contentOffset.y) > currentOffset.current ? 'down' : 'up'
                    currentOffset.current = event.nativeEvent.contentOffset.y
                    if (currentOffset.current == 0) {
                        setIsShowBtnScrollUp(false)
                    }
                    else if (direction == "up") {
                        setIsShowBtnScrollUp(true)
                    } else {
                        setIsShowBtnScrollUp(false)
                    }
                }}
                ListHeaderComponent={
                    <View style={{ width: "100%", backgroundColor: COLORS.bgrForPrimary, alignItems: "center", borderRadius: 10, paddingVertical: 15, paddingHorizontal: 10, marginBottom: 35 }}>
                        <View style={{ marginBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", flexWrap: "wrap" }}>
                            {
                                user.photo !== "" &&
                                <Image
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                    resizeMode="stretch"
                                    source={{ uri: user.photo }}
                                />
                            }
                            <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.primary, marginLeft: 10 }}>{user.name}</Text>
                        </View>

                        <FormButton
                            labelText="LOG OUT"
                            disabled={!internet.isOnlineStatus}
                            style={{ width: "100%", backgroundColor: internet.isOnlineStatus ? COLORS.primary : COLORS.gray, borderColor: internet.isOnlineStatus ? COLORS.primary : COLORS.white }}
                            isPrimary={true}
                            children={
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 5,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Icon1
                                        name={"logout"}
                                        size={20}
                                        color={COLORS.white}
                                    />
                                </View>
                            }
                            handleOnPress={() => Alert.alert(
                                "OOPS !!!",
                                "You really want to log out ?",
                                [
                                    {
                                        text: "Yes",
                                        color: COLORS.primary,
                                        onPress: () => {
                                            Post_Logout()
                                            dispatch(handleUserLogOut())
                                        }
                                    },
                                    {
                                        text: "No"
                                    }
                                ],
                            )}
                        />
                    </View>
                }
                ListFooterComponent={
                    <View style={{ height: 60, width: "100%", alignItems: "center", justifyContent: "center", marginBottom: 120 }}>
                        {
                            isLoading ?
                                <ActivityIndicator size={40} color={COLORS.primary} />
                                :
                                page == totalPage || totalPage == 0 ?
                                    <Text style={{ fontSize: 16, color: COLORS.black, fontWeight: "bold" }}>LOAD ENOUGH DATA</Text>
                                    :
                                    <FormButton
                                        labelText="Load More"
                                        style={{ width: 120, borderRadius: 30 }}

                                        isPrimary={true}
                                        handleOnPress={() => handleLoadMore()}
                                    />
                        }
                    </View>
                }
            />
            {/*Modal loading appear when user log out */}
            <ModalLoading modalVisible={isLoadingOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 8,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        height: 60,
        paddingHorizontal: 20,
        elevation: 4
    },
    btnScrollUp: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 80,
        right: 20,
        zIndex: 1,
    },
    title: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: "400"
    }
})

export default ManageQuiz;
