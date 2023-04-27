import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import FormButton from './FormButton';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '../constants/theme'

const ChooseImgBtn = ({
    setImageUri = null,
    imageUri = ""
}) => {

    // ref
    const bottomSheetModalRef = React.useRef(null);
    const snapPoints = React.useMemo(() => ["25%", "50%", "90%"], []);

    const selectImage = async () => {
        await ImagePicker.openPicker({
            cropping: false
        }).then(image => {
            setImageUri(image.path)
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    {imageUri == '' ? (
                        <TouchableOpacity
                            style={styles.btnChooseIMG}
                            onPress={() => bottomSheetModalRef.current?.present()}>
                            <Text style={styles.txtChooseIMG}>
                                + choose image
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => bottomSheetModalRef.current?.present()}>
                            <Image
                                source={{ uri: imageUri }}
                                resizeMode={'cover'}
                                style={styles.img}
                            />
                        </TouchableOpacity>
                    )}
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={1}
                        snapPoints={snapPoints}
                    >
                        <View style={styles.contentContainer}>
                            <FormButton
                                labelText="Take Photo"
                                isPrimary={true}
                                style={{ marginBottom: 20 }}
                                handleOnPress={() => selectImage()}
                            />
                            <FormButton
                                labelText="Choose From Library"
                                isPrimary={true}
                                style={{ marginBottom: 20 }}
                                handleOnPress={() => selectImage()}
                            />
                            <FormButton
                                labelText="Cancel"
                                isPrimary={true}
                                style={{ marginBottom: 20 }}
                                handleOnPress={() => bottomSheetModalRef.current?.close()}
                            />
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default ChooseImgBtn

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    txtChooseIMG: {
        opacity: 0.5,
        color: COLORS.primary
    },
    btnChooseIMG: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        backgroundColor: COLORS.primary + '20',
    },
    img: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    }
});

