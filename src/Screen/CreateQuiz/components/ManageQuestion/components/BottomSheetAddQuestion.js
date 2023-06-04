import React from 'react'
import { View, StyleSheet } from 'react-native'
import { COLORS } from '../../../../../common/theme'
import { screenName } from '../../../../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Icon1 from "react-native-vector-icons/MaterialIcons"
import FormButton from '../../../../../components/FormButton'
import ModalOptionAddQuestion from './ModalOptionAddQuestion'

const BottomSheetAddQuestion = ({ bottomSheetModalRef }) => {

    const navigation = useNavigation()
    const snapPoints = React.useMemo(() => ["50%", "50%"], [])
    const [modalVisible, setModalVisible] = React.useState(false)

    const handleOnPressModalVisible = () => {
        setModalVisible(!modalVisible)
        bottomSheetModalRef.current?.close()
    }

    return (

        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
        >
            <View style={styles.contentContainer}>
                <FormButton
                    labelText="Check Box"
                    isPrimary={true}
                    style={{ marginBottom: 20 }}
                    children={
                        <View style={styles.viewIcon}>
                            <Icon
                                name={"checkbox-multiple-marked"}
                                size={20}
                                color={COLORS.white}
                            />
                        </View>
                    }
                    handleOnPress={() => {
                        navigation.navigate(screenName.CheckBox)
                        bottomSheetModalRef.current?.close()
                    }}
                />
                <FormButton
                    labelText="Multiple Choice"
                    isPrimary={true}
                    style={{ marginBottom: 20 }}
                    children={
                        <View style={styles.viewIcon}>
                            <Icon
                                name={"check-circle"}
                                size={20}
                                color={COLORS.white}
                            />
                        </View>
                    }
                    handleOnPress={() => {
                        navigation.navigate(screenName.MultipleChoice)
                        bottomSheetModalRef.current?.close()
                    }}
                />
                <FormButton
                    labelText="Auto Add Question"
                    isPrimary={true}
                    style={{ marginBottom: 20 }}
                    children={
                        <View style={styles.viewIcon}>
                            <Icon1
                                name={"add-circle-outline"}
                                size={20}
                                color={COLORS.white}
                            />
                        </View>
                    }
                    handleOnPress={() => {
                        setModalVisible(true)
                    }}
                />
                <FormButton
                    labelText="Cancel"
                    isPrimary={false}
                    style={{ marginBottom: 20 }}
                    handleOnPress={() => bottomSheetModalRef.current?.close()}
                />
            </View>

            <ModalOptionAddQuestion modalVisible={modalVisible} onPressVisible={handleOnPressModalVisible} />
        </BottomSheetModal>

    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default BottomSheetAddQuestion;
