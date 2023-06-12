import React from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, LayoutAnimation } from 'react-native'
import { COLORS } from '../../../../common/theme'
import { GET_getQuizBySearch, clearQuizList, setTxtSearch, setPage, setChooseCategories } from '../../../../redux/Slice/listQuizSlice'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ModalFilter from './components/ModalFilter'
import { FlatList } from 'react-native-gesture-handler'

const SearchBarQuiz = () => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const listQuiz = useSelector((state) => state.listQuiz)
    const [isSearching, setIsSearching] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)

    const handleOnPressModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.btnFilter}>
                    <Icon
                        name="filter"
                        size={22}
                        color={COLORS.gray}
                    />
                </TouchableOpacity>

                {/**TextInput search */}
                {
                    isSearching ?
                        <ActivityIndicator size={30} color={COLORS.gray} style={{ alignSelf: "center", flex: 1 }} />
                        :
                        <TextInput
                            style={styles.txtInput}
                            placeholder='Search quiz...'
                            value={listQuiz.txtSearch}
                            onChangeText={(txt) => dispatch(setTxtSearch(txt))}
                        />
                }

                {/*remove text in search */}
                {
                    listQuiz.txtSearch !== "" &&
                    <TouchableOpacity
                        onPress={() => dispatch(setTxtSearch(""))}
                        style={styles.btnRemoveTxtInSearch}
                    >
                        <Icon
                            size={20}
                            color={COLORS.black}
                            name={"remove"}
                        />
                    </TouchableOpacity>
                }

                {/**Button search */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.btnSearch}
                    onPress={() => {
                        setIsSearching(true)
                        dispatch(clearQuizList())
                        dispatch(setPage(1))
                        dispatch(GET_getQuizBySearch({ token: user.token, currentPage: 1, txtSearch: listQuiz.txtSearch, chooseCategories: listQuiz.chooseCategories }))
                            .then(() => setIsSearching(false))
                    }}
                >
                    <Icon
                        name="search"
                        size={22}
                        color={COLORS.white}
                    />
                </TouchableOpacity>

            </View>

            {/**Show categories was choose and can remove it */}
            <FlatList
                data={listQuiz.chooseCategories}
                horizontal
                style={{ marginVertical: 5 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

                            var newChooseCategory = [...listQuiz.chooseCategories]
                            newChooseCategory.splice(index, 1)
                            dispatch(setChooseCategories(newChooseCategory))
                        }}
                        style={styles.btnRemoveCategory}>
                        <Text style={styles.txtChooseCateogries}>{item}</Text>
                        <Icon
                            size={20}
                            color={COLORS.black}
                            name={"remove"}
                        />
                    </TouchableOpacity>}
            />

            {/**Modal to choose category */}
            <ModalFilter modalVisible={modalVisible} onPressVisible={handleOnPressModalVisible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 2,
        borderColor: COLORS.gray,
        borderRadius: 30,
    },
    txtInput: {
        flex: 1,
        borderLeftWidth: 2,
        borderColor: COLORS.gray,
        fontSize: 16,
        paddingHorizontal: 5
    },
    txtChooseCateogries: {
        color: COLORS.black,
        fontSize: 15,
        marginRight: 5
    },
    btnSearch: {
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        elevation: 20,
        shadowColor: COLORS.primary,
        padding: 15
    },
    btnRemoveTxtInSearch: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    btnRemoveCategory: {
        flexDirection: "row",
        backgroundColor: COLORS.gray,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        borderRadius: 5
    },
    btnFilter: {
        backgroundColor: "transparent",
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})
export default SearchBarQuiz
