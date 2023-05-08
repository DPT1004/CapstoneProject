import React from 'react'
import { Text, StyleSheet, TouchableOpacity, Image, LayoutAnimation } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import { COLORS } from '../common/theme'

const ChooseImgBTN = ({ setImageUri, imageUri }) => {

    const selectImage = async () => {
        try {
            await ImagePicker.openPicker({
                cropping: false
            }).then(image => {
                setImageUri(image.path)
            });
        } catch (error) {
            if (error.code === 'E_PICKER_CANCELLED') {
                return false;
            }
        }
    };

    return (

        <>
            {imageUri == '' ? (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.btnChooseIMG}
                    onLongPress={() => selectImage()}>
                    <Text style={styles.txtChooseIMG}>
                        + choose image
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                        setImageUri("")
                    }}
                    onLongPress={() => selectImage()}>
                    <Image
                        source={{ uri: imageUri }}
                        resizeMode={"stretch"}
                        style={styles.img}
                    />
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
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
})

export default React.memo(ChooseImgBTN)

