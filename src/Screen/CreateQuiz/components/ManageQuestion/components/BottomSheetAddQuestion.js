import React from 'react'
import { View, StyleSheet } from 'react-native'
import { COLORS } from '../../../../../common/theme'
import { screenName } from '../../../../../navigator/screens-name'
import { useNavigation } from "@react-navigation/native"
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import FormButton from '../../../../../components/FormButton'

const BottomSheetAddQuestion = ({ bottomSheetModalRef }) => {

    const navigation = useNavigation()
    const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);

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
                    labelText="Cancel"
                    isPrimary={true}
                    style={{ marginBottom: 20 }}
                    handleOnPress={() => bottomSheetModalRef.current?.close()}
                />
            </View>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20
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
