import React from 'react'
import { Button, Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, Modal, Image, Alert, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../../common/theme'

const Test1 = () => {

    const [modalVisible, setModalVisible] = React.useState(false)

    return (
        <View style={styles.container}>
            <Button
                title="Show Modal"
                onPress={() => setModalVisible(true)}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.containerModal}>
                    <View style={styles.childModal}>

                        <ActivityIndicator size={80} color={COLORS.primary} />

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
                </View>
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
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
        height: 150,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        borderRadius: 20,
    },
    btnCloseModal: {
        height: 30,
        width: 30,
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

})

export default Test1