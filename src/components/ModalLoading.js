import React from 'react'
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native'
import { COLORS } from '../common/theme'

const ModalLoading = ({ modalVisible }) => {

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.containerModal}>
                    <View style={styles.childModal}>
                        <ActivityIndicator size={80} color={COLORS.primary} />
                    </View>
                </View>
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
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

export default ModalLoading