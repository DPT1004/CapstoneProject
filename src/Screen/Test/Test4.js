import React from "react"
import { COLORS, SIZES } from '../../common/theme'
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native"
import ChooseFileBTN from '../../components/ChooseFileBTN'
import { WebView } from 'react-native-webview'
import RangeSlider from '../../components/RangeSlider/RangeSlider'
import YoutubePlayer from "react-native-youtube-iframe"

const Test4 = () => {
    const [fileUri, setFileUri] = React.useState({
        type: "youtube",
        path: "",
        timeStart: 0,
        timeEnd: 0
    })

    return (
        <View style={styles.container}>
            {/* Image/Video/Youtube for Question upload */}
            <ChooseFileBTN setFileUri={setFileUri} fileUri={fileUri} />

        </View>
    )
}

export default Test4

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        // alignItems: "center"
    },
    btnSetting: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        top: 19,
        left: 10
    },

});